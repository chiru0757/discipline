
import { Student, DisciplineRecord, CourseType, YearType, COURSE_CAPACITIES } from '../types';

// Mock DB implementation using LocalStorage to simulate persistent cloud DB (Supabase-style)
const RECORDS_KEY = 'rnsfgc_records_db';

export const getStudents = (course: CourseType, year: YearType): Student[] => {
  const capacity = COURSE_CAPACITIES[course] || 0;
  // Deterministic mock generation
  return Array.from({ length: capacity / 3 }).map((_, i) => {
    const id = (i + 1).toString().padStart(3, '0');
    return {
      uucms_no: `${course}${year.charAt(0)}${id}`,
      name: `Student ${course}-${year.charAt(0)}-${id}`,
      course,
      year
    };
  });
};

export const saveRecord = (record: Omit<DisciplineRecord, 'id' | 'created_at'>): DisciplineRecord => {
  const newRecord: DisciplineRecord = {
    ...record,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString()
  };

  const currentRecords = getRecords();
  localStorage.setItem(RECORDS_KEY, JSON.stringify([...currentRecords, newRecord]));
  return newRecord;
};

export const getRecords = (uucms_no?: string): DisciplineRecord[] => {
  const data = localStorage.getItem(RECORDS_KEY);
  const records: DisciplineRecord[] = data ? JSON.parse(data) : [];
  
  if (uucms_no) {
    return records.filter(r => r.uucms_no === uucms_no);
  }
  return records;
};

export const getAllRecordsCountByUUCMS = (uucms_no: string): { [issue: string]: number } => {
  const records = getRecords(uucms_no);
  return records.reduce((acc, curr) => {
    acc[curr.issue_type] = (acc[curr.issue_type] || 0) + 1;
    return acc;
  }, {} as { [issue: string]: number });
};
