import React, { useState, useCallback } from 'react';
import { useEditorStore } from '../store/index.js';
import { validateSyntax } from '../utils/codeValidation.js';
import { executeCode } from '../services/wasmExecutor.js';

export const OutputPanel = ({ interviewId }) => {
  const { code, language, output, isExecuting, setOutput, setIsExecuting } = useEditorStore();
  const [error, setError] = useState('');
  const [syntaxErrors, setSyntaxErrors] = useState([]);
  const [executionTime, setExecutionTime] = useState(0);
  const [tab, setTab] = useState('output'); // 'output' or 'validation'

  const handleValidate = useCallback(() => {
    const errors = validateSyntax(code, language);
    setSyntaxErrors(errors);
    setTab('validation');
  }, [code, language]);

  const handleExecute = async () => {
    setIsExecuting(true);
    setOutput('');
    setError('');
    setSyntaxErrors([]);
    setTab('output');

    const startTime = performance.now();

    try {
      // Validate syntax first
      const errors = validateSyntax(code, language);
      if (errors.length > 0) {
        setSyntaxErrors(errors);
        setTab('validation');
        setIsExecuting(false);
        return;
      }

      // Execute code in browser using WASM (no server call)
      const result = await executeCode(code, language, 10000);

      const endTime = performance.now();
      setExecutionTime((endTime - startTime).toFixed(2));

      if (result.error) {
        setError(result.error);
      } else {
        setOutput(result.output || 'Code executed successfully');
      }
    } catch (err) {
      setError(err.message || 'Failed to execute code');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Header with Execute Button and Tabs */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold text-gray-800">Output</h3>
          <div className="flex gap-2 border-l border-gray-300 pl-4">
            <button
              onClick={() => setTab('output')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                tab === 'output'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Output
            </button>
            <button
              onClick={() => setTab('validation')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                tab === 'validation'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:bg-gray-200'
              }`}
            >
              Validation {syntaxErrors.length > 0 && `(${syntaxErrors.length})`}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleValidate}
            className="px-3 py-2 text-sm bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors font-medium"
          >
            Validate
          </button>
          <button
            onClick={handleExecute}
            disabled={isExecuting}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-400 transition-colors font-medium flex items-center gap-2"
          >
            {isExecuting && <span className="inline-block animate-spin">⟳</span>}
            {isExecuting ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Output Tab */}
        {tab === 'output' && (
          <div className="p-4">
            {error ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="font-bold text-red-700 mb-2">❌ Execution Error</p>
                <pre className="text-red-600 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-words">
                  {error}
                </pre>
              </div>
            ) : output ? (
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                  <p className="font-bold text-gray-800">✓ Output</p>
                  {executionTime > 0 && (
                    <span className="text-sm text-gray-500">
                      Executed in {executionTime}ms
                    </span>
                  )}
                </div>
                <pre className="text-gray-800 font-mono text-sm overflow-x-auto whitespace-pre-wrap break-words">
                  {output}
                </pre>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p className="text-sm">No output yet. Click "Run Code" to execute.</p>
              </div>
            )}
          </div>
        )}

        {/* Validation Tab */}
        {tab === 'validation' && (
          <div className="p-4">
            {syntaxErrors.length > 0 ? (
              <div className="space-y-3">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
                  <p className="font-bold text-yellow-700 mb-3">
                    ⚠️ Found {syntaxErrors.length} validation issue{syntaxErrors.length !== 1 ? 's' : ''}
                  </p>
                  <div className="space-y-2">
                    {syntaxErrors.map((error, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-yellow-200 rounded p-2 text-sm"
                      >
                        <span className="text-yellow-700 font-medium">
                          Line {error.line}:
                        </span>
                        <span className="text-yellow-600 ml-2">{error.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <p className="text-sm mb-4">✓ No syntax errors detected</p>
                <button
                  onClick={handleValidate}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm"
                >
                  Validate Code
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer with Stats */}
      <div className="px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-600 flex justify-between">
        <span>Language: {language.toUpperCase()}</span>
        {executionTime > 0 && <span>Last execution: {executionTime}ms</span>}
      </div>
    </div>
  );
};

export default OutputPanel;
