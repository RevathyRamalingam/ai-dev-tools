# WASM Code Execution Architecture

## Overview

The platform now uses **WebAssembly (WASM) for browser-based code execution** instead of server-side execution. This provides:

✅ **Security** - Code runs in the browser sandbox, not on the server  
✅ **Privacy** - User code never leaves their machine  
✅ **Performance** - No network latency for code execution  
✅ **Scalability** - Zero load on backend servers  

## Technology Stack

### Python Execution: Pyodide
- **Library**: [Pyodide](https://pyodide.org/) v0.23.4+
- **Runtime**: Full CPython 3.11 compiled to WebAssembly
- **Packages**: Supports NumPy, Pandas, SciPy, Matplotlib, and 40+ scientific libraries
- **Isolation**: Runs in browser context with automatic stdout/stderr capture

### JavaScript Execution: Native Function Constructor
- **Runtime**: V8 engine (via browser)
- **Isolation**: Web Workers for UI thread safety
- **Sandbox**: Function constructor with restricted global scope
- **Output Capture**: Custom console.log/console.error redirection

## Architecture

```
┌─────────────────────────────────────────────┐
│        Frontend (React + Vite)              │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │  CodeEditor.jsx (Monaco Editor)     │   │
│  │  - Syntax Highlighting              │   │
│  │  - Language Selection               │   │
│  └──────────────┬──────────────────────┘   │
│                 │ code + language           │
│                 ▼                           │
│  ┌─────────────────────────────────────┐   │
│  │  OutputPanel.jsx (Execution UI)     │   │
│  │  - Execute Code Button              │   │
│  │  - Output Display                   │   │
│  │  - Error Handling                   │   │
│  └──────────────┬──────────────────────┘   │
│                 │                           │
│                 ▼                           │
│  ┌─────────────────────────────────────┐   │
│  │  wasmExecutor.js (WASM Runtime)     │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ executePythonCode()           │  │   │
│  │  │ - Initializes Pyodide         │  │   │
│  │  │ - Executes Python via WASM    │  │   │
│  │  │ - Captures stdout/stderr      │  │   │
│  │  └───────────────────────────────┘  │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ executeJavaScriptCode()       │  │   │
│  │  │ - Runs JavaScript natively    │  │   │
│  │  │ - Captures console output     │  │   │
│  │  │ - Implements timeout safety   │  │   │
│  │  └───────────────────────────────┘  │   │
│  │  ┌───────────────────────────────┐  │   │
│  │  │ executeCode()                 │  │   │
│  │  │ - Dispatcher by language      │  │   │
│  │  │ - Error handling              │  │   │
│  │  └───────────────────────────────┘  │   │
│  └─────────────────────────────────────┘   │
│                 │                           │
│                 ▼                           │
│  ┌─────────────────────────────────────┐   │
│  │  Browser Environment                │   │
│  │  - Pyodide WASM Runtime (Python)    │   │
│  │  - V8 JavaScript Engine             │   │
│  │  - Sandboxed Execution Context      │   │
│  └─────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
```

## File Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── CodeEditor.jsx (Monaco Editor UI)
│   │   ├── OutputPanel.jsx (Execution Results UI)
│   │   └── ...
│   ├── services/
│   │   ├── wasmExecutor.js (NEW - WASM execution engine)
│   │   ├── api.js (API client - backend calls deprecated)
│   │   └── ...
│   ├── utils/
│   │   ├── codeValidation.js (Pre-execution validation)
│   │   ├── syntaxHighlighting.js (Monaco themes)
│   │   └── ...
│   └── ...
├── package.json (with Pyodide dependency)
└── ...
```

## Usage Examples

### Python Code Execution

```javascript
import { executeCode } from '../services/wasmExecutor.js';

// Execute Python code
const result = await executeCode('print("Hello from WASM!")', 'python', 10000);

console.log(result);
// Output:
// {
//   output: "Hello from WASM!\n",
//   error: null,
//   executionTime: 1523.45
// }
```

### JavaScript Code Execution

```javascript
import { executeCode } from '../services/wasmExecutor.js';

// Execute JavaScript code
const result = await executeCode('console.log("Hello JS!")', 'javascript', 10000);

console.log(result);
// Output:
// {
//   output: "Hello JS!",
//   error: null,
//   executionTime: 45.23
// }
```

### With Timeout Handling

```javascript
// Code that will timeout
const result = await executeCode(
  'import time; time.sleep(15)',
  'python',
  5000 // 5 second timeout
);

console.log(result);
// Output:
// {
//   output: "",
//   error: "Execution timeout: exceeded 5000ms",
//   executionTime: 5000.12
// }
```

## Implementation Details

### Python Execution (Pyodide)

1. **Initialization**
   - Loads Pyodide WASM module from CDN (jsdelivr)
   - First execution initializes the full CPython runtime
   - Subsequent calls reuse the initialized runtime

2. **Code Execution**
   - Redirects `sys.stdout` to capture print output
   - Executes code via `pyodide.runPythonAsync()`
   - Retrieves captured output from StringIO buffer
   - Cleans up stdout redirection

3. **Package Support**
   - Pre-loaded: NumPy, Pandas
   - On-demand: SciPy, Matplotlib, and 35+ other packages
   - Package loading is automatic for `import` statements

4. **Error Handling**
   - Captures Python exceptions with traceback
   - Returns error message in result object
   - Timeout prevents infinite loops

### JavaScript Execution

1. **Code Execution**
   - Uses `Function` constructor for code evaluation
   - Executes in function scope (prevents global access)
   - Optional Web Worker for UI thread safety

2. **Output Capture**
   - Intercepts `console.log()` calls
   - Stores logs in array
   - Restores original console after execution

3. **Timeout Safety**
   - JavaScript has no built-in halt mechanism
   - Timeout promise races execution promise
   - Prevents UI freeze from infinite loops

4. **Security Considerations**
   - Function constructor is still more secure than `eval()`
   - No access to parent scope variables
   - Web Workers provide full isolation (future enhancement)

## Supported Languages

| Language | Runtime | Notes |
|----------|---------|-------|
| Python | Pyodide (CPython 3.11) | Full stdlib + 40+ scientific packages |
| JavaScript | Native V8 | Native browser engine |
| Java | Not supported yet | Requires GraalVM WASM |
| C/C++ | Not supported yet | Requires Emscripten |

## Performance Characteristics

### First Execution (Python)
- **Initialization**: ~2-5 seconds (Pyodide WASM load + CPython setup)
- **Subsequent executions**: ~50-200ms (depending on code complexity)
- **Memory**: ~50-100MB (Pyodide runtime in browser)

### JavaScript Execution
- **Initialization**: Instant (native V8)
- **Execution**: <5ms for typical code
- **Memory**: Minimal (no additional runtime)

### Network
- **Zero**: All execution happens in browser
- **Benefit**: Works offline after first Pyodide load

## Configuration

### Timeout Settings
```javascript
// Change default timeout (in milliseconds)
const result = await executeCode(code, language, 15000); // 15 seconds
```

### Package Loading (Python)
```javascript
// Automatically loaded in wasmExecutor.js
await pyodide.loadPackage(['numpy', 'pandas']);

// Add more packages:
// await pyodide.loadPackage(['scipy', 'matplotlib']);
```

## Security Considerations

### ✅ What's Secure
- **Code Sandbox**: Code runs in browser context, not on server
- **No Network Access**: Code cannot make HTTP requests (by default)
- **Resource Limits**: Timeout prevents runaway processes
- **Isolated State**: Each execution can reset variables

### ⚠️ Current Limitations
- **JavaScript**: Function constructor can still access some globals
- **Python**: Can access browser APIs through `js` module
- **No Real Isolation**: Malicious code could read memory (requires Web Workers)

### 🔒 Future Improvements
- **Web Workers**: Execute in separate thread, true isolation
- **Service Workers**: Additional layer of sandboxing
- **CSP Headers**: Content Security Policy to restrict capabilities
- **Resource Quotas**: CPU/Memory limits at browser level

## Migration from Server-Side Execution

### Before (Server-side with Express.js)
```javascript
// backend/src/services/codeExecutor.js
// - Code executed on server using child_process
// - Security risk: arbitrary code on server
// - Network latency for every execution
// - Server scaling issues under load
```

### After (Client-side with WASM)
```javascript
// frontend/src/services/wasmExecutor.js
// - Code executed in browser via WASM
// - Secure: sandboxed environment
// - No network latency
// - Zero server load
```

### API Changes

**Removed Endpoint** (no longer needed):
```
POST /api/interviews/:id/execute
Body: { code, language, stdin }
Response: { success, output, error }
```

**Updated Component**:
```javascript
// OLD (in OutputPanel.jsx)
const result = await interviewService.executeCode(interviewId, code, language, '');

// NEW (in OutputPanel.jsx)
const result = await executeCode(code, language, 10000);
```

## Testing

### Unit Tests
```javascript
// tests/unit/wasmExecutor.test.js
import { executeCode } from '../services/wasmExecutor.js';

describe('WASM Executor', () => {
  it('should execute Python code', async () => {
    const result = await executeCode('print(1 + 1)', 'python');
    expect(result.output).toBe('2\n');
  });

  it('should execute JavaScript code', async () => {
    const result = await executeCode('console.log(2 + 2)', 'javascript');
    expect(result.output).toBe('4');
  });
});
```

## Troubleshooting

### Pyodide Won't Load
**Error**: "Failed to initialize Pyodide"
**Solution**: Check CDN availability at https://cdn.jsdelivr.net/pyodide/v0.23.4/full/

### Python Import Errors
**Error**: "ModuleNotFoundError: No module named 'numpy'"
**Solution**: Add package to loadPackage() call in wasmExecutor.js

### JavaScript Timeout Not Working
**Error**: Infinite loop freezes UI
**Solution**: Increase timeout or fix infinite loop in user code

### Memory Issues
**Error**: Browser tab becomes unresponsive
**Solution**: Reduce Pyodide memory usage or split large files

## Future Enhancements

1. **Web Workers** - True isolation for JavaScript execution
2. **GraalVM** - Support for Java, C, C++ via WASM
3. **Package Management** - Allow users to request packages
4. **Caching** - Save Pyodide state between sessions
5. **Profiling** - Show CPU/memory usage during execution
6. **Collaborative Execution** - WebSocket sync of results
7. **Advanced Sandboxing** - ServiceWorkers for additional isolation

## References

- **Pyodide Official Docs**: https://pyodide.org/
- **WASM Spec**: https://webassembly.org/
- **JavaScript Sandboxing**: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
- **Web Workers**: https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API

## Summary

The WASM execution architecture provides:
- ✅ **Security**: Code runs in browser sandbox
- ✅ **Privacy**: No server-side code exposure
- ✅ **Performance**: No network latency
- ✅ **Scalability**: Zero backend load
- ✅ **Reliability**: Full Python stdlib support

This is the recommended approach for online coding platforms where code security and privacy are paramount.
