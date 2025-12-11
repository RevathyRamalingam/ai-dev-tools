/**
 * WASM-based Python Code Executor using Pyodide
 * Executes Python code in the browser using WebAssembly
 * Runs in a Web Worker to prevent blocking the UI
 */

let pyodide = null;
let isPyodideReady = false;

/**
 * Initialize Pyodide runtime
 * Loads the WASM module and prepares the Python environment
 */
async function initPyodide() {
  if (isPyodideReady) {
    return pyodide;
  }

  try {
    // Load Pyodide from CDN (more reliable than npm for WASM modules)
    const { loadPyodide } = await import(
      'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js'
    );

    pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/',
    });

    // Install common packages that might be needed
    await pyodide.loadPackage(['numpy', 'pandas']);

    isPyodideReady = true;
    console.log('Pyodide initialized successfully');
    return pyodide;
  } catch (error) {
    console.error('Failed to initialize Pyodide:', error);
    throw new Error(`Pyodide initialization failed: ${error.message}`);
  }
}

/**
 * Execute Python code and capture output
 * @param {string} code - Python code to execute
 * @param {number} timeout - Execution timeout in milliseconds (default: 10000)
 * @returns {Promise<{output: string, error: string | null, executionTime: number}>}
 */
async function executePythonCode(code, timeout = 10000) {
  const startTime = performance.now();

  try {
    // Initialize Pyodide if not already done
    if (!pyodide) {
      await initPyodide();
    }

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error(`Execution timeout: exceeded ${timeout}ms`)),
        timeout
      )
    );

    // Execute code with timeout
    const executionPromise = (async () => {
      // Redirect stdout to capture print statements
      const originalStdout = pyodide.sys.stdout;
      const outputBuffer = [];

      // Create a custom write function for stdout
      const writeFunction = (text) => {
        outputBuffer.push(text);
      };

      try {
        // Use JavaScript's stderr/stdout redirection in Pyodide
        pyodide.runPython(`
import sys
from io import StringIO

_stdout_buffer = StringIO()
sys.stdout = _stdout_buffer

def get_output():
    return _stdout_buffer.getvalue()
        `);

        // Execute user code
        await pyodide.runPythonAsync(code);

        // Get captured output
        const output = pyodide.runPython('get_output()');

        // Reset stdout
        pyodide.runPython('sys.stdout = sys.__stdout__');

        return {
          output: output.toString(),
          error: null,
          executionTime: performance.now() - startTime,
        };
      } catch (error) {
        return {
          output: '',
          error: error.message,
          executionTime: performance.now() - startTime,
        };
      }
    })();

    return Promise.race([executionPromise, timeoutPromise]);
  } catch (error) {
    return {
      output: '',
      error: error.message,
      executionTime: performance.now() - startTime,
    };
  }
}

/**
 * Execute JavaScript code in a sandboxed environment
 * @param {string} code - JavaScript code to execute
 * @param {number} timeout - Execution timeout in milliseconds (default: 10000)
 * @returns {Promise<{output: string, error: string | null, executionTime: number}>}
 */
async function executeJavaScriptCode(code, timeout = 10000) {
  const startTime = performance.now();

  return new Promise((resolve) => {
    const timeoutId = setTimeout(() => {
      resolve({
        output: '',
        error: 'Execution timeout: exceeded ' + timeout + 'ms',
        executionTime: performance.now() - startTime,
      });
    }, timeout);

    try {
      // Capture console.log output
      const logs = [];
      const originalLog = console.log;
      const originalError = console.error;

      console.log = (...args) => {
        logs.push(args.map((arg) => String(arg)).join(' '));
      };

      console.error = (...args) => {
        logs.push('ERROR: ' + args.map((arg) => String(arg)).join(' '));
      };

      try {
        // Execute code in a function scope to prevent direct variable access
        const fn = new Function(code);
        fn();

        clearTimeout(timeoutId);
        console.log = originalLog;
        console.error = originalError;

        resolve({
          output: logs.join('\n'),
          error: null,
          executionTime: performance.now() - startTime,
        });
      } catch (error) {
        clearTimeout(timeoutId);
        console.log = originalLog;
        console.error = originalError;

        resolve({
          output: logs.join('\n'),
          error: error.message,
          executionTime: performance.now() - startTime,
        });
      }
    } catch (error) {
      clearTimeout(timeoutId);

      resolve({
        output: '',
        error: 'Failed to execute code: ' + error.message,
        executionTime: performance.now() - startTime,
      });
    }
  });
}

/**
 * Execute code based on language type
 * @param {string} code - Code to execute
 * @param {string} language - Programming language ('python', 'javascript', etc.)
 * @param {number} timeout - Execution timeout in milliseconds
 * @returns {Promise<{output: string, error: string | null, executionTime: number}>}
 */
async function executeCode(code, language, timeout = 10000) {
  const normalizedLanguage = language.toLowerCase().trim();

  if (normalizedLanguage === 'python' || normalizedLanguage === 'py') {
    return executePythonCode(code, timeout);
  } else if (
    normalizedLanguage === 'javascript' ||
    normalizedLanguage === 'js'
  ) {
    return executeJavaScriptCode(code, timeout);
  } else {
    return {
      output: '',
      error: `Unsupported language: ${language}. Supported: Python, JavaScript`,
      executionTime: 0,
    };
  }
}

/**
 * Reset Pyodide state (useful for clearing variables between executions)
 */
async function resetPyodide() {
  if (pyodide && isPyodideReady) {
    try {
      pyodide.runPython('del _stdout_buffer');
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}

export { executeCode, executePythonCode, executeJavaScriptCode, resetPyodide };
