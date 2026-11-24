/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  RotateCcw, 
  Maximize2, 
  Minimize2, 
  Sun, 
  Moon, 
  Share2, 
  Trash2, 
  Sparkles,
  Clipboard,
  CheckCircle,
  HelpCircle,
  Terminal,
  BookOpen,
  Check
} from "lucide-react";

const STARTER_CODE = `# Online Python compiler (interpreter) to run Python online.
# Write Python 3 code in this online editor and run it.
print("Start small. Ship something.")
`;

// Safe browser-side Python compiler/interpreter simulation
function executePythonSim(pythonCode: string): { output: string; success: boolean; error?: string } {
  const outputLines: string[] = [];
  
  const print = (...args: any[]) => {
    outputLines.push(args.map(arg => {
      if (arg === undefined || arg === null) return "None";
      if (Array.isArray(arg)) {
        return "[" + arg.map(x => typeof x === "string" ? `'${x}'` : String(x)).join(", ") + "]";
      }
      return String(arg);
    }).join(" "));
  };

  const context: Record<string, any> = {
    print,
    range: (start: number, end?: number, step = 1) => {
      const arr: number[] = [];
      let s = start;
      let e = end;
      if (e === undefined) {
        e = start;
        s = 0;
      }
      for (let i = s; i < e; i += step) {
        arr.push(i);
      }
      return arr;
    },
    len: (obj: any) => {
      if (obj && obj.length !== undefined) return obj.length;
      return 0;
    }
  };

  try {
    const lines = pythonCode.split("\n");
    let jsCode = "";
    let indentStack: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      const trimmed = line.trim();
      
      if (!trimmed) {
        jsCode += "\n";
        continue;
      }
      
      if (trimmed.startsWith("#")) {
        jsCode += "// " + trimmed.slice(1) + "\n";
        continue;
      }

      const indent = line.length - line.trimStart().length;

      while (indentStack.length > 0 && indent < indentStack[indentStack.length - 1]) {
        jsCode += "}\n";
        indentStack.pop();
      }

      let processedLine = trimmed;
      processedLine = processedLine.replace(/#.*$/, "").trim();

      // Basic syntax transformations
      processedLine = processedLine.replace(/\.append\((.*?)\)/g, ".push($1)");
      processedLine = processedLine.replace(/\band\b/g, "&&")
                                   .replace(/\bor\b/g, "||")
                                   .replace(/\bnot\b/g, "!");

      if (processedLine.startsWith("def ") && processedLine.endsWith(":")) {
        const header = processedLine.slice(4, -1);
        processedLine = `function ${header} {`;
        indentStack.push(indent);
      } 
      else if (processedLine.startsWith("if ") && processedLine.endsWith(":")) {
        const cond = processedLine.slice(3, -1);
        processedLine = `if (${cond}) {`;
        indentStack.push(indent);
      } 
      else if (processedLine.startsWith("elif ") && processedLine.endsWith(":")) {
        const cond = processedLine.slice(5, -1);
        processedLine = `else if (${cond}) {`;
        indentStack.push(indent);
      } 
      else if (processedLine.startsWith("else:") || processedLine.startsWith("else :")) {
        processedLine = `else {`;
        indentStack.push(indent);
      } 
      else if (processedLine.startsWith("while ") && processedLine.endsWith(":")) {
        const cond = processedLine.slice(6, -1);
        processedLine = `while (${cond}) {`;
        indentStack.push(indent);
      } 
      else if (processedLine.startsWith("for ") && processedLine.includes(" in ") && processedLine.endsWith(":")) {
        const loopParts = processedLine.slice(4, -1).split(/\s+in\s+/);
        const loopVar = loopParts[0].trim();
        const loopIterable = loopParts[1].trim();
        processedLine = `for (let ${loopVar} of ${loopIterable}) {`;
        indentStack.push(indent);
      }

      jsCode += processedLine + "\n";
    }

    while (indentStack.length > 0) {
      jsCode += "}\n";
      indentStack.pop();
    }

    const contextKeys = Object.keys(context);
    const contextValues = Object.values(context);
    const runner = new Function(...contextKeys, jsCode);
    runner(...contextValues);

    return {
      success: true,
      output: outputLines.join("\n")
    };
  } catch (err: any) {
    return {
      success: false,
      output: outputLines.join("\n"),
      error: err.message || "SyntaxError: Invalid statement or indent scope"
    };
  }
}

export default function PythonIDE() {
  const [code, setCode] = useState<string>(STARTER_CODE);
  const [consoleLogs, setConsoleLogs] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showShared, setShowShared] = useState(false);
  
  const codeAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleRunCode = () => {
    setIsRunning(true);
    // Minimal mock compile latency
    setTimeout(() => {
      setIsRunning(false);
      const res = executePythonSim(code);
      if (res.success) {
        setConsoleLogs([res.output]);
      } else {
        setConsoleLogs([
          `An error occurred:\n${res.error}`
        ]);
      }
    }, 200);
  };

  const handleClearOutput = () => {
    setConsoleLogs([]);
  };

  const handleShare = () => {
    setShowShared(true);
    navigator.clipboard.writeText(window.location.href);
    setTimeout(() => setShowShared(false), 2000);
  };

  const handleCopyCode = () => {
    setShowCopied(true);
    navigator.clipboard.writeText(code);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      
      setTimeout(() => {
        if (codeAreaRef.current) {
          codeAreaRef.current.selectionStart = codeAreaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  // Color mappings based on Programiz layout
  // Dark colors: Background: #181d24, Editor BG: #1e2432, Header BG: #11151c
  // Light colors: Background: #f1f3f7, Editor BG: #ffffff, Header BG: #e2e8f0
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
      id="programiz-python-ide-container" 
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
              P
            </div>
            <span className={`font-sans font-black tracking-tight text-lg ${isDark ? "text-white" : "text-slate-900"}`}>
              Programiz
            </span>
          </div>
          <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-500/10 shrink-0">
            Python Online Compiler
          </span>
        </div>

        {/* PRO Badge/Button (As in image) */}
        <div />
      </div>

      {/* WORKSPACE AREA */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 flex-1 ${workspaceBg} relative ${isFullscreen ? "h-[calc(100vh-60px)]" : ""}`}>
        
        {/* LEFT WORKSPACE PANEL: Editor */}
        <div className={`flex flex-col border-r ${borderCol}`}>
          
          {/* Editor Header Tools */}
          <div className={`${editorHeaderBg} h-12 border-b ${borderCol} px-4 flex items-center justify-between select-none`}>
            {/* Tabs */}
            <div className="flex h-full items-end">
              <div className={`px-5 py-2.5 rounded-t-lg font-mono text-[13px] font-bold border-b-2 border-[#005eff] ${isDark ? "bg-[#1e2432] text-white" : "bg-white text-slate-800"}`}>
                main.py
              </div>
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

              {/* Share Code */}
              <button 
                onClick={handleShare}
                className="px-3 py-1.5 bg-slate-500/10 hover:bg-slate-500/20 rounded-md text-xs font-bold text-slate-400 border border-slate-500/15 transition-all flex items-center gap-1.5"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                {showShared ? "Link Copied!" : "Share"}
              </button>

              {/* Royal Blue Programiz style Run Button */}
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="px-5 py-1.5 bg-[#005eff] hover:bg-[#004ecc] disabled:bg-[#005eff]/50 text-white font-extrabold text-xs rounded transition-all duration-200 flex items-center gap-1.5 shadow-md"
              >
                <Play className="w-3 h-3 fill-current text-white" />
                {isRunning ? "Running..." : "Run"}
              </button>
            </div>
          </div>

          {/* Editor Input Area */}
          <div className="flex-1 flex relative">
            {/* Gutter Line numbers */}
            <div className={`${editorGutterBg} w-10 border-r ${borderCol} py-4 flex flex-col items-center select-none font-mono text-[11px] text-slate-500 leading-relaxed`}>
              {Array.from({ length: Math.max(16, code.split("\n").length) }).map((_, i) => (
                <span key={i} className="h-5 flex items-center justify-center">
                  {i + 1}
                </span>
              ))}
            </div>

            {/* Editable Text Area */}
            <textarea
              ref={codeAreaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              className={`flex-1 ${editorBodyBg} ${textPrimary} font-mono text-[13px] leading-relaxed p-4 focus:outline-none resize-none overflow-y-auto h-full min-h-[400px] ${isFullscreen ? "h-full" : ""}`}
              placeholder="# Write Python code here..."
            />

            {/* Float helper */}
            <button 
              onClick={handleCopyCode}
              className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/40 hover:bg-black/60 text-[10px] font-mono text-slate-300 rounded border border-white/10"
            >
              {showCopied ? "Copied!" : "Copy code"}
            </button>
          </div>

        </div>

        {/* RIGHT WORKSPACE PANEL: Compiler Output */}
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

          {/* Console Output area */}
          <div className={`flex-1 p-5 overflow-y-auto ${outputBodyBg} ${textPrimary} font-mono text-xs leading-relaxed min-h-[400px] ${isFullscreen ? "h-full" : ""}`}>
            {consoleLogs.map((log, idx) => (
              <pre key={idx} className="whitespace-pre-wrap font-mono">
                {log}
              </pre>
            ))}

            {consoleLogs.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center py-20 text-slate-500/60 select-none text-center">
                <Terminal className="w-7 h-7 text-slate-500/40 mb-2" />
                <span className="font-bold text-xs uppercase tracking-wide">Terminal Idle</span>
                <p className="text-[11px] text-slate-500 mt-1 max-w-[200px] leading-relaxed">
                  Click the blue "Run" button to see terminal execution outputs.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
