# WASM Code Execution - Quick Reference

## What Changed?

**Before**: Code was executed on the server (security risk)  
**Now**: Code executes safely in the browser using WebAssembly (WASM)

## How to Use It

### In React Components

```jsx
import { executeCode } from '../services/wasmExecutor.js';

// Execute code
const result = await executeCode(code, language, timeout);

// Result structure
result = {
  output: "Code output as string",
  error: null,  // or error message string
  executionTime: 123.45  // milliseconds
}
```

### Python Execution

```javascript
// Simple Python
const result = await executeCode('print("Hello")', 'python');
console.log(result.output);  // "Hello\n"

// With data processing
const code = `
import json
data = {'name': 'John', 'age': 30}
print(json.dumps(data))
`;
const result = await executeCode(code, 'python');

// With NumPy/Pandas (auto-loaded)
const code = `
import numpy as np
arr = np.array([1, 2, 3, 4, 5])
print(f"Sum: {arr.sum()}")
`;
const result = await executeCode(code, 'python');
```

### JavaScript Execution

```javascript
// Simple JavaScript
const result = await executeCode('console.log(1 + 1)', 'javascript');
console.log(result.output);  // "2"

// With functions
const code = `
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n-1) + fibonacci(n-2);
}
console.log(fibonacci(10));
`;
const result = await executeCode(code, 'javascript');
```

## Timeout Settings

```javascript
// Default timeout: 10000ms (10 seconds)
const result = await executeCode(code, language);

// Custom timeout
const result = await executeCode(code, language, 5000);   // 5 seconds
const result = await executeCode(code, language, 30000);  // 30 seconds
```

## Error Handling

```javascript
try {
  const result = await executeCode(code, language);
  
  if (result.error) {
    console.error('Execution error:', result.error);
  } else {
    console.log('Output:', result.output);
  }
} catch (err) {
  console.error('Failed to execute:', err.message);
}
```

## Supported Languages

| Language | Support | Notes |
|----------|---------|-------|
| Python | ✅ Full | CPython 3.11, NumPy/Pandas included |
| JavaScript | ✅ Full | Native V8 engine |
| Java | ❌ Not yet | Requires GraalVM WASM |
| C/C++ | ❌ Not yet | Requires Emscripten |

## Common Patterns in OutputPanel.jsx

```jsx
import { executeCode } from '../services/wasmExecutor.js';
import { useEditorStore } from '../store/index.js';

export function MyComponent() {
  const { code, language } = useEditorStore();
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  
  const handleRun = async () => {
    const result = await executeCode(code, language, 10000);
    
    if (result.error) {
      setError(result.error);
      setOutput('');
    } else {
      setOutput(result.output);
      setError('');
    }
  };
  
  return (
    <div>
      <button onClick={handleRun}>Run Code</button>
      {error && <pre style={{color: 'red'}}>{error}</pre>}
      {output && <pre style={{color: 'green'}}>{output}</pre>}
    </div>
  );
}
```

## Performance Tips

### First Python Execution (~2-5 seconds)
- Pyodide WASM module loads from CDN
- This is normal and only happens once
- Browser caches the module for subsequent uses

### Subsequent Executions (~50-200ms)
- Python: Fast, runtime already initialized
- JavaScript: Very fast (<5ms)

### Optimize Large Files
```javascript
// ❌ Avoid: Multiple small executions
for (let i = 0; i < 1000; i++) {
  await executeCode(`result = ${i}`, 'python');
}

// ✅ Better: Single execution
await executeCode(`
for i in range(1000):
    result = i
`, 'python');
```

## What Works

✅ **Python**
- Standard library (os, sys, json, math, etc.)
- NumPy, Pandas, SciPy, Matplotlib
- File I/O (virtual filesystem)
- Regular expressions
- Exception handling
- Classes and functions

✅ **JavaScript**
- All ES6+ features
- console.log, console.error
- Math operations
- String manipulation
- Regular expressions
- Array/Object manipulation
- Async/await

## What Doesn't Work

❌ **Network requests** (fetch, XMLHttpRequest)  
❌ **File access** (can't read actual files)  
❌ **Process management** (spawn, fork)  
❌ **Local storage** (limited filesystem)  
❌ **WebGL** (not available in default Pyodide)  

## Security Model

```
┌──────────────────────────────────┐
│  User Code (Python/JavaScript)   │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  WASM Runtime                    │
│  - Isolated memory space         │
│  - Limited capabilities          │
│  - Timeout enforcement           │
└─────────────┬────────────────────┘
              │
              ▼
┌──────────────────────────────────┐
│  Browser Sandbox                 │
│  - No file system access         │
│  - No network access (by default)│
│  - No process management         │
└──────────────────────────────────┘
```

**Result**: User code is completely isolated from:
- The server (no code execution on backend)
- Other users' code (separate browser contexts)
- The host system (browser sandbox)

## API Changes from Server Execution

### Old API (Server-side execution)
```javascript
// Backend route: POST /api/interviews/:id/execute
const response = await fetch(`/api/interviews/${id}/execute`, {
  method: 'POST',
  body: JSON.stringify({ code, language, stdin })
});
const { output, error } = await response.json();
```

### New API (Client-side WASM)
```javascript
// Frontend service: wasmExecutor.js
const { output, error, executionTime } = await executeCode(code, language);
```

**Benefits**:
- ✅ No network latency
- ✅ No server load
- ✅ Better security
- ✅ Works offline (after first load)

## Debugging

### Check if Pyodide is loaded
```javascript
import { executePythonCode } from '../services/wasmExecutor.js';

try {
  const result = await executePythonCode('print("test")');
  console.log('Pyodide loaded successfully');
} catch (err) {
  console.error('Pyodide failed to load:', err);
}
```

### See execution details
```javascript
const result = await executeCode(code, language);
console.log('Output:', result.output);
console.log('Error:', result.error);
console.log('Time:', result.executionTime, 'ms');
```

### Monitor browser console
- Open DevTools (F12)
- Check Console tab for Pyodide initialization logs
- Check Network tab to see WASM module being downloaded

## References

- 📚 **WASM Execution Guide**: See `WASM_EXECUTION.md`
- 📚 **Platform README**: See `README.md`
- 🔗 **Pyodide Docs**: https://pyodide.org/
- 🔗 **Monaco Editor**: https://microsoft.github.io/monaco-editor/

## Summary

WASM execution provides **secure, fast, offline-capable code execution** in the browser. It's the recommended approach for online coding platforms.

**Key Points**:
- ✅ Code runs entirely in browser
- ✅ No server involvement
- ✅ Fully sandboxed
- ✅ Complete Python standard library
- ✅ Works offline
