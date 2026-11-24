/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { ExamData, SubjectStats } from "../types";
import { Table, BarChart } from "lucide-react";

interface SubjectTablesProps {
  data: ExamData;
}

// Range classification bins
const getRangeBin = (marks: number): number => {
  if (marks <= 32) return 0; // 0-32
  if (marks <= 44) return 1; // 33-44
  if (marks <= 59) return 2; // 45-59
  if (marks <= 74) return 3; // 60-74
  if (marks <= 89) return 4; // 75-89
  return 5;                  // 90-100
};

export default function SubjectTables({ data }: SubjectTablesProps) {
  const students = data.students;
  const stats = data.subjectStats;

  // Calculate Percentage Range Distribution data dynamically
  const rangeDistTable = useMemo(() => {
    return stats.map(stat => {
      const bins = Array.from({ length: 6 }, () => ({ B: 0, G: 0, T: 0 }));

      students.forEach(student => {
        const sub = student.subjects.find(s => s.code === stat.code);
        if (sub && sub.marksRaw !== "ABST") {
          const binIdx = getRangeBin(sub.marks);
          const gender = student.gender === "M" ? "B" : "G";
          bins[binIdx][gender]++;
          bins[binIdx].T++;
        }
      });

      return {
        code: stat.code,
        name: stat.name,
        bins,
      };
    });
  }, [stats, students]);

  // Calculate Overall Totals for the bottom row
  const overallSums = useMemo(() => {
    const totals = Array.from({ length: 6 }, () => ({ B: 0, G: 0, T: 0 }));
    let grandTotalAppeared = 0;

    rangeDistTable.forEach(row => {
      row.bins.forEach((bin, idx) => {
        totals[idx].B += bin.B;
        totals[idx].G += bin.G;
        totals[idx].T += bin.T;
        grandTotalAppeared += bin.T;
      });
    });

    const percentages = totals.map(bin => {
      const totalPercent = grandTotalAppeared > 0 ? (bin.T / grandTotalAppeared) * 100 : 0;
      return totalPercent;
    });

    return {
      totals,
      percentages,
    };
  }, [rangeDistTable]);

  return (
    <div className="space-y-10">
      {/* 1. Subject Performance Index Table */}
      <div id="subject-pi-section" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Table className="w-5 h-5 text-indigo-500" />
          <h3 className="font-sans font-semibold text-lg text-slate-800 dark:text-white">
            Subject Performance Index (PI) &amp; Averages
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-slate-500 dark:text-slate-400 font-bold">
                <th className="px-3 py-3 w-16">CODE</th>
                <th className="px-3 py-3">SUBJECT NAME</th>
                <th className="px-3 py-3 text-center">APPEARED</th>
                <th className="px-2 py-3 text-center bg-indigo-50/30 dark:bg-indigo-950/20">A1</th>
                <th className="px-2 py-3 text-center bg-indigo-50/30 dark:bg-indigo-950/20">A2</th>
                <th className="px-2 py-3 text-center">B1</th>
                <th className="px-2 py-3 text-center">B2</th>
                <th className="px-2 py-3 text-center">C1</th>
                <th className="px-2 py-3 text-center">C2</th>
                <th className="px-2 py-3 text-center text-amber-600">D1</th>
                <th className="px-2 py-3 text-center text-amber-600">D2</th>
                <th className="px-2 py-3 text-center text-rose-500">E</th>
                <th className="px-3 py-3 text-center">HIGHEST</th>
                <th className="px-3 py-3 text-center">MEAN SCORE</th>
                <th className="px-4 py-3 text-right text-indigo-600 dark:text-indigo-400">PI %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {stats.map(stat => (
                <tr key={stat.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors">
                  <td className="px-3 py-3 font-mono text-slate-500 dark:text-slate-400 font-semibold">
                    {stat.code}
                  </td>
                  <td className="px-3 py-3 font-medium text-slate-800 dark:text-slate-200">
                    {stat.name}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-slate-700 dark:text-slate-300">
                    {stat.appeared}
                  </td>
                  <td className="px-2 py-3 text-center font-semibold bg-indigo-50/10 dark:bg-indigo-950/10 text-emerald-600">
                    {stat.grades.A1}
                  </td>
                  <td className="px-2 py-3 text-center font-semibold bg-indigo-50/10 dark:bg-indigo-950/10 text-emerald-500">
                    {stat.grades.A2}
                  </td>
                  <td className="px-2 py-3 text-center text-slate-700 dark:text-slate-300">
                    {stat.grades.B1}
                  </td>
                  <td className="px-2 py-3 text-center text-slate-700 dark:text-slate-300">
                    {stat.grades.B2}
                  </td>
                  <td className="px-2 py-3 text-center text-slate-600 dark:text-slate-400">
                    {stat.grades.C1}
                  </td>
                  <td className="px-2 py-3 text-center text-slate-600 dark:text-slate-400">
                    {stat.grades.C2}
                  </td>
                  <td className="px-2 py-3 text-center text-amber-600">
                    {stat.grades.D1}
                  </td>
                  <td className="px-2 py-3 text-center text-amber-500">
                    {stat.grades.D2}
                  </td>
                  <td className="px-2 py-3 text-center font-bold text-rose-500 bg-rose-50/10">
                    {stat.grades.E}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-slate-800 dark:text-slate-200">
                    {stat.highest}
                  </td>
                  <td className="px-3 py-3 text-center font-bold text-indigo-500">
                    {stat.meanScore}
                  </td>
                  <td className="px-4 py-3 text-right font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50/20 dark:bg-indigo-950/30">
                    {stat.pi}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Subject-Wise Marks Distribution (Percentage Range Dist) */}
      <div id="subject-range-section" className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BarChart className="w-5 h-5 text-indigo-500" />
          <h3 className="font-sans font-semibold text-lg text-slate-800 dark:text-white">
            Subject-Wise Marks Distribution (Percentage Range Dist)
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-center border-collapse border border-slate-150 dark:border-slate-800">
            <thead>
              {/* Category Header Row 1 */}
              <tr className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-800">
                <th rowSpan={2} className="px-4 py-3 text-left border-r border-slate-200 dark:border-slate-800">
                  SUBJECT CODE &amp; NAME
                </th>
                <th colSpan={3} className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 bg-rose-50/60 dark:bg-rose-950/20 text-rose-600">
                  0 - 32 (Fail)
                </th>
                <th colSpan={3} className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/20 text-amber-600">
                  33 - 44
                </th>
                <th colSpan={3} className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 bg-sky-50/40 dark:bg-sky-950/20 text-sky-600">
                  45 - 59
                </th>
                <th colSpan={3} className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 bg-blue-50/40 dark:bg-blue-950/20 text-blue-600">
                  60 - 74
                </th>
                <th colSpan={3} className="px-2 py-2 border-r border-slate-200 dark:border-slate-800 bg-indigo-50/40 dark:bg-indigo-950/20 text-indigo-600">
                  75 - 89
                </th>
                <th colSpan={3} className="px-2 py-2 bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-600">
                  90 - 100
                </th>
              </tr>
              {/* Sub Columns Header Row 2 (B, G, T) */}
              <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">B</th>
                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">G</th>
                <th className="px-1.5 py-1.5 border-r border-slate-200 dark:border-slate-800">T</th>

                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">B</th>
                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">G</th>
                <th className="px-1.5 py-1.5 border-r border-slate-200 dark:border-slate-800">T</th>

                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">B</th>
                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">G</th>
                <th className="px-1.5 py-1.5 border-r border-slate-200 dark:border-slate-800">T</th>

                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">B</th>
                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">G</th>
                <th className="px-1.5 py-1.5 border-r border-slate-200 dark:border-slate-800">T</th>

                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">B</th>
                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">G</th>
                <th className="px-1.5 py-1.5 border-r border-slate-200 dark:border-slate-800">T</th>

                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">B</th>
                <th className="px-1.5 py-1.5 border-r border-slate-150 dark:border-slate-800">G</th>
                <th className="px-1.5 py-1.5">T</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rangeDistTable.map(row => (
                <tr key={row.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-950/10 transition-colors">
                  <td className="px-4 py-2.5 text-left font-medium text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                    {row.code} - {row.name}
                  </td>
                  {row.bins.map((bin, bIdx) => (
                    <React.Fragment key={bIdx}>
                      <td className="px-1.5 py-2.5 text-slate-500 border-r border-slate-100 dark:border-slate-800/40">
                        {bin.B}
                      </td>
                      <td className="px-1.5 py-2.5 text-slate-500 border-r border-slate-100 dark:border-slate-800/40">
                        {bin.G}
                      </td>
                      <td className={`px-1.5 py-2.5 font-bold border-r border-slate-200 dark:border-slate-800 ${
                        bIdx === 0 && bin.T > 0 ? "text-rose-600 bg-rose-50/10" : "text-slate-800 dark:text-slate-200"
                      } ${bIdx === 5 && bin.T > 0 ? "text-emerald-600 bg-emerald-50/10" : ""}`}>
                        {bin.T}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}

              {/* OVERALL STUDENT % ROW */}
              <tr className="bg-indigo-50/40 dark:bg-indigo-950/20 font-black text-indigo-700 dark:text-indigo-400 border-t border-slate-200 dark:border-slate-800">
                <td className="px-4 py-3 text-left border-r border-slate-200 dark:border-slate-800">
                  OVERALL STUDENT %
                </td>
                {overallSums.percentages.map((percent, idx) => (
                  <td colSpan={3} key={idx} className="px-2 py-3 border-r border-slate-200 dark:border-slate-800 text-center text-[11px] font-bold">
                    {percent.toFixed(1)}%
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
