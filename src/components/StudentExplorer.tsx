/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { ExamData, Student } from "../types";
import { Search, BookOpen, GraduationCap, ArrowRight, User } from "lucide-react";

interface StudentExplorerProps {
  data: ExamData;
}

export default function StudentExplorer({ data }: StudentExplorerProps) {
  const [searchRoll, setSearchRoll] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [searchError, setSearchError] = useState("");

  const [selectedSubjectCode, setSelectedSubjectCode] = useState("");

  // Populate first subject as default deep-dive subject
  React.useEffect(() => {
    if (data.subjectStats.length > 0 && !selectedSubjectCode) {
      setSelectedSubjectCode(data.subjectStats[0].code);
    }
  }, [data.subjectStats, selectedSubjectCode]);

  // Find individual student handler
  const handleStudentSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError("");
    setSelectedStudent(null);

    const rollClean = searchRoll.trim();
    if (!rollClean) {
      setSearchError("Please enter a roll number.");
      return;
    }

    const found = data.students.find(s => s.rollNo === rollClean);
    if (found) {
      setSelectedStudent(found);
    } else {
      setSearchError(`Roll number "${rollClean}" not found in this dataset.`);
    }
  };

  // Find selected subject stats
  const activeSubjectStats = useMemo(() => {
    return data.subjectStats.find(s => s.code === selectedSubjectCode) || null;
  }, [data.subjectStats, selectedSubjectCode]);

  // Find students taking this subject, sorted descending by mark
  const subjectStudentList = useMemo(() => {
    if (!selectedSubjectCode) return [];
    return data.students
      .map(student => {
        const sub = student.subjects.find(s => s.code === selectedSubjectCode);
        return {
          student,
          sub,
        };
      })
      .filter(item => item.sub !== undefined && item.sub.marksRaw !== "ABST")
      .map(item => ({
        rollNo: item.student.rollNo,
        name: item.student.name,
        marks: item.sub!.marks,
        grade: item.sub!.grade,
      }))
      .sort((a, b) => b.marks - a.marks);
  }, [data.students, selectedSubjectCode]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* 1. Individual Student Search & Card */}
      <div id="student-finder-card" className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-indigo-500" />
            <h3 className="font-sans font-semibold text-lg text-slate-800 dark:text-white">
              Find Individual Student
            </h3>
          </div>

          <form onSubmit={handleStudentSearch} className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchRoll}
                onChange={e => setSearchRoll(e.target.value)}
                placeholder="Enter Roll Number (e.g. 19617019)"
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 font-mono transition-all duration-200"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-all duration-300"
            >
              Search
            </button>
          </form>

          {searchError && (
            <p className="text-xs text-rose-500 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 px-3 py-2 rounded-lg font-sans">
              {searchError}
            </p>
          )}

          {selectedStudent ? (
            <div className="border border-indigo-100 dark:border-indigo-950/40 bg-indigo-50/10 rounded-xl p-5 mt-4 space-y-4">
              {/* Header Info */}
              <div className="flex justify-between items-start border-b border-indigo-50 dark:border-indigo-950/30 pb-3">
                <div>
                  <h4 className="font-sans font-bold text-base text-slate-800 dark:text-white">
                    {selectedStudent.name}
                  </h4>
                  <p className="text-xs font-mono text-slate-400 mt-0.5">
                    Roll No: {selectedStudent.rollNo} • Sex: {selectedStudent.gender}
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded text-xs font-black tracking-wide ${
                  selectedStudent.result === "PASS"
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400"
                    : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400"
                }`}>
                  {selectedStudent.result}
                </span>
              </div>

              {/* Totals */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white dark:bg-slate-950/40 p-2.5 rounded border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Main 5</span>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200">{selectedStudent.main5Total}</span>
                </div>
                <div className="bg-white dark:bg-slate-950/40 p-2.5 rounded border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Best 5</span>
                  <span className="text-sm font-black text-slate-700 dark:text-slate-200">{selectedStudent.best5Total}</span>
                </div>
                <div className="bg-indigo-500 text-white p-2.5 rounded">
                  <span className="text-[10px] uppercase font-bold text-indigo-200 block">Percentage</span>
                  <span className="text-sm font-black">{selectedStudent.best5Percentage}%</span>
                </div>
              </div>

              {/* Subject Marks Breakdown */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Subject Scores</span>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedStudent.subjects.map(sub => (
                    <div key={sub.code} className="flex items-center justify-between text-xs bg-white dark:bg-slate-950/20 px-3 py-2 rounded border border-slate-50 dark:border-slate-800/40">
                      <div>
                        <span className="font-mono text-[10px] text-slate-400 mr-2 bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">
                          {sub.code}
                        </span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {sub.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {sub.marksRaw}
                        </span>
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          sub.grade === "A1" || sub.grade === "A2"
                            ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/30 dark:text-emerald-400"
                            : sub.grade === "E"
                            ? "bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}>
                          {sub.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-3 mt-4 h-64">
              <Search className="w-10 h-10 text-slate-300" />
              <div className="space-y-1">
                <span className="text-sm font-semibold text-slate-500">Query Student Profile</span>
                <p className="text-xs max-w-xs">
                  Enter an 8-digit CBSE roll number above to load the student's complete scorecard and rankings.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Subject Deep Dive */}
      <div id="subject-deep-dive-card" className="lg:col-span-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <h3 className="font-sans font-semibold text-lg text-slate-800 dark:text-white">
              Subject Deep Dive
            </h3>
          </div>

          <div className="flex gap-2 mb-4">
            <div className="flex-1">
              <select
                value={selectedSubjectCode}
                onChange={e => setSelectedSubjectCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-sm bg-slate-50/50 dark:bg-slate-950/40 text-slate-800 dark:text-slate-100 focus:outline-none focus:border-indigo-500 transition-all duration-200"
              >
                {data.subjectStats.map(stat => (
                  <option key={stat.code} value={stat.code}>
                    {stat.code} - {stat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {activeSubjectStats && (
            <div className="space-y-4">
              {/* Quick Summary Numbers */}
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 border border-slate-100 dark:border-slate-800/40 rounded">
                  <span className="text-[10px] text-slate-400 block font-bold">Appeared</span>
                  <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{activeSubjectStats.appeared}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 border border-slate-100 dark:border-slate-800/40 rounded">
                  <span className="text-[10px] text-slate-400 block font-bold">Highest Marks</span>
                  <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{activeSubjectStats.highest}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950/40 p-2.5 border border-slate-100 dark:border-slate-800/40 rounded">
                  <span className="text-[10px] text-slate-400 block font-bold">Mean Score</span>
                  <span className="text-sm font-extrabold text-slate-700 dark:text-slate-200">{activeSubjectStats.meanScore}</span>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-2.5 border border-indigo-100 dark:border-indigo-900/30 rounded">
                  <span className="text-[10px] text-indigo-500 block font-bold">PI %</span>
                  <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400">{activeSubjectStats.pi}%</span>
                </div>
              </div>

              {/* Student Rank List for this Subject */}
              <div className="space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Performance Rankings</span>
                <div className="overflow-y-auto max-h-48 border border-slate-100 dark:border-slate-800/40 rounded-lg divide-y divide-slate-100 dark:divide-slate-800/40">
                  {subjectStudentList.map((item, idx) => (
                    <div
                      key={item.rollNo}
                      className="flex items-center justify-between px-3 py-2 text-xs hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400 w-5">
                          #{idx + 1}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-800 dark:text-slate-200">
                            {item.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block sm:inline sm:ml-2">
                            ({item.rollNo})
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                          {item.marks}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 px-1.5 py-0.5 rounded">
                          {item.grade}
                        </span>
                      </div>
                    </div>
                  ))}
                  {subjectStudentList.length === 0 && (
                    <div className="px-3 py-8 text-center text-slate-400">
                      No student records found.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
