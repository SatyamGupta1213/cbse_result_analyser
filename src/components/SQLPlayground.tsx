/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Database, 
  Play, 
  RotateCcw, 
  Table, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  Share2, 
  Trash2, 
  Sparkles,
  Info,
  Grid,
  BookOpen,
  Check
} from "lucide-react";

interface DBTable {
  name: string;
  columns: string[];
  types?: Record<string, string>;
  primaryKeys?: string[];
  rows: Record<string, any>[];
}

const SEED_DATA: Record<string, DBTable> = {
  STUDENT: {
    name: "STUDENT",
    columns: ["ROLL_NO", "NAME", "MARKS", "GRADE", "GENDER", "STREAM"],
    types: {
      ROLL_NO: "INTEGER",
      NAME: "VARCHAR(100)",
      MARKS: "INTEGER",
      GRADE: "VARCHAR(5)",
      GENDER: "VARCHAR(1)",
      STREAM: "VARCHAR(50)"
    },
    primaryKeys: ["ROLL_NO"],
    rows: [
      { ROLL_NO: 101, NAME: "Aarti Sharma", MARKS: 95, GRADE: "A1", GENDER: "F", STREAM: "Science" },
      { ROLL_NO: 102, NAME: "Bhavya Mishra", MARKS: 88, GRADE: "A2", GENDER: "M", STREAM: "Commerce" },
      { ROLL_NO: 103, NAME: "Charu Verma", MARKS: 72, GRADE: "B1", GENDER: "F", STREAM: "Humanities" },
      { ROLL_NO: 104, NAME: "Daksh Goel", MARKS: 61, GRADE: "C1", GENDER: "M", STREAM: "Science" },
      { ROLL_NO: 105, NAME: "Esha Patel", MARKS: 99, GRADE: "A1", GENDER: "F", STREAM: "Science" },
      { ROLL_NO: 106, NAME: "Farhan Khan", MARKS: 45, GRADE: "D2", GENDER: "M", STREAM: "Commerce" },
      { ROLL_NO: 107, NAME: "Gauri Sen", MARKS: 82, GRADE: "B1", GENDER: "F", STREAM: "Commerce" }
    ]
  },
  EMPLOYEE: {
    name: "EMPLOYEE",
    columns: ["EMP_ID", "NAME", "SALARY", "DEPT", "CITY"],
    types: {
      EMP_ID: "INTEGER",
      NAME: "VARCHAR(100)",
      SALARY: "INTEGER",
      DEPT: "VARCHAR(50)",
      CITY: "VARCHAR(50)"
    },
    primaryKeys: ["EMP_ID"],
    rows: [
      { EMP_ID: 201, NAME: "Rajesh Kumar", SALARY: 75000, DEPT: "IT", CITY: "Bhopal" },
      { EMP_ID: 202, NAME: "Priya Singh", SALARY: 54000, DEPT: "HR", CITY: "Indore" },
      { EMP_ID: 203, NAME: "Amit Sharma", SALARY: 62000, DEPT: "Marketing", CITY: "Bhopal" },
      { EMP_ID: 204, NAME: "Sanjay Sen", SALARY: 92000, DEPT: "IT", CITY: "Jabalpur" },
      { EMP_ID: 205, NAME: "Neha Sharma", SALARY: 48000, DEPT: "Accounts", CITY: "Indore" },
      { EMP_ID: 206, NAME: "Rohan Verma", SALARY: 85000, DEPT: "IT", CITY: "Bhopal" }
    ]
  },
  CUSTOMERS: {
    name: "CUSTOMERS",
    columns: ["CUSTOMER_ID", "FIRST_NAME", "LAST_NAME", "AGE", "COUNTRY"],
    types: {
      CUSTOMER_ID: "INTEGER",
      FIRST_NAME: "VARCHAR(100)",
      LAST_NAME: "VARCHAR(100)",
      AGE: "INTEGER",
      COUNTRY: "VARCHAR(100)"
    },
    primaryKeys: ["CUSTOMER_ID"],
    rows: [
      { CUSTOMER_ID: 1, FIRST_NAME: "John", LAST_NAME: "Doe", AGE: 31, COUNTRY: "USA" },
      { CUSTOMER_ID: 2, FIRST_NAME: "Robert", LAST_NAME: "Luna", AGE: 22, COUNTRY: "USA" },
      { CUSTOMER_ID: 3, FIRST_NAME: "David", LAST_NAME: "Robinson", AGE: 25, COUNTRY: "UK" },
      { CUSTOMER_ID: 4, FIRST_NAME: "John", LAST_NAME: "Reinhardt", AGE: 47, COUNTRY: "Germany" },
      { CUSTOMER_ID: 5, FIRST_NAME: "Betty", LAST_NAME: "Doe", AGE: 28, COUNTRY: "UAE" }
    ]
  },
  ORDERS: {
    name: "ORDERS",
    columns: ["ORDER_ID", "ITEM", "AMOUNT", "CUSTOMER_ID"],
    types: {
      ORDER_ID: "INTEGER",
      ITEM: "VARCHAR(100)",
      AMOUNT: "INTEGER",
      CUSTOMER_ID: "INTEGER"
    },
    primaryKeys: ["ORDER_ID"],
    rows: [
      { ORDER_ID: 1, ITEM: "Keyboard", AMOUNT: 400, CUSTOMER_ID: 4 },
      { ORDER_ID: 2, ITEM: "Mouse", AMOUNT: 150, CUSTOMER_ID: 4 },
      { ORDER_ID: 3, ITEM: "Monitor", AMOUNT: 12000, CUSTOMER_ID: 3 },
      { ORDER_ID: 4, ITEM: "Headphones", AMOUNT: 2000, CUSTOMER_ID: 1 },
      { ORDER_ID: 5, ITEM: "Webcam", AMOUNT: 3000, CUSTOMER_ID: 2 }
    ]
  },
  SHIPPINGS: {
    name: "SHIPPINGS",
    columns: ["SHIPPING_ID", "STATUS", "CUSTOMER"],
    types: {
      SHIPPING_ID: "INTEGER",
      STATUS: "INTEGER",
      CUSTOMER: "INTEGER"
    },
    primaryKeys: ["SHIPPING_ID"],
    rows: [
      { SHIPPING_ID: 1001, STATUS: 1, CUSTOMER: 1 },
      { SHIPPING_ID: 1002, STATUS: 0, CUSTOMER: 2 },
      { SHIPPING_ID: 1003, STATUS: 1, CUSTOMER: 3 },
      { SHIPPING_ID: 1004, STATUS: 2, CUSTOMER: 4 }
    ]
  },
  EMPLOYEES: {
    name: "EMPLOYEES",
    columns: ["EMPLOYEE_ID", "FIRST_NAME", "LAST_NAME", "SALARY", "JOB_ID", "MANAGER_ID", "DEPARTMENT_ID"],
    types: {
      EMPLOYEE_ID: "INTEGER",
      FIRST_NAME: "VARCHAR(100)",
      LAST_NAME: "VARCHAR(100)",
      SALARY: "INTEGER",
      JOB_ID: "VARCHAR(30)",
      MANAGER_ID: "INTEGER",
      DEPARTMENT_ID: "INTEGER"
    },
    primaryKeys: ["EMPLOYEE_ID"],
    rows: [
      { EMPLOYEE_ID: 100, FIRST_NAME: "Steven", LAST_NAME: "King", SALARY: 24000, JOB_ID: "AD_PRES", MANAGER_ID: null, DEPARTMENT_ID: 90 },
      { EMPLOYEE_ID: 101, FIRST_NAME: "Neena", LAST_NAME: "Kochhar", SALARY: 17000, JOB_ID: "AD_VP", MANAGER_ID: 100, DEPARTMENT_ID: 90 },
      { EMPLOYEE_ID: 102, FIRST_NAME: "Lex", LAST_NAME: "De Haan", SALARY: 17000, JOB_ID: "AD_VP", MANAGER_ID: 100, DEPARTMENT_ID: 90 },
      { EMPLOYEE_ID: 103, FIRST_NAME: "Alexander", LAST_NAME: "Hunold", SALARY: 9000, JOB_ID: "IT_PROG", MANAGER_ID: 102, DEPARTMENT_ID: 60 },
      { EMPLOYEE_ID: 104, FIRST_NAME: "Bruce", LAST_NAME: "Ernst", SALARY: 6000, JOB_ID: "IT_PROG", MANAGER_ID: 103, DEPARTMENT_ID: 60 },
      { EMPLOYEE_ID: 105, FIRST_NAME: "David", LAST_NAME: "Austin", SALARY: 4800, JOB_ID: "IT_PROG", MANAGER_ID: 103, DEPARTMENT_ID: 60 }
    ]
  },
  JOBS: {
    name: "JOBS",
    columns: ["JOB_ID", "JOB_TITLE", "MIN_SALARY", "MAX_SALARY"],
    types: {
      JOB_ID: "VARCHAR(30)",
      JOB_TITLE: "VARCHAR(100)",
      MIN_SALARY: "INTEGER",
      MAX_SALARY: "INTEGER"
    },
    primaryKeys: ["JOB_ID"],
    rows: [
      { JOB_ID: "AD_PRES", JOB_TITLE: "President", MIN_SALARY: 20000, MAX_SALARY: 40000 },
      { JOB_ID: "AD_VP", JOB_TITLE: "Administration Vice President", MIN_SALARY: 15000, MAX_SALARY: 30000 },
      { JOB_ID: "IT_PROG", JOB_TITLE: "Programmer", MIN_SALARY: 4000, MAX_SALARY: 10000 },
      { JOB_ID: "FI_MGR", JOB_TITLE: "Finance Manager", MIN_SALARY: 8200, MAX_SALARY: 16000 }
    ]
  },
  JOB_HISTORY: {
    name: "JOB_HISTORY",
    columns: ["EMPLOYEE_ID", "START_DATE", "END_DATE", "JOB_ID", "DEPARTMENT_ID"],
    types: {
      EMPLOYEE_ID: "INTEGER",
      START_DATE: "VARCHAR(30)",
      END_DATE: "VARCHAR(30)",
      JOB_ID: "VARCHAR(30)",
      DEPARTMENT_ID: "INTEGER"
    },
    primaryKeys: ["EMPLOYEE_ID", "START_DATE"],
    rows: [
      { EMPLOYEE_ID: 102, START_DATE: "2018-01-13", END_DATE: "2021-07-24", JOB_ID: "IT_PROG", DEPARTMENT_ID: 60 },
      { EMPLOYEE_ID: 101, START_DATE: "2015-09-21", END_DATE: "2018-03-10", JOB_ID: "AC_ACCOUNT", DEPARTMENT_ID: 110 },
      { EMPLOYEE_ID: 101, START_DATE: "2018-03-11", END_DATE: "2022-12-31", JOB_ID: "AC_MGR", DEPARTMENT_ID: 110 }
    ]
  },
  DEPARTMENTS: {
    name: "DEPARTMENTS",
    columns: ["DEPARTMENT_ID", "DEPARTMENT_NAME", "MANAGER_ID", "LOCATION_ID"],
    types: {
      DEPARTMENT_ID: "INTEGER",
      DEPARTMENT_NAME: "VARCHAR(100)",
      MANAGER_ID: "INTEGER",
      LOCATION_ID: "INTEGER"
    },
    primaryKeys: ["DEPARTMENT_ID"],
    rows: [
      { DEPARTMENT_ID: 10, DEPARTMENT_NAME: "Administration", MANAGER_ID: 200, LOCATION_ID: 1700 },
      { DEPARTMENT_ID: 20, DEPARTMENT_NAME: "Marketing", MANAGER_ID: 201, LOCATION_ID: 1800 },
      { DEPARTMENT_ID: 50, DEPARTMENT_NAME: "Shipping", MANAGER_ID: 124, LOCATION_ID: 1500 },
      { DEPARTMENT_ID: 60, DEPARTMENT_NAME: "IT", MANAGER_ID: 103, LOCATION_ID: 1400 },
      { DEPARTMENT_ID: 90, DEPARTMENT_NAME: "Executive", MANAGER_ID: 100, LOCATION_ID: 1700 }
    ]
  },
  LOCATIONS: {
    name: "LOCATIONS",
    columns: ["LOCATION_ID", "STREET_ADDRESS", "POSTAL_CODE", "CITY", "COUNTRY_ID"],
    types: {
      LOCATION_ID: "INTEGER",
      STREET_ADDRESS: "VARCHAR(100)",
      POSTAL_CODE: "VARCHAR(30)",
      CITY: "VARCHAR(100)",
      COUNTRY_ID: "VARCHAR(10)"
    },
    primaryKeys: ["LOCATION_ID"],
    rows: [
      { LOCATION_ID: 1400, STREET_ADDRESS: "2014 Jabberwocky Rd", POSTAL_CODE: "26192", CITY: "Southlake", COUNTRY_ID: "US" },
      { LOCATION_ID: 1500, STREET_ADDRESS: "2011 Interiors Blvd", POSTAL_CODE: "99236", CITY: "South San Francisco", COUNTRY_ID: "US" },
      { LOCATION_ID: 1700, STREET_ADDRESS: "2004 Charade Rd", POSTAL_CODE: "98199", CITY: "Seattle", COUNTRY_ID: "US" },
      { LOCATION_ID: 1800, STREET_ADDRESS: "460 Bloor St W", POSTAL_CODE: "M5S 1X8", CITY: "Toronto", COUNTRY_ID: "CA" }
    ]
  },
  COUNTRIES: {
    name: "COUNTRIES",
    columns: ["COUNTRY_ID", "COUNTRY_NAME", "REGION_ID"],
    types: {
      COUNTRY_ID: "VARCHAR(10)",
      COUNTRY_NAME: "VARCHAR(100)",
      REGION_ID: "INTEGER"
    },
    primaryKeys: ["COUNTRY_ID"],
    rows: [
      { COUNTRY_ID: "CA", COUNTRY_NAME: "Canada", REGION_ID: 2 },
      { COUNTRY_ID: "DE", COUNTRY_NAME: "Germany", REGION_ID: 1 },
      { COUNTRY_ID: "UK", COUNTRY_NAME: "United Kingdom", REGION_ID: 1 },
      { COUNTRY_ID: "US", COUNTRY_NAME: "United States", REGION_ID: 2 },
      { COUNTRY_ID: "IN", COUNTRY_NAME: "India", REGION_ID: 3 }
    ]
  },
  REGIONS: {
    name: "REGIONS",
    columns: ["REGION_ID", "REGION_NAME"],
    types: {
      REGION_ID: "INTEGER",
      REGION_NAME: "VARCHAR(100)"
    },
    primaryKeys: ["REGION_ID"],
    rows: [
      { REGION_ID: 1, REGION_NAME: "Europe" },
      { REGION_ID: 2, REGION_NAME: "Americas" },
      { REGION_ID: 3, REGION_NAME: "Asia" },
      { REGION_ID: 4, REGION_NAME: "Middle East and Africa" }
    ]
  }
};

const STARTER_QUERY = `-- SQL Online Editor. Write and run queries online.
-- Select all records from the STUDENT database
SELECT * FROM STUDENT;
`;

export default function SQLPlayground() {
  const [query, setQuery] = useState<string>(STARTER_QUERY);
  const [resultColumns, setResultColumns] = useState<string[]>([]);
  const [resultRows, setResultRows] = useState<Record<string, any>[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [expandedTables, setExpandedTables] = useState<Record<string, boolean>>({
    CUSTOMERS: true,
    ORDERS: true,
    SHIPPINGS: true,
    STUDENT: false,
    EMPLOYEE: false,
    EMPLOYEES: false,
    JOBS: false,
    JOB_HISTORY: false,
    DEPARTMENTS: false,
    LOCATIONS: false,
    COUNTRIES: false,
    REGIONS: false
  });
  const [activeLeftTab, setActiveLeftTab] = useState<"editor" | "schema">("editor");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showShared, setShowShared] = useState(false);

  const handleExecuteSQL = () => {
    setErrorMessage(null);
    setResultRows([]);
    setResultColumns([]);

    const cleanLines = query
      .split("\n")
      .map(line => line.replace(/--.*$/, "").trim())
      .filter(line => line.length > 0);

    const sanitized = cleanLines.join(" ").replace(/;$/, "").trim().replace(/\s+/g, " ");

    if (!sanitized) {
      setErrorMessage("SQL Error: The query is empty.");
      return;
    }

    const selectMatch = sanitized.match(/^SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+GROUP\s+BY\s+(\w+))?(?:\s+ORDER\s+BY\s+(.+?))?$/i);

    if (!selectMatch) {
      setErrorMessage("SQL Syntax Error: Supported queries must match standard structures:\nSELECT column1, column2 FROM TableName [WHERE condition] [GROUP BY column] [ORDER BY column [DESC]]");
      return;
    }

    const colsStr = selectMatch[1].trim();
    const tableStr = selectMatch[2].trim().toUpperCase();
    const whereStr = selectMatch[3] ? selectMatch[3].trim() : null;
    const groupByStr = selectMatch[4] ? selectMatch[4].trim() : null;
    const orderByStr = selectMatch[5] ? selectMatch[5].trim() : null;

    if (!SEED_DATA[tableStr]) {
      setErrorMessage(`SQL Error: Table '${tableStr}' not found in database. Supported tables: ${Object.keys(SEED_DATA).join(", ")}.`);
      return;
    }

    const table = SEED_DATA[tableStr];
    let filteredRows = [...table.rows];

    // 1. Process WHERE Clause
    if (whereStr) {
      try {
        filteredRows = filteredRows.filter(row => {
          let evalStr = whereStr;
          
          evalStr = evalStr.replace(/\bAND\b/gi, "&&").replace(/\bOR\b/gi, "||");
          
          evalStr = evalStr.replace(/(\w+)\s*=\s*(['"\w\d\s\.]+)/gi, (match, col, val) => {
            const trimmedCol = col.toUpperCase();
            if (row[trimmedCol] === undefined) return "false";
            const cellValue = row[trimmedCol];
            
            if (val.trim().startsWith("'") || val.trim().startsWith('"')) {
              const strVal = val.trim().replace(/['"]/g, "");
              return `"${cellValue.toString().toLowerCase()}" === "${strVal.toLowerCase()}"`;
            } else if (!isNaN(Number(val.trim()))) {
              return `${cellValue} === ${Number(val.trim())}`;
            }
            return `"${cellValue.toString().toLowerCase()}" === "${val.trim().toLowerCase()}"`;
          });

          evalStr = evalStr.replace(/(\w+)\s*(>=|<=|>|<)\s*([\d\.]+)/gi, (match, col, op, val) => {
            const trimmedCol = col.toUpperCase();
            if (row[trimmedCol] === undefined) return "false";
            return `${row[trimmedCol]} ${op} ${val}`;
          });

          try {
            const checkFunc = new Function("row", `return (${evalStr})`);
            return checkFunc(row);
          } catch (e) {
            return true;
          }
        });
      } catch (err) {
        setErrorMessage("SQL Error: Invalid column names or syntax in WHERE clause.");
        return;
      }
    }

    // 2. Process GROUP BY
    if (groupByStr) {
      const groupCol = groupByStr.toUpperCase();
      if (!table.columns.includes(groupCol)) {
        setErrorMessage(`SQL Error: Column '${groupByStr}' does not exist on table '${tableStr}'.`);
        return;
      }

      const groups: Record<string, any[]> = {};
      filteredRows.forEach(row => {
        const val = row[groupCol];
        if (!groups[val]) groups[val] = [];
        groups[val].push(row);
      });

      const projectedRows: any[] = [];
      Object.entries(groups).forEach(([key, groupRows]) => {
        const newRow: Record<string, any> = { [groupCol]: key };
        
        if (colsStr.toUpperCase().includes("COUNT(*)")) {
          newRow["COUNT(*)"] = groupRows.length;
        }

        // Generic support for SUM(...)
        const sumMatch = colsStr.match(/SUM\((\w+)\)/i);
        if (sumMatch) {
          const colName = sumMatch[1].toUpperCase();
          const total = groupRows.reduce((acc, r) => acc + (Number(r[colName]) || 0), 0);
          newRow[`SUM(${colName})`] = total;
        }

        // Generic support for AVG(...)
        const avgMatch = colsStr.match(/AVG\((\w+)\)/i);
        if (avgMatch) {
          const colName = avgMatch[1].toUpperCase();
          const total = groupRows.reduce((acc, r) => acc + (Number(r[colName]) || 0), 0);
          newRow[`AVG(${colName})`] = Math.round(total / groupRows.length);
        }

        projectedRows.push(newRow);
      });

      filteredRows = projectedRows;
    }

    // 3. Process Projection
    let finalColumns: string[] = [];
    if (colsStr === "*") {
      finalColumns = [...table.columns];
    } else {
      finalColumns = colsStr.split(",").map(c => c.trim().toUpperCase());
      
      if (groupByStr) {
        finalColumns = finalColumns.map(c => {
          if (c === "COUNT(*)" || c.startsWith("COUNT")) return "COUNT(*)";
          
          const sumM = c.match(/SUM\((\w+)\)/i);
          if (sumM) return `SUM(${sumM[1].toUpperCase()})`;

          const avgM = c.match(/AVG\((\w+)\)/i);
          if (avgM) return `AVG(${avgM[1].toUpperCase()})`;

          return c;
        });
      }
    }

    for (const c of finalColumns) {
      const baseCol = c.replace(/\(\*\)/g, "").replace(/\(\w+\)/g, "");
      if (!table.columns.includes(baseCol) && c !== "COUNT(*)" && !c.includes("(")) {
        setErrorMessage(`SQL Error: Column '${c}' does not exist on table '${tableStr}'.`);
        return;
      }
    }

    let projectedRows = filteredRows.map(row => {
      const newRow: Record<string, any> = {};
      finalColumns.forEach(c => {
        newRow[c] = row[c] !== undefined ? row[c] : (row[c.toLowerCase()] !== undefined ? row[c.toLowerCase()] : null);
      });
      return newRow;
    });

    // 4. Process ORDER BY
    if (orderByStr) {
      const orderParts = orderByStr.split(/\s+/);
      const sortCol = orderParts[0].trim().toUpperCase();
      const isDesc = orderParts[1] && orderParts[1].toUpperCase() === "DESC";

      projectedRows.sort((a, b) => {
        const valA = a[sortCol];
        const valB = b[sortCol];
        if (valA === undefined || valB === undefined) return 0;
        
        if (typeof valA === "number" && typeof valB === "number") {
          return isDesc ? valB - valA : valA - valB;
        }
        return isDesc 
          ? valB.toString().localeCompare(valA.toString()) 
          : valA.toString().localeCompare(valB.toString());
      });
    }

    setResultColumns(finalColumns);
    setResultRows(projectedRows);
  };

  const handleResetQuery = () => {
    setQuery(STARTER_QUERY);
    setErrorMessage(null);
    setResultRows([]);
    setResultColumns([]);
  };

  const handleClearOutput = () => {
    setResultRows([]);
    setResultColumns([]);
    setErrorMessage(null);
  };

  const handleCopyQuery = () => {
    setShowCopied(true);
    navigator.clipboard.writeText(query);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const isDark = theme === "dark";
  const outerBg = isDark ? "bg-[#11151c]" : "bg-[#eceef3]";
  const workspaceBg = isDark ? "bg-[#181d24]" : "bg-[#f1f3f7]";
  const editorHeaderBg = isDark ? "bg-[#11151c]" : "bg-[#e2e8f0]";
  const editorBodyBg = isDark ? "bg-[#1e2432]" : "bg-[#ffffff]";
  const editorGutterBg = isDark ? "bg-[#1b212e]" : "bg-[#f8fafc]";
  const outputHeaderBg = isDark ? "bg-[#11151c]" : "bg-[#e2e8f0]";
  const outputBodyBg = isDark ? "bg-[#1e2432]" : "bg-[#ffffff]";
  const textPrimary = isDark ? "text-slate-200" : "text-slate-800";
  const textMuted = isDark ? "text-slate-400" : "text-slate-500";
  const borderCol = isDark ? "border-[#151a24]" : "border-[#cbd5e1]";

  return (
    <div 
      id="programiz-sql-playground-container" 
      className={`w-full rounded-2xl overflow-hidden shadow-2xl flex flex-col font-sans transition-all duration-300 ${
        isFullscreen ? "fixed inset-0 z-50 w-screen h-screen rounded-none" : "w-full"
      }`}
    >
      {/* BRAND HEADER BAR (Programiz style) */}
      <div className={`${outerBg} border-b ${borderCol} px-6 py-3.5 flex items-center justify-between select-none`}>
        <div className="flex items-center gap-2">
          {/* Programiz Logo Mock */}
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 bg-[#005eff] rounded flex items-center justify-center font-black text-[12px] text-white">
              S
            </div>
            <span className={`font-sans font-black tracking-tight text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
              Programiz
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-500/10 shrink-0">
            SQL Online Compiler
          </span>
        </div>

        {/* PRO Badge/Button */}
        <div />
      </div>

      {/* WORKSPACE AREA */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 flex-1 ${workspaceBg} relative ${isFullscreen ? "h-[calc(100vh-60px)]" : ""}`}>
        
        {/* LEFT WORKSPACE PANEL: SQL Editor */}
        <div className={`flex flex-col border-r ${borderCol}`}>
          
          {/* Editor Header Tools */}
          <div className={`${editorHeaderBg} h-12 border-b ${borderCol} px-4 flex items-center justify-between select-none`}>
            {/* Tabs */}
            <div className="flex h-full items-end gap-1">
              <button 
                onClick={() => setActiveLeftTab("editor")}
                className={`px-4 py-2.5 rounded-t-lg font-mono text-[12px] font-bold ${
                  activeLeftTab === "editor" 
                    ? `border-b-2 border-[#005eff] ${isDark ? "bg-[#1e2432] text-white" : "bg-white text-slate-800"}` 
                    : `text-slate-400 hover:text-white`
                }`}
              >
                query.sql
              </button>
              
              <button 
                onClick={() => setActiveLeftTab("schema")}
                className={`px-4 py-2.5 rounded-t-lg font-mono text-[12px] font-bold ${
                  activeLeftTab === "schema" 
                    ? `border-b-2 border-[#005eff] ${isDark ? "bg-[#1e2432] text-white" : "bg-white text-slate-800"}` 
                    : `text-slate-400 hover:text-white`
                }`}
              >
                Schema Explorer
              </button>
            </div>

            {/* Run Actions and Icons */}
            <div className="flex items-center gap-3">
              {/* Fullscreen Button */}
              <button 
                onClick={() => setIsFullscreen(!isFullscreen)}
                className={`p-1.5 rounded-md hover:bg-slate-500/10 transition-colors ${textMuted}`}
                title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>

              {/* Theme Selector */}
              <button 
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className={`p-1.5 rounded-md hover:bg-slate-500/10 transition-colors ${textMuted}`}
                title={isDark ? "Light Mode" : "Dark Mode"}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>

              {/* Reset Query */}
              <button
                onClick={handleResetQuery}
                className="p-1.5 rounded-md hover:bg-slate-500/10 transition-colors text-slate-400"
                title="Reset starter query"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Royal Blue Programiz style Run Button */}
              <button
                onClick={handleExecuteSQL}
                className="px-5 py-1.5 bg-[#005eff] hover:bg-[#004ecc] text-white font-extrabold text-xs rounded transition-all duration-200 flex items-center gap-1.5 shadow-md"
              >
                <Play className="w-3 h-3 fill-current text-white" />
                Run
              </button>
            </div>
          </div>

          {/* Editor Input Area */}
          <div className="flex-1 flex relative">
            {activeLeftTab === "schema" ? (
              /* Interactive Collapsible Schema Explorer matching requested images */
              <div className={`p-6 space-y-4 overflow-y-auto w-full h-full max-h-[460px] ${editorBodyBg} ${textPrimary}`}>
                <div className="border-b border-slate-700/50 pb-3">
                  <h4 className="font-sans font-bold text-sm uppercase tracking-wide flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#005eff]" />
                    Interactive Schema Explorer
                  </h4>
                  <p className={`text-[11px] ${textMuted} mt-0.5`}>
                    Browse tables, view field types, and click to write templates automatically.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  {Object.keys(SEED_DATA).map((tblKey) => {
                    const tbl = SEED_DATA[tblKey];
                    const isExpanded = !!expandedTables[tblKey];
                    return (
                      <div key={tblKey} className={`border ${borderCol} rounded-xl overflow-hidden bg-slate-500/5`}>
                        <div 
                          onClick={() => {
                            setExpandedTables(prev => ({
                              ...prev,
                              [tblKey]: !prev[tblKey]
                            }));
                          }}
                          className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-500/5 transition-colors select-none"
                        >
                          <div className="flex items-center gap-2.5">
                            <Table className="w-4 h-4 text-[#005eff]" />
                            <span className="font-sans font-extrabold text-xs uppercase tracking-wide">
                              {tbl.name}
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.5 rounded ${isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                              {tbl.rows.length} rows
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setQuery(`SELECT * FROM ${tbl.name};\n`);
                                setActiveLeftTab("editor");
                              }}
                              className="px-2 py-0.5 bg-[#005eff]/10 hover:bg-[#005eff]/20 text-[#005eff] rounded text-[9px] font-bold uppercase transition-all"
                              title="Generate query template"
                            >
                              Query
                            </button>
                            <span className="text-xs font-mono font-bold text-slate-400 w-6 text-center">
                              {isExpanded ? "[-]" : "[+]"}
                            </span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className={`p-3 border-t ${borderCol} ${isDark ? "bg-[#151a24]/30" : "bg-[#f8fafc]/30"} font-mono text-[11px] space-y-1.5`}>
                            {tbl.columns.map((col) => {
                              const colType = tbl.types?.[col] || "VARCHAR";
                              const isPrimaryKey = tbl.primaryKeys?.includes(col);
                              return (
                                <div key={col} className="flex items-center pl-4 relative">
                                  {/* Indent connector line matching the visual layout */}
                                  <div className="absolute left-1.5 top-0 bottom-2.5 w-2 border-l border-b border-slate-700/50 rounded-bl" />
                                  
                                  <div className="flex items-center justify-between w-full pl-3.5">
                                    <span className={`font-mono ${isPrimaryKey ? "font-bold text-amber-500" : "text-slate-300"}`}>
                                      {col.toLowerCase()} {isPrimaryKey && <span className="text-[9px] bg-amber-500/15 text-amber-500 px-1 py-0.2 rounded ml-1 uppercase font-bold">PK</span>}
                                    </span>
                                    <span className="text-[10px] text-[#005eff] bg-[#005eff]/5 border border-[#005eff]/10 px-1.5 py-0.2 rounded font-mono">
                                      {colType.toLowerCase()}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              /* SQL Workspace code text entry */
              <>
                <div className={`${editorGutterBg} w-10 border-r ${borderCol} py-4 flex flex-col items-center select-none font-mono text-[11px] text-slate-500 leading-relaxed`}>
                  {Array.from({ length: Math.max(16, query.split("\n").length) }).map((_, i) => (
                    <span key={i} className="h-5 flex items-center justify-center">
                      {i + 1}
                    </span>
                  ))}
                </div>

                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  spellCheck={false}
                  className={`flex-1 ${editorBodyBg} ${textPrimary} font-mono text-[13px] leading-relaxed p-4 focus:outline-none resize-none overflow-y-auto h-full min-h-[400px] ${isFullscreen ? "h-full" : ""}`}
                  placeholder="-- Type SQL code here..."
                />

                <button 
                  onClick={handleCopyQuery}
                  className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/40 hover:bg-black/60 text-[10px] font-mono text-slate-300 rounded border border-white/10"
                >
                  {showCopied ? "Copied!" : "Copy SQL"}
                </button>
              </>
            )}
          </div>

        </div>

        {/* RIGHT WORKSPACE PANEL: SQL Output Table */}
        <div className="flex flex-col">
          
          {/* Output Header */}
          <div className={`${outputHeaderBg} h-12 border-b ${borderCol} px-4 flex items-center justify-between select-none`}>
            <span className={`text-[13px] font-bold tracking-wide ${textPrimary}`}>
              Output
            </span>

            {/* Clear Button */}
            <button 
              onClick={handleClearOutput}
              className="px-3 py-1 bg-transparent hover:bg-slate-500/10 border border-slate-500/30 rounded text-xs font-bold text-slate-400 transition-all uppercase tracking-wider"
            >
              Clear
            </button>
          </div>

          {/* Table Results rendering */}
          <div className={`flex-1 p-5 overflow-auto ${outputBodyBg} ${textPrimary} font-mono text-xs leading-relaxed min-h-[400px] ${isFullscreen ? "h-full" : ""}`}>
            {errorMessage ? (
              <div className="text-rose-500 space-y-1">
                <span className="font-bold uppercase tracking-wider block">Query Error:</span>
                <pre className="whitespace-pre-wrap text-rose-400 font-mono text-xs leading-relaxed">
                  {errorMessage}
                </pre>
              </div>
            ) : resultRows.length > 0 ? (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-500 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-1.5 rounded">
                  <Check className="w-3.5 h-3.5" />
                  <span>Success: {resultRows.length} {resultRows.length === 1 ? "record" : "records"} returned.</span>
                </div>

                <div className={`border ${borderCol} rounded-lg overflow-hidden bg-black/10`}>
                  <table className="w-full text-left font-mono text-[11px]">
                    <thead>
                      <tr className={`${editorGutterBg} border-b ${borderCol} text-[10px] uppercase font-bold text-slate-400`}>
                        {resultColumns.map(col => (
                          <th key={col} className="p-2.5 tracking-wider">{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {resultRows.map((row, rIdx) => (
                        <tr key={rIdx} className={`border-b ${borderCol} last:border-0 hover:bg-slate-500/5`}>
                          {resultColumns.map(col => (
                            <td key={col} className="p-2.5 text-slate-300">
                              {row[col] !== null && row[col] !== undefined ? row[col].toString() : "NULL"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 text-slate-500/60 select-none text-center">
                <Database className="w-7 h-7 text-slate-500/40 mb-2" />
                <span className="font-bold text-xs uppercase tracking-wide">No Data</span>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                  Enter and execute a SELECT statement on any table to view results.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
