/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Student, StudentSubject, SubjectStats, ExamData, ParsedResult } from "../types";

export const SUBJECT_MAP: Record<string, string> = {
  // Class 12
  "301": "English Core",
  "302": "Hindi Core",
  "041": "Mathematics",
  "042": "Physics",
  "043": "Chemistry",
  "044": "Biology",
  "030": "Economics",
  "054": "Business Studies",
  "055": "Accountancy",
  "027": "History",
  "028": "Political Sci.",
  "039": "Sociology",
  "048": "Physical Education",
  "083": "Computer Science",
  "065": "Informatics Practices",
  "805": "Financial Markets Management",
  "029": "Geography",
  "037": "Psychology",
  "045": "Biotechnology",
  "046": "Applied Mathematics (XII)",

  // Class 10
  "184": "English Lang & Lit",
  "002": "Hindi Course-A",
  "085": "Hindi Course-B",
  "041X": "Mathematics Standard", // Handled dynamically or merged
  "241": "Mathematics Basic",
  "086": "Science",
  "087": "Social Science",
  "405": "Introduction to Financial Markets",
  "165": "Computer Applications",
  "402": "Information Technology",
  "006": "Sanskrit Course-A",
  "122": "Sanskrit",
};

export function getSubjectName(code: string, examType: "Class X" | "Class XII"): string {
  // Dynamic handling for duplicate codes
  if (code === "041") {
    return examType === "Class X" ? "Mathematics Standard" : "Mathematics";
  }
  if (code === "805") {
    return examType === "Class X" ? "Financial Markets" : "Financial Markets Management";
  }
  if (SUBJECT_MAP[code]) {
    return SUBJECT_MAP[code];
  }
  return `Subject ${code}`;
}

// Stream classification for Class XII
export function determineStream(subjectCodes: string[]): "Science" | "Commerce" | "Humanities" | "General" {
  const codesSet = new Set(subjectCodes);
  
  // Science: Physics (042) and Chemistry (043)
  if (codesSet.has("042") && codesSet.has("043")) {
    return "Science";
  }
  // Commerce: Business Studies (054) and Accountancy (055)
  if (codesSet.has("054") && codesSet.has("055")) {
    return "Commerce";
  }
  // Humanities: History (027) or Political Sci (028) or Sociology (039)
  if (codesSet.has("027") || codesSet.has("028") || codesSet.has("039")) {
    return "Humanities";
  }
  return "General";
}

export function parseCBSEResult(rawText: string): ParsedResult {
  const lines = rawText.split(/\r?\n/);
  
  // Extract region name dynamically
  const regionMatch = rawText.match(/(?:REGION|REGN)\s*:\s*([A-Za-z\s]+?)(?=\s{2,}|$)/i);
  const detectedRegion = regionMatch ? regionMatch[1].trim().toUpperCase() : "BHOPAL";
  
  let currentExamType: "Class X" | "Class XII" = "Class XII"; // default
  let currentSchool: { code: string; name: string } | null = null;
  
  const classXStudents: Student[] = [];
  const classXIIStudents: Student[] = [];
  
  let pendingStudent: {
    rollNo: string;
    gender: "M" | "F";
    name: string;
    subjectCodes: string[];
    internalGrades: string[];
    result: string;
    compartmentSubjects: string[];
  } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // 1. Detect Exam Type
    if (line.includes("SENIOR SCHOOL CERTIFICATE EXAMINATION")) {
      currentExamType = "Class XII";
      continue;
    } else if (line.includes("ALL INDIA SECONDARY SCHOOL EXAMINATION")) {
      currentExamType = "Class X";
      continue;
    }
    
    // 2. Detect School
    if (line.includes("SCHOOL : -")) {
      const schoolMatch = line.match(/SCHOOL\s*:\s*-\s*(\d+)\s+(.+)$/);
      if (schoolMatch) {
        currentSchool = {
          code: schoolMatch[1].trim(),
          name: schoolMatch[2].trim(),
        };
      }
      continue;
    }
    
    // 3. Detect Student Info Line (Starts with 8 digits roll number)
    const rollMatch = line.match(/^\s*(\d{8})\s+([MF])\s+(.+)$/);
    if (rollMatch) {
      // If we had a pending student, finalize them first (e.g. if their marks line was missing)
      if (pendingStudent) {
        finalizeAndAddStudent(pendingStudent, [], currentExamType, classXStudents, classXIIStudents);
        pendingStudent = null;
      }
      
      const rollNo = rollMatch[1];
      const gender = rollMatch[2] as "M" | "F";
      const remainingText = rollMatch[3];
      
      const tokens = remainingText.trim().split(/\s+/);
      
      // Separate student name from subject codes and results
      // Name is everything up to the first 3-digit subject code token
      const nameParts: string[] = [];
      let tokenIdx = 0;
      
      while (tokenIdx < tokens.length) {
        const token = tokens[tokenIdx];
        if (/^\d{3}$/.test(token)) {
          break; // Hit a subject code
        }
        nameParts.push(token);
        tokenIdx++;
      }
      
      const name = nameParts.join(" ");
      
      // Parse Subject Codes (usually 5 or 6 consecutive 3-digit codes)
      const subjectCodes: string[] = [];
      while (tokenIdx < tokens.length && /^\d{3}$/.test(tokens[tokenIdx])) {
        subjectCodes.push(tokens[tokenIdx]);
        tokenIdx++;
      }
      
      // Internal grades (e.g. A1 B1 A2) - typically 3 grades for Class XII, none for Class X
      const internalGrades: string[] = [];
      while (
        tokenIdx < tokens.length &&
        /^[A-E][1-2]?$/.test(tokens[tokenIdx]) &&
        !/^(PASS|COMP|ABST|FAIL|ESSENTIAL|REPEAT)$/.test(tokens[tokenIdx])
      ) {
        internalGrades.push(tokens[tokenIdx]);
        tokenIdx++;
      }
      
      // Parse Result
      let result = "PASS";
      const resultParts: string[] = [];
      
      while (tokenIdx < tokens.length) {
        const token = tokens[tokenIdx];
        if (/^(PASS|COMP|ABST|FAIL|ESSENTIAL|REPEAT|COMPTT\.)$/.test(token)) {
          resultParts.push(token);
          tokenIdx++;
        } else {
          break;
        }
      }
      
      if (resultParts.length > 0) {
        result = resultParts.join(" ");
        if (result === "ESSENTIAL REPEAT") {
          result = "ESSENTIAL REPEAT";
        } else if (result.includes("COMP")) {
          result = "COMP";
        }
      }
      
      // Any remaining 3-digit numbers are Compartment Subjects
      const compartmentSubjects: string[] = [];
      while (tokenIdx < tokens.length) {
        const token = tokens[tokenIdx];
        if (/^\d{3}$/.test(token)) {
          compartmentSubjects.push(token);
        }
        tokenIdx++;
      }
      
      pendingStudent = {
        rollNo,
        gender,
        name,
        subjectCodes,
        internalGrades,
        result,
        compartmentSubjects,
      };
      
      continue;
    }
    
    // 4. Detect Student Marks/Grades Line
    // If we have a pending student and this line starts with whitespace and has content
    if (pendingStudent && line.trim().length > 0 && /^\s+\d{3}/.test(line)) {
      const marksTokens = line.trim().split(/\s+/);
      finalizeAndAddStudent(pendingStudent, marksTokens, currentExamType, classXStudents, classXIIStudents);
      pendingStudent = null;
    } else if (pendingStudent && line.trim().length > 0) {
      // If we see another non-empty line that isn't a marks line, the student might be absent or has no marks listed
      // Finalize the student with empty marks
      finalizeAndAddStudent(pendingStudent, [], currentExamType, classXStudents, classXIIStudents);
      pendingStudent = null;
    }
  }
  
  // Finalize any trailing student
  if (pendingStudent) {
    finalizeAndAddStudent(pendingStudent, [], currentExamType, classXStudents, classXIIStudents);
  }
  
  // 5. Generate Subject Stats for both Class X and XII
  const classXData = compileExamData("Class X", currentSchool, classXStudents);
  const classXIIData = compileExamData("Class XII", currentSchool, classXIIStudents);
  
  classXData.region = detectedRegion;
  classXIIData.region = detectedRegion;
  
  return {
    classX: classXStudents.length > 0 ? classXData : null,
    classXII: classXIIStudents.length > 0 ? classXIIData : null,
  };
}

function finalizeAndAddStudent(
  pending: {
    rollNo: string;
    gender: "M" | "F";
    name: string;
    subjectCodes: string[];
    internalGrades: string[];
    result: string;
    compartmentSubjects: string[];
  },
  marksTokens: string[],
  examType: "Class X" | "Class XII",
  classXStudents: Student[],
  classXIIStudents: Student[]
) {
  const subjects: StudentSubject[] = [];
  
  // Pair subject codes with marks & grades
  for (let j = 0; j < pending.subjectCodes.length; j++) {
    const code = pending.subjectCodes[j];
    const subName = getSubjectName(code, examType);
    
    // The marks line contains [marks, grade, marks, grade, ...]
    const mIdx = j * 2;
    const gIdx = j * 2 + 1;
    
    const rawMarks = mIdx < marksTokens.length ? marksTokens[mIdx] : "ABST";
    const grade = gIdx < marksTokens.length ? marksTokens[gIdx] : "E";
    
    const numericMarks = isNaN(parseInt(rawMarks, 10)) ? 0 : parseInt(rawMarks, 10);
    
    subjects.push({
      code,
      name: subName,
      marks: numericMarks,
      marksRaw: rawMarks,
      grade,
    });
  }
  
  // Calculate Totals
  const marksList = subjects.map(s => s.marks);
  
  // Main 5 Total: Sum of first 5 subjects listed
  const main5Total = marksList.slice(0, 5).reduce((a, b) => a + b, 0);
  
  // Best 5 Total: Sum of the highest 5 marks
  const sortedMarks = [...marksList].sort((a, b) => b - a);
  const best5Total = sortedMarks.slice(0, 5).reduce((a, b) => a + b, 0);
  const best5Percentage = parseFloat((best5Total / 5).toFixed(2));
  
  const stream = examType === "Class XII" ? determineStream(pending.subjectCodes) : "General";
  
  const student: Student = {
    rollNo: pending.rollNo,
    gender: pending.gender,
    name: pending.name,
    subjects,
    internalGrades: pending.internalGrades,
    result: pending.result,
    compartmentSubjects: pending.compartmentSubjects,
    main5Total,
    best5Total,
    best5Percentage,
    stream,
  };
  
  if (examType === "Class X") {
    classXStudents.push(student);
  } else {
    classXIIStudents.push(student);
  }
}

function compileExamData(
  examType: "Class X" | "Class XII",
  school: { code: string; name: string } | null,
  students: Student[]
): ExamData {
  const subjectsMap: Record<string, {
    code: string;
    name: string;
    marksList: number[];
    grades: Record<string, number>;
    highest: number;
  }> = {};
  
  // Collect data per subject
  students.forEach(student => {
    student.subjects.forEach(sub => {
      // If student is absent, do not count them as appeared in this subject
      const isAbsent = sub.marksRaw === "ABST";
      
      if (!subjectsMap[sub.code]) {
        subjectsMap[sub.code] = {
          code: sub.code,
          name: sub.name,
          marksList: [],
          grades: { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0, D1: 0, D2: 0, E: 0 },
          highest: 0,
        };
      }
      
      const subInfo = subjectsMap[sub.code];
      
      if (!isAbsent) {
        subInfo.marksList.push(sub.marks);
        if (sub.marks > subInfo.highest) {
          subInfo.highest = sub.marks;
        }
      }
      
      // Increment grade counts
      const standardGrade = sub.grade.trim() as keyof typeof subInfo.grades;
      if (subInfo.grades[standardGrade] !== undefined) {
        subInfo.grades[standardGrade]++;
      } else if (sub.grade.trim() === "E" || sub.grade.trim() === "E1" || sub.grade.trim() === "E2") {
        subInfo.grades["E"]++;
      }
    });
  });
  
  // Calculate final stats per subject
  const subjectStats: SubjectStats[] = Object.values(subjectsMap).map(sub => {
    const appeared = sub.marksList.length;
    
    // Mean Score
    const totalMarks = sub.marksList.reduce((a, b) => a + b, 0);
    const meanScore = appeared > 0 ? parseFloat((totalMarks / appeared).toFixed(2)) : 0;
    
    // Performance Index (PI) %
    // Grade points: A1=8, A2=7, B1=6, B2=5, C1=4, C2=3, D1=2, D2=1, E=0
    const pointsMap: Record<string, number> = {
      A1: 8, A2: 7, B1: 6, B2: 5, C1: 4, C2: 3, D1: 2, D2: 1, E: 0
    };
    
    let totalPoints = 0;
    Object.entries(sub.grades).forEach(([grade, count]) => {
      totalPoints += (pointsMap[grade] || 0) * count;
    });
    
    const pi = appeared > 0 ? parseFloat(((totalPoints / (appeared * 8)) * 100).toFixed(2)) : 0;
    
    return {
      code: sub.code,
      name: sub.name,
      appeared,
      grades: sub.grades as SubjectStats["grades"],
      highest: sub.highest,
      meanScore,
      pi,
    };
  });
  
  return {
    examType,
    school: school || { code: "50018", name: "MAHARISHI VIDYA MANDIR DERI ROAD CHHATARPUR MP" },
    students,
    subjectStats,
  };
}
