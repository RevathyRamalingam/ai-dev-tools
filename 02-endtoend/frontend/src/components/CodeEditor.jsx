import React, { useCallback, useMemo } from 'react';
import Editor from '@monaco-editor/react';
import { useEditorStore } from '../store/index.js';

// Language-specific configuration
const LANGUAGE_CONFIG = {
  python: {
    fileExtension: '.py',
    defaultCode: '# Python code\nprint("Hello, World!")',
    syntaxHighlight: {
      keywords: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'return', 'async', 'await'],
    },
  },
  javascript: {
    fileExtension: '.js',
    defaultCode: '// JavaScript code\nconsole.log("Hello, World!");',
    syntaxHighlight: {
      keywords: ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'import', 'export', 'async', 'await', 'return'],
    },
  },
  java: {
    fileExtension: '.java',
    defaultCode: '// Java code\npublic class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, World!");\n  }\n}',
  },
  cpp: {
    fileExtension: '.cpp',
    defaultCode: '// C++ code\n#include <iostream>\nint main() {\n  std::cout << "Hello, World!" << std::endl;\n  return 0;\n}',
  },
  c: {
    fileExtension: '.c',
    defaultCode: '// C code\n#include <stdio.h>\nint main() {\n  printf("Hello, World!");\n  return 0;\n}',
  },
};

export const CodeEditor = ({ onChange, height = '600px', defaultLanguage = 'python' }) => {
  const { code, language } = useEditorStore();
  const { setCode } = useEditorStore();

  const handleChange = useCallback((value) => {
    setCode(value || '');
    onChange?.(value);
  }, [setCode, onChange]);

  const handleLanguageChange = useCallback((e) => {
    const newLanguage = e.target.value;
    useEditorStore.setState({ language: newLanguage });
  }, []);

  // Memoize editor options for performance
  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 14,
    wordWrap: 'on',
    automaticLayout: true,
    formatOnPaste: true,
    formatOnType: true,
    bracketPairColorization: {
      enabled: true,
    },
    'bracketPairColorization.independentColorPoolPerBracketType': true,
    lineNumbersMinChars: 2,
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    cursorBlinking: 'blink',
    cursorStyle: 'line',
    renderLineHighlight: 'all',
    showUnused: true,
    inlineHints: {
      enabled: true,
      fontSize: 12,
      padding: 8,
    },
    codeLens: true,
    folding: true,
    foldingStrategy: 'indentation',
    showFoldingControls: 'mouseover',
    suggest: {
      enabled: true,
      showWords: true,
      showSnippets: true,
      snippetsPreventQuickSuggestions: false,
    },
  }), []);

  const languageConfig = LANGUAGE_CONFIG[language] || LANGUAGE_CONFIG.python;

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Header with Language Selector */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-semibold text-gray-800">Code Editor</h3>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
            {language.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Language:</label>
          <select
            value={language}
            onChange={handleLanguageChange}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 font-medium hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
          </select>
        </div>
      </div>

      {/* Editor Container */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height={height}
          defaultLanguage={defaultLanguage}
          language={language}
          value={code}
          onChange={handleChange}
          theme="vs-dark"
          options={editorOptions}
          loading={<div className="flex items-center justify-center h-full text-gray-400">Loading editor...</div>}
        />
      </div>

      {/* Footer with Info */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600">
        <span>File: untitled{languageConfig.fileExtension} | </span>
        <span>Lines: {(code?.split('\n').length || 0)} | </span>
        <span>Characters: {code?.length || 0}</span>
      </div>
    </div>
  );
};

export default CodeEditor;
