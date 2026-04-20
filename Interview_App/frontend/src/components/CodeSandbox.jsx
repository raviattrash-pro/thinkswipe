import React, { useState, useEffect } from "react";
import { executeCode } from "../api";

function CodeSandbox({ initialCode, onAnswerChange }) {
  const [code, setCode] = useState(initialCode || "// Write your Java code here\npublic class Solution {\n    public static void main(String[] args) {\n        \n    }\n}");
  const [output, setOutput] = useState("");
  const [executing, setExecuting] = useState(false);
  const [Editor, setEditor] = useState(null);
  const [editorError, setEditorError] = useState(false);

  // Truly dynamic import to bypass Vite's static analysis
  useEffect(() => {
    // Vite cannot statically analyze strings constructed at runtime
    // This prevents the dev server from crashing if @monaco-editor/react is missing
    const parts = ["@monaco-editor", "react"];
    const editorPath = parts.join("/");
    
    import(/* @vite-ignore */ editorPath)
      .then((module) => {
        setEditor(() => module.default);
      })
      .catch((err) => {
        console.warn("Monaco Editor failed to load. Falling back to premium textarea.", err);
        setEditorError(true);
      });
  }, []);

  const handleRun = async () => {
    setExecuting(true);
    setOutput("Compiling and running...");
    try {
      const res = await executeCode(code);
      setOutput(res.output || res.error || "No output");
    } catch (e) {
      setOutput("Error: Backend code execution failed.");
    } finally {
      setExecuting(false);
    }
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    setCode(value);
    onAnswerChange(value);
  };

  return (
    <div className="code-sandbox glass-inner">
      <div className="sandbox-header">
        <span className="lang-badge">Java 17</span>
        <button 
          className="run-btn" 
          disabled={executing}
          onClick={handleRun}
        >
          {executing ? "Running..." : "▶ Run"}
        </button>
      </div>
      
      <div className="monaco-wrapper">
        {Editor ? (
          <Editor
            height="300px"
            defaultLanguage="java"
            theme="vs-dark"
            value={code}
            onChange={(val) => { setCode(val); onAnswerChange(val); }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              roundedSelection: true,
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 10, bottom: 10 }
            }}
          />
        ) : editorError ? (
          <div className="premium-fallback">
            <div className="fallback-banner">
              <span>Standard Edition Editor active.</span>
              <small>Run `npm install @monaco-editor/react` for the IDE experience.</small>
            </div>
            <textarea
              className="monospace-editor"
              value={code}
              onChange={handleTextareaChange}
              spellCheck="false"
              autoFocus
            />
          </div>
        ) : (
          <div className="editor-loading-state">
            <div className="loader-pulse"></div>
            <span>Configuring Environment...</span>
          </div>
        )}
      </div>

      <div className="sandbox-output">
        <label>Console Output:</label>
        <pre className={output.includes("failed") || output.includes("Error") ? "out-err" : ""}>
          {output || "Output will appear here after execution..."}
        </pre>
      </div>
    </div>
  );
}

export default CodeSandbox;
