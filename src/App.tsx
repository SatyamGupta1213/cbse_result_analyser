/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { parseCBSEResult } from "./utils/cbseParser";
import { exportToExcel } from "./utils/excelExporter";
import { ParsedResult, ExamData } from "./types";
import { DEFAULT_CBSE_TEXT } from "./data/defaultText";
import KeyStats from "./components/KeyStats";
import ExecutiveSummary from "./components/ExecutiveSummary";
import VisualAnalytics from "./components/VisualAnalytics";
import StudentExplorer from "./components/StudentExplorer";
import StreamToppers from "./components/StreamToppers";
import SubjectTables from "./components/SubjectTables";

// Import custom companion tools
import PythonIDE from "./components/PythonIDE";
import SQLPlayground from "./components/SQLPlayground";
import EducationalResources from "./components/EducationalResources";
import IPProjects from "./components/IPProjects";

import { 
  FileText, 
  Download, 
  Upload, 
  School, 
  BookOpen, 
  Sparkles,
  Info,
  GraduationCap,
  Database,
  Code,
  FolderGit2,
  ChevronLeft
} from "lucide-react";

export default function App() {
  const [parsedResult, setParsedResult] = useState<ParsedResult | null>(null);
  const [activeTab, setActiveTab] = useState<"Class X" | "Class XII">("Class XII");
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeService, setActiveService] = useState<"python" | "sql" | "resources" | "projects" | null>(null);

  const selectService = (service: "python" | "sql" | "resources" | "projects") => {
    setActiveService(service);
    setTimeout(() => {
      const element = document.getElementById("services-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  // Auto-set tab when parsedResult changes
  useEffect(() => {
    if (parsedResult) {
      if (parsedResult.classXII) {
        setActiveTab("Class XII");
      } else if (parsedResult.classX) {
        setActiveTab("Class X");
      }
    }
  }, [parsedResult]);

  const handleFileUpload = (text: string) => {
    try {
      setErrorMessage("");
      const result = parseCBSEResult(text);
      
      if (!result.classX && !result.classXII) {
        setErrorMessage("Could not parse any valid student records. Please ensure you uploaded a standard CBSE School Wise Gazette .txt file.");
        return;
      }

      setParsedResult(result);
      if (result.classXII) {
        setActiveTab("Class XII");
      } else if (result.classX) {
        setActiveTab("Class X");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred while parsing the file. Please check the file format.");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleFileUpload(text);
    };
    reader.readAsText(file);
  };

  // Drag and Drop Handlers
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain" && !file.name.endsWith(".txt")) {
      setErrorMessage("Invalid file type. Please upload a standard CBSE School Wise Gazette raw .txt file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      handleFileUpload(text);
    };
    reader.readAsText(file);
  };

  // Get active exam data
  const activeExamData: ExamData | null = parsedResult
    ? activeTab === "Class XII"
      ? parsedResult.classXII
      : parsedResult.classX
    : null;

  const currentRegion = activeExamData?.region || (parsedResult?.classXII?.region || parsedResult?.classX?.region) || "BHOPAL";

  // Handler for exporting Excel
  const handleExport = () => {
    if (!activeExamData) return;
    exportToExcel(activeExamData);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-sans font-bold text-base tracking-tight text-slate-900 dark:text-white leading-tight">
                CBSE Result Analyzer
              </h1>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                School-Wise Gazette Parser
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="#uploader-section"
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
            >
              Upload Gazette
            </a>
            <span className="h-4 w-px bg-slate-200 dark:bg-slate-800 hidden sm:inline" />
            <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded">
              Region: {currentRegion}
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Content Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-8">
        
        {/* Dropzone File Upload Block */}
        <section 
          id="uploader-section"
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative overflow-hidden rounded-2xl border-2 border-dashed transition-all duration-300 p-8 text-center flex flex-col items-center justify-center gap-4 ${
            isDragging 
              ? "border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/20 shadow-lg scale-[1.01]" 
              : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm"
          }`}
        >
          <div className="p-4 bg-indigo-50 dark:bg-indigo-950/40 rounded-full text-indigo-600 dark:text-indigo-400">
            <Upload className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-md">
            <h2 className="font-sans font-bold text-lg text-slate-800 dark:text-slate-100">
              Drop CBSE Result (.TXT) Here
            </h2>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Drag and drop your raw school gazette plain text file, or click below to browse. Supports Class XII and Class X.
            </p>
          </div>

          <label className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-all duration-300 shadow-sm flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            Browse File
            <input 
              type="file" 
              accept=".txt,text/plain" 
              onChange={onFileChange} 
              className="hidden" 
            />
          </label>

          {errorMessage && (
            <p className="text-xs text-rose-500 font-medium bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 px-4 py-2 rounded-lg max-w-lg mt-2">
              {errorMessage}
            </p>
          )}

          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-semibold uppercase mt-1">
            <Info className="w-3 h-3 text-indigo-500" />
            Supports Class XII and Class X Gazette Files
          </div>
        </section>

        {/* 3. Dashboard Visualizer Workspace */}
        {activeExamData ? (
          <div className="space-y-8 animate-fade-in">
            
            {/* School & Tab Controls Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl text-indigo-600 dark:text-indigo-400 shrink-0">
                  <School className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-indigo-500 font-bold bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded uppercase">
                    CBSE Board Examination Result Analysis
                  </span>
                  <h2 className="font-sans font-extrabold text-xl text-slate-900 dark:text-white mt-1 leading-tight">
                    {activeExamData.school.name}
                  </h2>
                  <p className="text-xs text-slate-400 font-sans mt-0.5">
                    School Code: <span className="font-mono font-bold">{activeExamData.school.code}</span> • Region: <span className="font-bold text-slate-500">{activeExamData.region || "BHOPAL"}</span>
                  </p>
                </div>
              </div>

              {/* Toggle and Export Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {parsedResult && (parsedResult.classX || parsedResult.classXII) && (
                  <div className="flex p-1 bg-slate-50 dark:bg-slate-950 rounded-lg border border-slate-100 dark:border-slate-800">
                    {parsedResult.classXII && (
                      <button
                        onClick={() => setActiveTab("Class XII")}
                        className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-300 ${
                          activeTab === "Class XII"
                            ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        }`}
                      >
                        Class XII
                      </button>
                    )}
                    {parsedResult.classX && (
                      <button
                        onClick={() => setActiveTab("Class X")}
                        className={`px-4 py-2 text-xs font-semibold rounded-md transition-all duration-300 ${
                          activeTab === "Class X"
                            ? "bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm"
                            : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                        }`}
                      >
                        Class X
                      </button>
                    )}
                  </div>
                )}

                <button
                  onClick={handleExport}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all duration-300 shadow-sm flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Excel Report
                </button>
              </div>
            </div>

            {/* Key Metric Cards */}
            <KeyStats data={activeExamData} />

            {/* Executive Summary Card & School Toppers */}
            <ExecutiveSummary data={activeExamData} />

            {/* Visual Charts (Pie & Bar comparisons) */}
            <VisualAnalytics data={activeExamData} />

            {/* Student Explorer Profile & Subject Rankings */}
            <StudentExplorer data={activeExamData} />

            {/* Stream Toppers List (Class XII only) */}
            <StreamToppers data={activeExamData} />

            {/* Detailed Tables (Performance index & range distributions) */}
            <SubjectTables data={activeExamData} />

            {/* Final Callout Banner */}
            <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 border border-indigo-950/50 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-2 relative z-10">
                <h3 className="font-sans font-extrabold text-lg text-indigo-200">
                  Analysis Complete! Download your Master Record.
                </h3>
                <p className="text-xs text-indigo-100 max-w-xl leading-relaxed">
                  Your beautifully formatted Excel file includes a <span className="font-bold">Master Sheet</span> with all student marks, plus organized tabs for PI, Ranges, and stream-wise Toppers.
                </p>
              </div>
              <button
                onClick={handleExport}
                className="px-5 py-2.5 bg-white text-indigo-900 hover:bg-indigo-50 font-bold rounded-lg text-xs transition-all duration-300 shadow-md self-start md:self-auto flex items-center gap-1.5 relative z-10"
              >
                <Download className="w-4 h-4 text-indigo-900" />
                Download Excel Report
              </button>
              <div className="absolute top-1/2 -right-10 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            </div>

            {/* CBSE Companion Tools & Services (when data loaded) */}
            <div id="services-section" className="border-t border-slate-100 dark:border-slate-800 pt-12 space-y-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <h3 className="font-sans font-extrabold text-lg text-slate-900 dark:text-white">
                    CBSE Companion Tools &amp; Services
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Toggle interactive coding editors, database consoles, revision cards, or project templates.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveService(activeService === "python" ? null : "python")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      activeService === "python"
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    Python IDE
                  </button>
                  <button
                    onClick={() => setActiveService(activeService === "sql" ? null : "sql")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      activeService === "sql"
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    SQL Playground
                  </button>
                  <button
                    onClick={() => setActiveService(activeService === "resources" ? null : "resources")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      activeService === "resources"
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    Study Hub &amp; Projects
                  </button>
                  <button
                    onClick={() => setActiveService(activeService === "projects" ? null : "projects")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      activeService === "projects"
                        ? "bg-indigo-600 border-indigo-600 text-white"
                        : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300"
                    }`}
                  >
                    Synopsis Builder
                  </button>
                </div>
              </div>

              {activeService && (
                <div className="bg-slate-50 dark:bg-slate-950/20 border border-slate-100 dark:border-slate-850 p-6 rounded-3xl animate-fadeIn relative">
                  <button
                    onClick={() => setActiveService(null)}
                    className="absolute top-4 right-4 text-[10px] font-bold text-slate-400 hover:text-rose-500 uppercase transition-colors"
                  >
                    Close Tool [X]
                  </button>
                  <div className="pt-4">
                    {activeService === "python" && <PythonIDE />}
                    {activeService === "sql" && <SQLPlayground />}
                    {activeService === "resources" && <EducationalResources />}
                    {activeService === "projects" && <IPProjects />}
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          <div id="services-section" className="space-y-12 animate-fade-in">
            {activeService === null ? (
              <div className="space-y-10">
                {/* Default Fallback Information */}
                <div className="border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 text-center text-slate-400 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 shadow-sm">
                  <Info className="w-8 h-8 text-indigo-500" />
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Awaiting School Gazette Upload</span>
                  <p className="text-xs max-w-sm leading-relaxed text-slate-400">
                    To access deep diagnostic class performance analytics, grade distributions, and master excel reports, please drop or select your CBSE School Gazette file above.
                  </p>
                </div>

                {/* Grid cards of companion tools */}
                <div className="space-y-6">
                  <div className="text-center max-w-xl mx-auto space-y-2">
                    <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 rounded">
                      Companion Suite
                    </span>
                    <h3 className="font-sans font-extrabold text-xl text-slate-800 dark:text-white">
                      CBSE Interactive Tools &amp; Resources
                    </h3>
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                      Practice board-level coding, experiment with databases, and download fully-formatted project synopses directly.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Python Card */}
                    <button
                      onClick={() => setActiveService("python")}
                      className="text-left bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md rounded-2xl p-6 transition-all duration-300 flex items-start gap-4 w-full"
                    >
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                        <Code className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">
                          Interactive Sandbox
                        </span>
                        <h4 className="font-sans font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                          Python IDE
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                          Complete board exam code assignments with an inline python console, preloaded templates, and auto-evaluation syntax checkers.
                        </p>
                      </div>
                    </button>

                    {/* SQL Card */}
                    <button
                      onClick={() => setActiveService("sql")}
                      className="text-left bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md rounded-2xl p-6 transition-all duration-300 flex items-start gap-4 w-full"
                    >
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                        <Database className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">
                          Relational Queries
                        </span>
                        <h4 className="font-sans font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                          SQL Playground
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                          Execute standard queries (SELECT, WHERE, GROUP BY) against simulated STUDENT and EMPLOYEE schemas with visual result tables.
                        </p>
                      </div>
                    </button>

                    {/* Resources Card */}
                    <button
                      onClick={() => setActiveService("resources")}
                      className="text-left bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md rounded-2xl p-6 transition-all duration-300 flex items-start gap-4 w-full"
                    >
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">
                          Academic Hub
                        </span>
                        <h4 className="font-sans font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                          Study Hub &amp; Projects
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                          Browse beautiful subject folders, review unlocked chapter notes, read SQL/Python code guides, and access sample papers.
                        </p>
                      </div>
                    </button>

                    {/* Projects Card */}
                    <button
                      onClick={() => setActiveService("projects")}
                      className="text-left bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-500 hover:shadow-md rounded-2xl p-6 transition-all duration-300 flex items-start gap-4 w-full"
                    >
                      <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl shrink-0">
                        <FolderGit2 className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[9px] font-mono font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider block">
                          Board Document
                        </span>
                        <h4 className="font-sans font-extrabold text-slate-800 dark:text-slate-100 text-sm">
                          Synopsis Builder
                        </h4>
                        <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                          Enter your board details to instantly generate a printable, formatted academic project synopsis document.
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Header for Active Service */}
                <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-4">
                  <button
                    onClick={() => setActiveService(null)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Suite Overview
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-mono font-bold text-slate-500 rounded uppercase">
                      Active Companion
                    </span>
                  </div>
                </div>

                {activeService === "python" && <PythonIDE />}
                {activeService === "sql" && <SQLPlayground />}
                {activeService === "resources" && <EducationalResources />}
                {activeService === "projects" && <IPProjects />}
              </div>
            )}
          </div>
        )}

      </main>

      {/* 4. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-950 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-600 rounded text-white">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-white tracking-tight">CBSE Result Analyzer</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              High-fidelity analytics and robust visualizers for CBSE school-wise gazettes. Empowering educators with deep diagnostic insights.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              Tools &amp; Services
            </h4>
            <ul className="text-xs space-y-2 text-slate-500">
              <li>
                <button 
                  onClick={() => selectService("python")} 
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Python IDE
                </button>
              </li>
              <li>
                <button 
                  onClick={() => selectService("sql")} 
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  SQL Playground
                </button>
              </li>
              <li>
                <button 
                  onClick={() => selectService("resources")} 
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Class XII Computer Science Resources
                </button>
              </li>
              <li>
                <button 
                  onClick={() => selectService("projects")} 
                  className="hover:text-indigo-400 transition-colors text-left"
                >
                  Class XII IP Projects
                </button>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3">
              About
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              CBSE school gazettes are printed in standard txt formatting. Our analyzer parses these records with 100% mathematical accuracy to highlight subject averages, ranking distribution, and download excel reports.
            </p>
            <p className="text-[10px] text-slate-600 mt-4">
              © 2026 CBSE Result Analyzer. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
