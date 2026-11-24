/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import * as XLSX from "xlsx";
import { ExamData, Student } from "../types";

export function exportToExcel(examData: ExamData): void {
  const wb = XLSX.utils.book_new();
  const examType = examData.examType;

  // ----------------------------------------------------
  // 1. SHEET 1: All Students Master
  // ----------------------------------------------------
  const masterHeaders = [
    "S.No",
    "Roll No",
    "Student Name",
    "Gender",
    "Stream",
    "Result",
    "Main 5 Total",
    "Best 5 Total",
    "Best 5 %",
    "Sub 1 Code", "Sub 1 Name", "Sub 1 Mark", "Sub 1 Grade",
    "Sub 2 Code", "Sub 2 Name", "Sub 2 Mark", "Sub 2 Grade",
    "Sub 3 Code", "Sub 3 Name", "Sub 3 Mark", "Sub 3 Grade",
    "Sub 4 Code", "Sub 4 Name", "Sub 4 Mark", "Sub 4 Grade",
    "Sub 5 Code", "Sub 5 Name", "Sub 5 Mark", "Sub 5 Grade",
    "Sub 6 Code", "Sub 6 Name", "Sub 6 Mark", "Sub 6 Grade"
  ];

  const masterRows: any[][] = [masterHeaders];

  examData.students.forEach((student, idx) => {
    const row: any[] = [
      idx + 1,
      student.rollNo,
      student.name,
      student.gender,
      student.stream,
      student.result,
      student.main5Total,
      student.best5Total,
      student.best5Percentage
    ];

    // Append up to 6 subjects
    for (let sIdx = 0; sIdx < 6; sIdx++) {
      if (sIdx < student.subjects.length) {
        const sub = student.subjects[sIdx];
        row.push(sub.code, sub.name, sub.marks, sub.grade);
      } else {
        row.push("", "", "", "");
      }
    }

    masterRows.push(row);
  });

  const wsMaster = XLSX.utils.aoa_to_sheet(masterRows);
  
  // Apply clean column widths
  wsMaster["!cols"] = [
    { wch: 6 },  // S.No
    { wch: 12 }, // Roll No
    { wch: 25 }, // Name
    { wch: 8 },  // Gender
    { wch: 12 }, // Stream
    { wch: 10 }, // Result
    { wch: 12 }, // Main 5
    { wch: 12 }, // Best 5
    { wch: 10 }, // Best 5 %
    // Subjects
    ...Array(6).fill([
      { wch: 10 }, // Code
      { wch: 20 }, // Name
      { wch: 10 }, // Mark
      { wch: 8 }   // Grade
    ]).flat()
  ];

  XLSX.utils.book_append_sheet(wb, wsMaster, "All Students Master");

  // ----------------------------------------------------
  // 2. SHEET 2: Subject PI & Avg
  // ----------------------------------------------------
  const piHeaders = [
    "Code",
    "Subject Name",
    "Appeared",
    "A1",
    "A2",
    "B1",
    "B2",
    "C1",
    "C2",
    "D1",
    "D2",
    "E",
    "Highest",
    "Mean Score",
    "PI %"
  ];

  const piRows: any[][] = [piHeaders];

  examData.subjectStats.forEach(stat => {
    piRows.push([
      stat.code,
      stat.name,
      stat.appeared,
      stat.grades.A1,
      stat.grades.A2,
      stat.grades.B1,
      stat.grades.B2,
      stat.grades.C1,
      stat.grades.C2,
      stat.grades.D1,
      stat.grades.D2,
      stat.grades.E,
      stat.highest,
      stat.meanScore,
      stat.pi
    ]);
  });

  const wsPI = XLSX.utils.aoa_to_sheet(piRows);
  wsPI["!cols"] = [
    { wch: 8 },  // Code
    { wch: 25 }, // Name
    { wch: 10 }, // Appeared
    ...Array(9).fill({ wch: 6 }), // Grades
    { wch: 10 }, // Highest
    { wch: 12 }, // Mean
    { wch: 10 }  // PI
  ];

  XLSX.utils.book_append_sheet(wb, wsPI, "Subject PI & Avg");

  // ----------------------------------------------------
  // 3. SHEET 3: Percentage Range Dist
  // ----------------------------------------------------
  // Headers with merged range grouping as requested
  const rangeHeaderRow1 = [
    "Subject Code & Name",
    "0 - 32 (Fail)", "", "",
    "33 - 44", "", "",
    "45 - 59", "", "",
    "60 - 74", "", "",
    "75 - 89", "", "",
    "90 - 100", "", ""
  ];

  const rangeHeaderRow2 = [
    "",
    "B", "G", "T",
    "B", "G", "T",
    "B", "G", "T",
    "B", "G", "T",
    "B", "G", "T",
    "B", "G", "T"
  ];

  const rangeRows: any[][] = [rangeHeaderRow1, rangeHeaderRow2];

  // Helper to define range bins
  const getRangeBin = (marks: number): number => {
    if (marks <= 32) return 0; // 0-32
    if (marks <= 44) return 1; // 33-44
    if (marks <= 59) return 2; // 45-59
    if (marks <= 74) return 3; // 60-74
    if (marks <= 89) return 4; // 75-89
    return 5;                  // 90-100
  };

  examData.subjectStats.forEach(stat => {
    // 6 ranges, each has Boys, Girls, Total
    const bins = Array.from({ length: 6 }, () => ({ B: 0, G: 0, T: 0 }));

    examData.students.forEach(student => {
      const sub = student.subjects.find(s => s.code === stat.code);
      if (sub && sub.marksRaw !== "ABST") {
        const binIdx = getRangeBin(sub.marks);
        const gender = student.gender === "M" ? "B" : "G";
        bins[binIdx][gender]++;
        bins[binIdx].T++;
      }
    });

    const row: any[] = [`${stat.code} - ${stat.name}`];
    bins.forEach(bin => {
      row.push(bin.B, bin.G, bin.T);
    });

    rangeRows.push(row);
  });

  const wsRange = XLSX.utils.aoa_to_sheet(rangeRows);
  
  // Set merges for top row headings
  wsRange["!merges"] = [
    { s: { r: 0, c: 1 }, e: { r: 0, c: 3 } },   // 0-32 Merge
    { s: { r: 0, c: 4 }, e: { r: 0, c: 6 } },   // 33-44 Merge
    { s: { r: 0, c: 7 }, e: { r: 0, c: 9 } },   // 45-59 Merge
    { s: { r: 0, c: 10 }, e: { r: 0, c: 12 } }, // 60-74 Merge
    { s: { r: 0, c: 13 }, e: { r: 0, c: 15 } }, // 75-89 Merge
    { s: { r: 0, c: 16 }, e: { r: 0, c: 18 } }, // 90-100 Merge
    { s: { r: 0, c: 0 }, e: { r: 1, c: 0 } }    // Subject Col Merge
  ];

  wsRange["!cols"] = [
    { wch: 35 }, // Subject
    ...Array(18).fill({ wch: 5 }) // Small cols for B, G, T counts
  ];

  XLSX.utils.book_append_sheet(wb, wsRange, "Percentage Range Dist");

  // ----------------------------------------------------
  // 4. SHEET 4 onwards: Top 10 Student Subjectwise
  // ----------------------------------------------------
  // One sheet per subject code in the raw file
  examData.subjectStats.forEach(stat => {
    // Sort students by their mark in this specific subject
    const subjectStudents: { student: Student; marks: number; grade: string }[] = [];

    examData.students.forEach(student => {
      const sub = student.subjects.find(s => s.code === stat.code);
      if (sub && sub.marksRaw !== "ABST") {
        subjectStudents.push({
          student,
          marks: sub.marks,
          grade: sub.grade
        });
      }
    });

    // Sort descending by subject marks, then Best 5 Percentage as tie-breaker
    subjectStudents.sort((a, b) => {
      if (b.marks !== a.marks) {
        return b.marks - a.marks;
      }
      return b.student.best5Percentage - a.student.best5Percentage;
    });

    const top10 = subjectStudents.slice(0, 10);

    const topperHeaders = [
      "Rank",
      "Student Name",
      "Roll Number",
      "Subject Marks",
      "Subject Grade",
      "Main 5 Total",
      "Best 5 Total",
      "Best 5 %"
    ];

    const topperRows: any[][] = [
      [`Top 10 Performers - ${stat.code} ${stat.name}`],
      [],
      topperHeaders
    ];

    top10.forEach((item, rIdx) => {
      topperRows.push([
        rIdx + 1,
        item.student.name,
        item.student.rollNo,
        item.marks,
        item.grade,
        item.student.main5Total,
        item.student.best5Total,
        item.student.best5Percentage
      ]);
    });

    const wsToppers = XLSX.utils.aoa_to_sheet(topperRows);
    wsToppers["!cols"] = [
      { wch: 6 },  // Rank
      { wch: 25 }, // Name
      { wch: 12 }, // Roll
      { wch: 14 }, // Subject Marks
      { wch: 14 }, // Subject Grade
      { wch: 12 }, // Main 5
      { wch: 12 }, // Best 5
      { wch: 10 }  // Best 5 %
    ];

    // Excel sheets have 31 char limit, so name them "Top 10 - [SubCode]"
    const safeSheetName = `Top 10 - ${stat.code}`;
    XLSX.utils.book_append_sheet(wb, wsToppers, safeSheetName);
  });

  // ----------------------------------------------------
  // WRITE AND DOWNLOAD WORKBOOK
  // ----------------------------------------------------
  XLSX.writeFile(wb, `${examType.replace(/\s+/g, "_")}_Result_Analysis.xlsx`);
}
