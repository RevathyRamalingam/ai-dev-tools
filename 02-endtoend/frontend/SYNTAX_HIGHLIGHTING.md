# Syntax Highlighting & Code Validation

This document describes the syntax highlighting and code validation features added to the Coding Interview Platform.

## Overview

The platform now includes enhanced syntax highlighting for **JavaScript** and **Python** with additional support for Java, C++, and C.

## Features

### 1. **Advanced Syntax Highlighting**

#### JavaScript Highlighting
- Keywords: `const`, `let`, `var`, `function`, `async`, `await`, `class`, `import`, `export`, etc.
- Built-in functions: `Array`, `Object`, `Promise`, `console`, `JSON`, etc.
- Operators: `===`, `?.` (optional chaining), `??` (nullish coalescing), etc.
- String templates with backticks
- JSDoc comments

#### Python Highlighting
- Keywords: `def`, `class`, `async`, `await`, `for`, `while`, `if`, `try`, `except`, etc.
- Built-in functions: `print`, `len`, `range`, `enumerate`, `zip`, `map`, `filter`, etc.
- Operators: `//` (floor division), `**` (exponentiation), `and`, `or`, `not`, etc.
- Docstrings and comments

### 2. **Language-Specific Features**

The editor provides language-specific configurations:

| Language | Indent Size | Line Comment | Block Comment |
|----------|-----------|--------------|--------------|
| Python | 4 spaces | `#` | `"""..."""` |
| JavaScript | 2 spaces | `//` | `/* ... */` |
| Java | 4 spaces | `//` | `/* ... */` |
| C++ | 2 spaces | `//` | `/* ... */` |
| C | 2 spaces | `//` | `/* ... */` |

### 3. **Code Validation**

#### Python Validation
- Indentation checking
- Bracket/brace/parenthesis matching
- Unclosed block detection

#### JavaScript Validation
- Bracket/brace/parenthesis matching
- String literal handling
- Semicolon detection (optional)

### 4. **Enhanced Code Execution**

- Real-time output display
- Execution time tracking
- Error messages with line numbers
- Separate output and validation tabs

### 5. **Code Templates**

Quickly start with language-specific templates:

```python
# Python template
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
```

```javascript
// JavaScript template
function main() {
  console.log("Hello, World!");
}

main();
```

## Components

### CodeEditor Component

**File**: `frontend/src/components/CodeEditor.jsx`

```jsx
import { CodeEditor } from './components/CodeEditor';

<CodeEditor 
  onChange={(code) => console.log(code)}
  height="600px"
  defaultLanguage="python"
/>
```

**Features**:
- Language selection dropdown
- Syntax highlighting
- Auto-formatting on paste/type
- Bracket pair colorization
- Bracket pair guides
- Inline hints
- Code lens

### OutputPanel Component

**File**: `frontend/src/components/OutputPanel.jsx`

```jsx
import { OutputPanel } from './components/OutputPanel';

<OutputPanel interviewId={interviewId} />
```

**Features**:
- Code execution button
- Output display
- Error display with details
- Execution time tracking
- Syntax validation tab
- File info footer

## Utilities

### Syntax Highlighting Utilities

**File**: `frontend/src/utils/syntaxHighlighting.js`

Provides:
- Theme configurations (dark/light)
- Language-specific keywords and operators
- Syntax highlighting rules
- Configuration for each language

**Usage**:
```javascript
import { LANGUAGE_HIGHLIGHTING, getLanguageHighlighting } from '../utils/syntaxHighlighting';

const pythonHighlighting = getLanguageHighlighting('python');
console.log(pythonHighlighting.config);
console.log(pythonHighlighting.highlighting.keywords);
```

### Code Validation Utilities

**File**: `frontend/src/utils/codeValidation.js`

Provides:
- `useSyntaxHighlighting(editorRef)` - Hook for editor decorations
- `getLanguageTemplate(language)` - Get starter templates
- `validateSyntax(code, language)` - Validate code syntax
- `validatePythonSyntax(lines, errors)` - Python-specific validation
- `validateJavaScriptSyntax(lines, errors)` - JavaScript-specific validation

**Usage**:
```javascript
import { validateSyntax, getLanguageTemplate } from '../utils/codeValidation';

// Get template
const template = getLanguageTemplate('python');

// Validate code
const errors = validateSyntax(code, 'python');
if (errors.length > 0) {
  console.log('Syntax errors found:', errors);
}
```

## Configuration

### Add New Language

1. Add configuration to `LANGUAGE_CONFIG` in `CodeEditor.jsx`:
```jsx
myLanguage: {
  fileExtension: '.ml',
  defaultCode: '// MyLanguage code',
  syntaxHighlight: {
    keywords: ['keyword1', 'keyword2'],
  },
}
```

2. Add to `SYNTAX_HIGHLIGHTING_CONFIG` in `syntaxHighlighting.js`:
```javascript
myLanguage: {
  name: 'My Language',
  fileExtension: '.ml',
  indentSize: 2,
  indentType: 'space',
  lineComment: '//',
  blockComment: ['/*', '*/'],
}
```

3. Add validation function in `codeValidation.js`:
```javascript
const validateMyLanguageSyntax = (lines, errors) => {
  // Validation logic
};
```

### Customize Theme

Edit `MONACO_THEMES` in `syntaxHighlighting.js`:

```javascript
myTheme: {
  base: 'vs-dark',
  colors: {
    'editor.background': '#1e1e1e',
    'editor.foreground': '#d4d4d4',
    // ... more colors
  },
}
```

## Editor Options

The CodeEditor comes with these default options:

```javascript
{
  minimap: { enabled: false },
  fontSize: 14,
  wordWrap: 'on',
  automaticLayout: true,
  formatOnPaste: true,
  formatOnType: true,
  bracketPairColorization: { enabled: true },
  lineNumbersMinChars: 2,
  scrollBeyondLastLine: false,
  smoothScrolling: true,
  cursorBlinking: 'blink',
  cursorStyle: 'line',
  renderLineHighlight: 'all',
  showUnused: true,
  inlineHints: { enabled: true },
  codeLens: true,
  folding: true,
  suggest: { enabled: true }
}
```

## Supported Languages

✅ **Python** - Full syntax highlighting and validation
✅ **JavaScript** - Full syntax highlighting and validation
✅ **Java** - Syntax highlighting
✅ **C++** - Syntax highlighting
✅ **C** - Syntax highlighting

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance Considerations

- Syntax validation runs on demand (click "Validate" button)
- Output updates with execution results
- Large files (1000+ lines) may have slight delay in highlighting
- Decorations are memoized for performance

## Troubleshooting

### Highlighting Not Appearing

1. Verify language is set correctly in dropdown
2. Check that code contains recognizable keywords
3. Try switching languages and back

### Validation Errors Not Showing

1. Click "Validate" button in output panel
2. Check syntax errors tab for details
3. Look for bracket mismatches

### Performance Issues

1. Disable minimap (already disabled by default)
2. Reduce font size
3. Use simpler language settings

## Examples

### Python Example

```python
def fibonacci(n):
    """Calculate fibonacci number at position n"""
    if n <= 1:
        return n
    
    a, b = 0, 1
    for _ in range(2, n + 1):
        a, b = b, a + b
    return b

# Execute
result = fibonacci(10)
print(f"Fibonacci(10) = {result}")
```

### JavaScript Example

```javascript
// Arrow function with async/await
const fetchData = async (url) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};

// Usage
fetchData('https://api.example.com/data')
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

## Future Enhancements

- [ ] Custom theme editor
- [ ] More language support (Go, Rust, TypeScript)
- [ ] Code formatting (Prettier integration)
- [ ] Linting (ESLint, Pylint integration)
- [ ] Real-time collaboration highlighting
- [ ] Diff highlighting
- [ ] Dark/light theme toggle

## References

- [Monaco Editor Docs](https://microsoft.github.io/monaco-editor/)
- [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- [Python Syntax](https://docs.python.org/3/reference/lexical_analysis.html)
- [JavaScript Syntax](https://tc39.es/ecma262/)
