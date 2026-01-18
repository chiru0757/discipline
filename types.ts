
export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export type CourseType = 'BCA' | 'BCOM' | 'BBA';
export type YearType = '1st Year' | '2nd Year' | '3rd Year';

export interface User {
  id: string;
  email: string;
  role: Role;
  name: string;
}

export interface Student {
  uucms_no: string;
  name: string;
  course: CourseType;
  year: YearType;
}

export interface DisciplineRecord {
  id: string;
  uucms_no: string;
  issue_type: string;
  reason: string;
  created_at: string;
  reported_by: string;
}

export const DISCIPLINE_ISSUES = [
  "Uniform Violation",
  "Late to Class",
  "Mobile Usage",
  "Misbehavior",
  "Low Attendance",
  "ID Card Missing",
  "Other"
];

export const COURSE_CAPACITIES = {
  BCA: 240,
  BCOM: 360,
  BBA: 180
};
