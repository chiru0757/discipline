
# Supabase Backend Implementation Guide

To make this application production-ready with a persistent backend that syncs across devices, follow these steps to set up Supabase.

## 1. Project Setup
1. Create a project at [supabase.com](https://supabase.com).
2. Go to **SQL Editor** and run the following script to create your database tables.

```sql
-- Create Users/Profiles table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT')),
  name TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create Students directory
CREATE TABLE public.students (
  uucms_no TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  course TEXT CHECK (course IN ('BCA', 'BCOM', 'BBA')),
  year TEXT CHECK (year IN ('1st Year', '2nd Year', '3rd Year')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create Discipline Records
CREATE TABLE public.discipline_records (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  uucms_no TEXT REFERENCES public.students(uucms_no) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  reason TEXT,
  reported_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Policy to allow authenticated users to read profiles
CREATE POLICY "Allow read for all authenticated" ON public.profiles
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy to allow teachers/admins to insert discipline records
CREATE POLICY "Allow teachers to insert records" ON public.discipline_records
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
```

## 2. Environment Variables
Add these to your project (usually in a `.env` file):
- `VITE_SUPABASE_URL`: Your Supabase Project URL.
- `VITE_SUPABASE_ANON_KEY`: Your Supabase API Key.

## 3. Integration Code
Replace `services/dataService.ts` with Supabase client calls:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const saveRecordToSupabase = async (uucms: string, issue: string, reason: string) => {
  const { data, error } = await supabase
    .from('discipline_records')
    .insert([{ uucms_no: uucms, issue_type: issue, reason: reason }]);
  return { data, error };
};

export const fetchStudentRecords = async (uucms: string) => {
  const { data, error } = await supabase
    .from('discipline_records')
    .select('*')
    .eq('uucms_no', uucms);
  return { data, error };
};
```

## 4. Authentication
Use `supabase.auth.signInWithPassword()` in your `Login.tsx` component to authenticate users against the Supabase Auth database.
