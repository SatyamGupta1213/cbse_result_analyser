/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { ExamData, Student } from "../types";
import { Award, ShieldAlert } from "lucide-react";

interface StreamToppersProps {
  data: ExamData;
}

export default function StreamToppers({ data }: StreamToppersProps) {
  const [activeStream, setActiveStream] = useState<"Science" | "Commerce" | "Humanities">("Science");

  const streamStudents = useMemo(() => {
    const students = data.students;

    const science = students
      .filter(s => s.stream === "Science")
      .sort((a, b) => b.best5Percentage - a.best5Percentage || b.main5Total - a.main5Total)
      .slice(0, 10);

    const commerce = students
      .filter(s => s.stream === "Commerce")
      .sort((a, b) => b.best5Percentage - a.best5Percentage || b.main5Total - a.main5Total)
      .slice(0, 10);

    const humanities = students
      .filter(s => s.stream === "Humanities")
      .sort((a, b) => b.best5Percentage - a.best5Percentage || b.main5Total - a.main5Total)
      .slice(0, 10);

    return {
      Science: science,
      Commerce: commerce,
      Humanities: humanities,
    };
  }, [data.students]);

  // If this is Class X, there are no streams!
  if (data.examType === "Class X") {
    return null;
  }

  const activeList = streamStudents[activeStream];

  return (
    <div id="stream-toppers-section" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-500" />
          <h3 className="font-sans font-semibold text-lg text-slate-800 dark:text-white">
            Stream-wise Top 10 Performers
          </h3>
        </div>

        {/* Tab Controls */}
        <div className="flex p-1 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800 self-start sm:self-auto">
          {(["Science", "Commerce", "Humanities"] as const).map(stream => (
            <button
              key={stream}
              onClick={() => setActiveStream(stream)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all duration-300 ${
                activeStream === stream
                  ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              }`}
            >
              {stream}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold">
              <th className="px-4 py-3 w-16 text-center">RANK</th>
              <th className="px-4 py-3">STUDENT NAME</th>
              <th className="px-4 py-3 text-center">ROLL NUMBER</th>
              <th className="px-4 py-3 text-center">MAIN 5 TOTAL</th>
              <th className="px-4 py-3 text-center">BEST 5 TOTAL</th>
              <th className="px-4 py-3 text-right">BEST 5 %</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {activeList.map((student, idx) => (
              <tr key={student.rollNo} className="hover:bg-slate-50/30 dark:hover:bg-slate-950/10 transition-colors">
                <td className="px-4 py-3.5 text-center font-bold text-indigo-600 dark:text-indigo-400">
                  {idx + 1}
                </td>
                <td className="px-4 py-3.5 font-semibold text-slate-800 dark:text-slate-200">
                  {student.name}
                </td>
                <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-500">
                  {student.rollNo}
                </td>
                <td className="px-4 py-3.5 text-center font-medium text-slate-700 dark:text-slate-300">
                  {student.main5Total} / 500
                </td>
                <td className="px-4 py-3.5 text-center font-bold text-slate-800 dark:text-slate-100">
                  {student.best5Total} / 500
                </td>
                <td className="px-4 py-3.5 text-right">
                  <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 rounded text-xs font-black">
                    {student.best5Percentage.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
            {activeList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400 font-sans">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <ShieldAlert className="w-8 h-8 text-slate-300" />
                    <span>No students classified under the {activeStream} stream in this dataset.</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
