/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ExamData } from "../types";
import { Award, TableProperties } from "lucide-react";

interface ExecutiveSummaryProps {
  data: ExamData;
}

export default function ExecutiveSummary({ data }: ExecutiveSummaryProps) {
  const students = data.students;
  const appeared = students.length;
  const passed = students.filter(s => s.result === "PASS").length;
  const passPercentage = appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "0.00";

  // Calculate percentage bands based on best 5 percentage
  const band95AndAbove = students.filter(s => s.best5Percentage >= 95.0).length;
  const band90To95 = students.filter(s => s.best5Percentage >= 90.0 && s.best5Percentage < 95.0).length;
  const band75To90 = students.filter(s => s.best5Percentage >= 75.0 && s.best5Percentage < 90.0).length;
  const band60To75 = students.filter(s => s.best5Percentage >= 60.0 && s.best5Percentage < 75.0).length;
  const bandBelow60 = students.filter(s => s.best5Percentage < 60.0).length;

  // Get Top 10 Merit Students (tie breaker is Main 5, then Roll No)
  const toppers = [...students]
    .sort((a, b) => {
      if (b.best5Percentage !== a.best5Percentage) {
        return b.best5Percentage - a.best5Percentage;
      }
      return b.main5Total - a.main5Total;
    })
    .slice(0, 10);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Grade distribution and stats card */}
      <div id="exec-summary-stats" className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-indigo-500" />
            <h3 className="font-sans font-semibold text-lg text-slate-800 dark:text-white">
              Executive Summary (Shareable)
            </h3>
          </div>

          <div className="text-center mb-6">
            <h4 className="font-sans text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {data.school.name}
            </h4>
            <span className="text-xs font-mono text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded mt-1 inline-block">
              CBSE {data.examType} RESULT - 2025
            </span>
          </div>

          <div className="border border-slate-100 dark:border-slate-800 rounded-lg overflow-hidden">
            <table className="w-full text-sm text-left border-collapse">
              <tbody>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40 w-1/2">
                    APPEARED
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-right">
                    {appeared}
                  </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40">
                    PASS
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-right">
                    {passed}
                  </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40">
                    PASS PERCENTAGE
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-right">
                    {passPercentage}%
                  </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40">
                    &gt;= 95%
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-right">
                    {band95AndAbove}
                  </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40">
                    90% - 95%
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-right">
                    {band90To95}
                  </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40">
                    75% - 90%
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-right">
                    {band75To90}
                  </td>
                </tr>
                <tr className="border-b border-slate-100 dark:border-slate-800">
                  <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40">
                    60% - 75%
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-right">
                    {band60To75}
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/40">
                    &lt; 60%
                  </td>
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-white text-right">
                    {bandBelow60}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Top 10 general merit list */}
      <div id="exec-summary-toppers" className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <TableProperties className="w-5 h-5 text-indigo-500" />
          <h3 className="font-sans font-semibold text-lg text-slate-800 dark:text-white">
            Top 10 School Toppers (Overall)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3 font-semibold w-12 text-center">SL</th>
                <th className="px-4 py-3 font-semibold">NAME OF CANDIDATE</th>
                <th className="px-4 py-3 font-semibold text-center">MAIN 5</th>
                <th className="px-4 py-3 font-semibold text-center">BEST 5</th>
                <th className="px-4 py-3 font-semibold text-right">% MARKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {toppers.map((student, index) => {
                let medalBg = "";
                let medalText = "";
                if (index === 0) {
                  medalBg = "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400";
                  medalText = "🥇";
                } else if (index === 1) {
                  medalBg = "bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400";
                  medalText = "🥈";
                } else if (index === 2) {
                  medalBg = "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-500";
                  medalText = "🥉";
                }

                return (
                  <tr key={student.rollNo} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-colors">
                    <td className="px-4 py-3 text-center">
                      {medalText ? (
                        <span className="text-base">{medalText}</span>
                      ) : (
                        <span className="text-xs font-mono text-slate-400">{index + 1}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800 dark:text-white">
                      <div>
                        {student.name}
                        <span className="text-[10px] font-mono text-slate-400 ml-2 block sm:inline">
                          ({student.rollNo})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300">
                      {student.main5Total}
                    </td>
                    <td className="px-4 py-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {student.best5Total}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        index < 3 ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400" : "text-slate-600 dark:text-slate-400"
                      }`}>
                        {student.best5Percentage.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
              {toppers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-400 font-sans">
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
