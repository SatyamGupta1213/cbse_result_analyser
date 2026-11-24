/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StudentSubject {
  code: string;
  name: string;
  marks: number;       // Numeric mark (0-100)
  marksRaw: string;    // Raw string (e.g. "077", "ABST")
  grade: string;       // Grade (e.g. "A1", "B2", "E")
}

export interface Student {
  rollNo: string;
  gender: "M" | "F";
  name: string;
  subjects: StudentSubject[];
  internalGrades: string[];
  result: string;       // "PASS", "COMP", "ESSENTIAL REPEAT", "ABST", etc.
  compartmentSubjects: string[];
  main5Total: number;
  best5Total: number;
  best5Percentage: number;
  stream: "Science" | "Commerce" | "Humanities" | "General";
}

export interface SubjectStats {
  code: string;
  name: string;
  appeared: number;
  grades: {
    A1: number;
    A2: number;
    B1: number;
    B2: number;
    C1: number;
    C2: number;
    D1: number;
    D2: number;
    E: number;
  };
  highest: number;
  meanScore: number;
  pi: number; // Performance Index %
}

export interface SchoolInfo {
  code: string;
  name: string;
}

export interface ExamData {
  examType: "Class X" | "Class XII";
  school: SchoolInfo;
  students: Student[];
  subjectStats: SubjectStats[];
  region?: string;
}

export interface ParsedResult {
  classX: ExamData | null;
  classXII: ExamData | null;
}
