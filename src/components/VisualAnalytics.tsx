/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { ExamData } from "../types";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { BarChart3, PieChart as PieIcon } from "lucide-react";

interface VisualAnalyticsProps {
  data: ExamData;
}

const COLORS = ["#10b981", "#f59e0b", "#ef4444", "#6366f1"];

export default function VisualAnalytics({ data }: VisualAnalyticsProps) {
  const students = data.students;

  // 1. Calculate pie chart data for results
  const pieData = useMemo(() => {
    const passed = students.filter(s => s.result === "PASS").length;
    const compartment = students.filter(s => s.result === "COMP" || s.result.includes("COMPTT.")).length;
    const essentialRepeat = students.filter(s => s.result === "ESSENTIAL REPEAT").length;
    const other = students.length - passed - compartment - essentialRepeat;

    return [
      { name: "Pass", value: passed, color: "#10b981" },
      { name: "Compartment", value: compartment, color: "#f59e0b" },
      { name: "Essential Repeat", value: essentialRepeat, color: "#ef4444" },
      ...(other > 0 ? [{ name: "Other", value: other, color: "#6366f1" }] : [])
    ];
  }, [students]);

  // 2. Prepare bar chart data for Subject PI Comparison
  const barData = useMemo(() => {
    return data.subjectStats
      .map(stat => ({
        code: stat.code,
        name: stat.name,
        pi: stat.pi,
        mean: stat.meanScore
      }))
      .sort((a, b) => b.pi - a.pi);
  }, [data.subjectStats]);

  const totalValue = pieData.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Result Distribution Pie Chart */}
      <div id="analytics-result-dist" className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <PieIcon className="w-5 h-5 text-indigo-500" />
            <h3 className="font-sans font-semibold text-lg text-slate-800 dark:text-white">
              Overall Result Distribution
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans mb-4">
            A visual overview of the final outcomes for all {students.length} candidates.
          </p>
        </div>

        <div className="h-64 relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={4}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [
                  `${value} (${totalValue > 0 ? ((value / totalValue) * 100).toFixed(1) : 0}%)`,
                  "Students"
                ]}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontFamily: "Inter, sans-serif"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-700 dark:text-slate-200">
              {students.length}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              Total
            </span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-4">
          {pieData.map((entry, index) => (
            <div key={entry.name} className="flex items-center gap-1.5 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block"
                style={{ backgroundColor: entry.color }}
              />
              <span className="font-medium text-slate-600 dark:text-slate-300">
                {entry.name} ({entry.value})
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Subject Performance Index Comparison Bar Chart */}
      <div id="analytics-pi-comp" className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h3 className="font-sans font-semibold text-lg text-slate-800 dark:text-white">
              Subject Performance Index (PI) Comparison
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans mb-6">
            Compare quality of results using the Performance Index (PI %) across all subjects.
          </p>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 5, right: 10, left: -20, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="name"
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "Inter" }}
                angle={-20}
                textAnchor="end"
                interval={0}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "#64748b", fontSize: 10, fontFamily: "Inter" }}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  `${value}%`,
                  name === "pi" ? "Performance Index" : "Average Score"
                ]}
                labelFormatter={(label) => `Subject: ${label}`}
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                  fontFamily: "Inter, sans-serif"
                }}
              />
              <Bar dataKey="pi" name="pi" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
