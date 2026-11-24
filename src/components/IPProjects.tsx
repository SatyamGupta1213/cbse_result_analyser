/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { FolderGit2, FileCode, CheckCircle, Copy, Check, FileDown, Eye, PenTool } from "lucide-react";

interface IPProject {
  id: string;
  title: string;
  description: string;
  databaseSchema: string[];
  pythonLibraries: string[];
  samplePythonCode: string;
}

const IP_PROJECTS: IPProject[] = [
  {
    id: "lib-mgmt",
    title: "Library Management System",
    description: "Automate library book checkouts, inventory tracking, membership registration, and daily fines tracking using Python and MySQL connector.",
    databaseSchema: [
      "BOOKS (BookID INT, Title VARCHAR, Author VARCHAR, Copies INT)",
      "MEMBERS (MemberID INT, Name VARCHAR, Phone VARCHAR, JoinDate DATE)",
      "TRANSACTIONS (TxID INT, BookID INT, MemberID INT, IssueDate DATE, ReturnDate DATE)"
    ],
    pythonLibraries: ["mysql.connector", "datetime", "tabulate"],
    samplePythonCode: `import mysql.connector
from datetime import datetime, timedelta

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="yourpassword",
        database="library_db"
    )

def issue_book(book_id, member_id):
    conn = connect_db()
    cursor = conn.cursor()
    
    # 1. Check if copies are available
    cursor.execute("SELECT Copies FROM BOOKS WHERE BookID = %s", (book_id,))
    copies = cursor.fetchone()[0]
    
    if copies > 0:
        # 2. Insert transaction record
        issue_date = datetime.now().strftime('%Y-%m-%d')
        cursor.execute(
            "INSERT INTO TRANSACTIONS (BookID, MemberID, IssueDate) VALUES (%s, %s, %s)",
            (book_id, member_id, issue_date)
        )
        # 3. Decrement book copies
        cursor.execute("UPDATE BOOKS SET Copies = Copies - 1 WHERE BookID = %s", (book_id,))
        conn.commit()
        print("Book issued successfully!")
    else:
        print("Book currently out of stock.")
        
    cursor.close()
    conn.close()
`,
  },
  {
    id: "hospital-mgmt",
    title: "Hospital Operations Database",
    description: "Manage outpatient admissions, physician schedules, patient health files, billing, and room allotments.",
    databaseSchema: [
      "PATIENTS (PatientID INT, Name VARCHAR, Age INT, Disease VARCHAR)",
      "DOCTORS (DoctorID INT, Name VARCHAR, Department VARCHAR, Fee INT)",
      "APPOINTMENTS (AppID INT, PatientID INT, DoctorID INT, AppDate DATE, FeePaid INT)"
    ],
    pythonLibraries: ["mysql.connector", "matplotlib.pyplot"],
    samplePythonCode: `import mysql.connector

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="yourpassword",
        database="hospital_db"
    )

def record_appointment(patient_id, doctor_id, date, fee_paid):
    conn = connect_db()
    cursor = conn.cursor()
    
    sql = "INSERT INTO APPOINTMENTS (PatientID, DoctorID, AppDate, FeePaid) VALUES (%s, %s, %s, %s)"
    cursor.execute(sql, (patient_id, doctor_id, date, fee_paid))
    conn.commit()
    
    print(f"Appointment scheduled successfully! ID: {cursor.lastrowid}")
    cursor.close()
    conn.close()
`,
  },
  {
    id: "student-report",
    title: "Student Progress Report Card Generator",
    description: "Aggregate term-wise student marks, calculate subject averages, assign final board grades, and export formatted report cards.",
    databaseSchema: [
      "STUDENTS (RollNo INT, Name VARCHAR, Class VARCHAR, Section CHAR)",
      "MARKS (RollNo INT, English INT, Math INT, Physics INT, Chemistry INT, CS INT)"
    ],
    pythonLibraries: ["mysql.connector", "pandas", "openpyxl"],
    samplePythonCode: `import mysql.connector

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="yourpassword",
        database="school_db"
    )

def generate_report_card(roll_no):
    conn = connect_db()
    cursor = conn.cursor(dictionary=True)
    
    # Fetch details using JOIN query
    query = """
    SELECT S.Name, S.Class, M.* 
    FROM STUDENTS S 
    JOIN MARKS M ON S.RollNo = M.RollNo 
    WHERE S.RollNo = %s
    """
    cursor.execute(query, (roll_no,))
    result = cursor.fetchone()
    
    if result:
        total = result['English'] + result['Math'] + result['Physics'] + result['Chemistry'] + result['CS']
        percentage = (total / 500) * 100
        
        # Calculate grade
        grade = "A" if percentage >= 90 else "B" if percentage >= 75 else "C" if percentage >= 60 else "D"
        
        print("="*40)
        print(f"       CBSE ACADEMIC REPORT CARD        ")
        print("="*40)
        print(f"Name: {result['Name']} | Class: {result['Class']}")
        print(f"Roll No: {result['RollNo']}")
        print("-"*40)
        print(f"Total Marks: {total}/500 | Percentage: {percentage:.2f}%")
        print(f"Final Board Grade: {grade}")
        print("="*40)
    else:
        print("Student marks record not found.")
        
    cursor.close()
    conn.close()
`,
  }
];

export default function IPProjects() {
  const [activeProj, setActiveProj] = useState<IPProject>(IP_PROJECTS[0]);
  const [copied, setCopied] = useState(false);
  const [mode, setMode] = useState<"projects" | "synopsis">("projects");

  // Synopsis state
  const [projTitle, setProjTitle] = useState("Library Management System");
  const [stuName, setStuName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [teacherName, setTeacherName] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Mode Switches */}
      <div className="flex border-b border-slate-100 dark:border-slate-800 pb-px">
        <button
          onClick={() => setMode("projects")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 px-4 ${
            mode === "projects"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-650"
          }`}
        >
          Project Guides &amp; Source Codes
        </button>
        <button
          onClick={() => setMode("synopsis")}
          className={`pb-3 text-xs font-bold transition-all border-b-2 px-4 ${
            mode === "synopsis"
              ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold"
              : "border-transparent text-slate-400 hover:text-slate-650"
          }`}
        >
          Printable Project Synopsis Generator
        </button>
      </div>

      {mode === "projects" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Projects List Sidebar */}
          <div className="lg:col-span-4 space-y-3.5">
            <div className="flex items-center gap-2 mb-1">
              <FolderGit2 className="w-5 h-5 text-indigo-500" />
              <h3 className="font-sans font-bold text-slate-800 dark:text-white text-base">
                CBSE IP/CS Project Topics
              </h3>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed mb-4">
              All Class XII computer science and informatics practices curricula mandate a Python + SQL connectivity project carrying 8 board practical marks.
            </p>

            {IP_PROJECTS.map((proj) => (
              <button
                key={proj.id}
                onClick={() => setActiveProj(proj)}
                className={`w-full text-left p-4 rounded-xl border text-xs transition-all duration-300 ${
                  activeProj.id === proj.id
                    ? "border-indigo-200 bg-indigo-50/40 text-indigo-950 dark:border-indigo-950/60 dark:bg-indigo-950/30 dark:text-indigo-400"
                    : "border-slate-100 bg-slate-50/50 hover:bg-slate-100/50 text-slate-600 dark:border-slate-850 dark:bg-slate-950/20 dark:text-slate-300 dark:hover:bg-slate-950/40"
                }`}
              >
                <span className="font-bold block text-slate-800 dark:text-slate-200 mb-1 text-sm">
                  {proj.title}
                </span>
                <p className="text-[11px] text-slate-450 dark:text-slate-500 line-clamp-2 leading-relaxed">
                  {proj.description}
                </p>
              </button>
            ))}
          </div>

          {/* Project Details Workspace */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 dark:bg-slate-950/30 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 space-y-5">
              <div>
                <h4 className="font-sans font-extrabold text-slate-900 dark:text-white text-base">
                  {activeProj.title} Code Template
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Fully compliant database structure and SQL connectivity code for Python 3.x.
                </p>
              </div>

              {/* Requirements tags */}
              <div className="flex flex-wrap gap-2">
                {activeProj.pythonLibraries.map(lib => (
                  <span key={lib} className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/50 dark:border-indigo-900/30 rounded-full text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400">
                    import {lib}
                  </span>
                ))}
              </div>

              {/* Database Schemas List */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">
                  Mandatory SQL Database Schema:
                </span>
                <div className="space-y-1.5">
                  {activeProj.databaseSchema.map((schema, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400 font-mono">
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0 mt-0.5" />
                      <span>{schema}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Code Box */}
            <div className="bg-slate-950 rounded-2xl overflow-hidden border border-slate-850 flex flex-col">
              <div className="h-10 bg-slate-900 border-b border-slate-850 px-5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    connectivity_main.py
                  </span>
                </div>
                <button
                  onClick={() => handleCopyCode(activeProj.samplePythonCode)}
                  className="px-2.5 py-1 hover:bg-slate-800 rounded text-[10px] text-slate-300 font-bold transition-all duration-300 flex items-center gap-1.5"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-500" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      Copy Code
                    </>
                  )}
                </button>
              </div>

              <div className="p-5 overflow-auto max-h-[320px] font-mono text-[11px] leading-relaxed text-slate-300 bg-black/40">
                <pre className="font-mono">{activeProj.samplePythonCode}</pre>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs Panel */}
          <div className="lg:col-span-5 bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-850 rounded-2xl p-6 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <PenTool className="w-4 h-4 text-indigo-500" />
                <h3 className="font-sans font-bold text-slate-800 dark:text-white text-base">
                  Synopsis Creator
                </h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Provide student and school attributes below to auto-compile a beautifully formatted CBSE Practical Project Synopsis page.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide mb-1">
                  Project Title
                </label>
                <select
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                >
                  <option value="Library Management System">Library Management System</option>
                  <option value="Hospital Operations Database">Hospital Operations Database</option>
                  <option value="Student Progress Report Card Generator">Student Progress Report Card Generator</option>
                  <option value="Hotel Booking Database System">Hotel Booking Database System</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide mb-1">
                  Student Full Name
                </label>
                <input
                  type="text"
                  value={stuName}
                  onChange={(e) => setStuName(e.target.value)}
                  placeholder="e.g. Satyam Gupta"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide mb-1">
                  Board Roll Number
                </label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  placeholder="e.g. 19123027"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide mb-1">
                  School Name &amp; Code
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="e.g. Kendriya Vidyalaya No.1, Bhopal"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-wide mb-1">
                  Computer Teacher Name
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="e.g. Mrs. Sharma PGT (CS)"
                  className="w-full text-xs px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:bg-slate-900 dark:border-slate-800 dark:text-white"
                />
              </div>

              <button
                onClick={() => setIsGenerated(true)}
                disabled={!stuName || !schoolName}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 disabled:text-slate-450 text-white rounded-xl text-xs font-bold transition-all duration-300 shadow-sm flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                Preview Synopsis Document
              </button>
            </div>
          </div>

          {/* Document Render Area */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {isGenerated ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Synopsis Page Generated!
                  </span>
                  <button
                    onClick={handlePrint}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-all duration-300 flex items-center gap-1.5 shadow-sm"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Print Document (PDF)
                  </button>
                </div>

                {/* Cover Document Page Mockup */}
                <div className="bg-white text-slate-900 border border-slate-200 rounded-3xl p-8 max-w-lg mx-auto shadow-sm space-y-6 select-text text-center font-sans print:border-0 print:shadow-none print:p-0">
                  <div className="space-y-1">
                    <h5 className="font-sans font-bold text-[14px] uppercase tracking-wider text-slate-800">
                      CBSE AISSCE 2024 - 2025
                    </h5>
                    <p className="text-[11px] text-slate-450 font-sans tracking-wide">
                      A PROJECT SYNOPSIS SUBMITTED FOR THE PRACTICAL EXAMINATION
                    </p>
                  </div>

                  <div className="py-4 border-y border-slate-100">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                      PROJECT TOPIC
                    </span>
                    <h3 className="font-serif font-extrabold text-lg text-indigo-900 uppercase">
                      {projTitle}
                    </h3>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-left pt-2 text-xs">
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
                        SUBMITTED BY:
                      </span>
                      <p className="font-bold text-slate-850">{stuName}</p>
                      {rollNo && (
                        <p className="text-[10px] text-slate-500 font-mono">
                          Roll No: {rollNo}
                        </p>
                      )}
                    </div>
                    <div className="space-y-1 text-right">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
                        UNDER THE GUIDANCE OF:
                      </span>
                      <p className="font-bold text-slate-850">
                        {teacherName || "PGT Computer Science"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 text-center space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">
                      INSTITUTION
                    </span>
                    <p className="text-xs font-bold text-slate-800 leading-snug uppercase max-w-sm mx-auto">
                      {schoolName}
                    </p>
                  </div>

                  <div className="pt-4 text-center">
                    <p className="text-[10px] font-semibold text-slate-450 uppercase">
                      DEPARTMENT OF COMPUTER SCIENCE &amp; INFORMATICS PRACTICES
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-center gap-3">
                <FileCode className="w-12 h-12 text-slate-300 dark:text-slate-700 animate-pulse" />
                <span className="text-sm font-bold text-slate-500">Document Preview Ready</span>
                <p className="text-xs text-slate-450 max-w-xs leading-relaxed">
                  Enter student credentials and click "Preview" to load the CBSE synopsis template.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
