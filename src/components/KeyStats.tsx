/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ExamData } from "../types";
import { Users, CheckCircle, Percent, AlertCircle, RefreshCw } from "lucide-react";

interface KeyStatsProps {
  data: ExamData;
}

export default function KeyStats({ data }: KeyStatsProps) {
  const students = data.students;
  const appeared = students.length;
  
  const passed = students.filter(s => s.result === "PASS").length;
  const passPercent = appeared > 0 ? ((passed / appeared) * 100).toFixed(2) : "0.00";
  
  const boys = students.filter(s => s.gender === "M");
  const boysAppeared = boys.length;
  const boysPassed = boys.filter(s => s.result === "PASS").length;
  const boysPassPercent = boysAppeared > 0 ? ((boysPassed / boysAppeared) * 100).toFixed(2) : "0.00";
  
  const girls = students.filter(s => s.gender === "F");
  const girlsAppeared = girls.length;
  const girlsPassed = girls.filter(s => s.result === "PASS").length;
  const girlsPassPercent = girlsAppeared > 0 ? ((girlsPassed / girlsAppeared) * 100).toFixed(2) : "0.00";
  
  const compartment = students.filter(s => s.result === "COMP" || s.result.includes("COMPTT.")).length;
  const essentialRepeat = students.filter(s => s.result === "ESSENTIAL REPEAT").length;

  const stats = [
    {
      id: "stat-appeared",
      title: "Appeared",
      value: appeared,
      icon: Users,
      color: "bg-blue-50 border-blue-100 text-blue-600 dark:bg-slate-900/40 dark:border-blue-900/30 dark:text-blue-400",
    },
    {
      id: "stat-passed",
      title: "Passed",
      value: passed,
      icon: CheckCircle,
      color: "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-slate-900/40 dark:border-emerald-900/30 dark:text-emerald-400",
    },
    {
      id: "stat-overall-pass",
      title: "Overall Pass %",
      value: `${passPercent}%`,
      icon: Percent,
      color: "bg-indigo-50 border-indigo-100 text-indigo-600 dark:bg-slate-900/40 dark:border-indigo-900/30 dark:text-indigo-400",
    },
    {
      id: "stat-boys-pass",
      title: "Boys Pass %",
      value: `${boysPassPercent}%`,
      icon: Percent,
      color: "bg-sky-50 border-sky-100 text-sky-600 dark:bg-slate-900/40 dark:border-sky-900/30 dark:text-sky-400",
    },
    {
      id: "stat-girls-pass",
      title: "Girls Pass %",
      value: `${girlsPassPercent}%`,
      icon: Percent,
      color: "bg-pink-50 border-pink-100 text-pink-600 dark:bg-slate-900/40 dark:border-pink-900/30 dark:text-pink-400",
    },
    {
      id: "stat-compartment",
      title: "Compartment",
      value: compartment,
      icon: AlertCircle,
      color: "bg-amber-50 border-amber-100 text-amber-600 dark:bg-slate-900/40 dark:border-amber-900/30 dark:text-amber-400",
    },
    {
      id: "stat-essential-repeat",
      title: "Essential Repeat",
      value: essentialRepeat,
      icon: RefreshCw,
      color: "bg-rose-50 border-rose-100 text-rose-600 dark:bg-slate-900/40 dark:border-rose-900/30 dark:text-rose-400",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
      {stats.map(stat => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.id}
            id={stat.id}
            className={`flex flex-col p-4 rounded-xl border ${stat.color} transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {stat.title}
              </span>
              <Icon className="w-4 h-4 opacity-80" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
              {stat.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}
