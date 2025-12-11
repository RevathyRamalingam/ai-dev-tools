// Monaco Editor Theme Configuration for Enhanced Syntax Highlighting
// Provides beautiful syntax highlighting for JavaScript and Python code

export const MONACO_THEMES = {
  // Dark theme with custom colors
  dark: {
    base: 'vs-dark',
    colors: {
      'editor.background': '#1e1e1e',
      'editor.foreground': '#d4d4d4',
      'editor.lineNumbersBackground': '#1e1e1e',
      'editor.lineNumbersForeground': '#858585',
      'editor.selectionBackground': '#264f78',
      'editor.wordHighlightBackground': '#575757',
      'editor.findMatchBackground': '#515c6a',
      'editorBracketMatch.background': '#0098e615',
      'editorBracketMatch.border': '#0098e6',
      'editor.lineHighlightBackground': '#2d2d2d',
    },
  },
  // Light theme
  light: {
    base: 'vs',
    colors: {
      'editor.background': '#ffffff',
      'editor.foreground': '#333333',
      'editor.lineNumbersForeground': '#999999',
      'editor.selectionBackground': '#add6ff',
      'editor.wordHighlightBackground': '#f0f0f0',
      'editor.findMatchBackground': '#ffd700',
      'editorBracketMatch.background': '#ffd700',
      'editor.lineHighlightBackground': '#f5f5f5',
    },
  },
};

// Language-specific syntax highlighting rules
export const LANGUAGE_HIGHLIGHTING = {
  python: {
    keywords: ['False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue', 'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import', 'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while', 'with', 'yield'],
    builtins: ['abs', 'all', 'any', 'ascii', 'bin', 'bool', 'bytearray', 'bytes', 'callable', 'chr', 'classmethod', 'compile', 'complex', 'delattr', 'dict', 'dir', 'divmod', 'enumerate', 'eval', 'exec', 'filter', 'float', 'format', 'frozenset', 'getattr', 'globals', 'hasattr', 'hash', 'hex', 'id', 'input', 'int', 'isinstance', 'issubclass', 'iter', 'len', 'list', 'locals', 'map', 'max', 'memoryview', 'min', 'next', 'object', 'oct', 'open', 'ord', 'pow', 'print', 'property', 'range', 'repr', 'reversed', 'round', 'set', 'setattr', 'slice', 'sorted', 'staticmethod', 'str', 'sum', 'super', 'tuple', 'type', 'vars', 'zip'],
    operators: ['=', '==', '!=', '<', '>', '<=', '>=', '+', '-', '*', '/', '//', '%', '**', '&', '|', '^', '~', '<<', '>>'],
  },
  javascript: {
    keywords: ['abstract', 'arguments', 'await', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'double', 'else', 'enum', 'eval', 'export', 'extends', 'false', 'final', 'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in', 'instanceof', 'int', 'interface', 'let', 'long', 'native', 'new', 'null', 'package', 'private', 'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while', 'with', 'yield'],
    builtins: ['Array', 'Boolean', 'Date', 'Error', 'Function', 'Math', 'Number', 'Object', 'RegExp', 'String', 'console', 'document', 'window', 'JSON', 'Promise', 'Set', 'Map', 'WeakMap', 'WeakSet', 'Symbol', 'Proxy', 'Reflect'],
    operators: ['=', '==', '===', '!=', '!==', '<', '>', '<=', '>=', '+', '-', '*', '/', '%', '**', '++', '--', '&', '|', '^', '~', '&&', '||', '!', '?', ':', '??', '?.'],
  },
};

// Syntax highlighting configuration for different languages
export const SYNTAX_HIGHLIGHTING_CONFIG = {
  python: {
    name: 'Python',
    fileExtension: '.py',
    indentSize: 4,
    indentType: 'space',
    lineComment: '#',
    blockComment: ['"""', '"""'],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
    ],
  },
  javascript: {
    name: 'JavaScript',
    fileExtension: '.js',
    indentSize: 2,
    indentType: 'space',
    lineComment: '//',
    blockComment: ['/*', '*/'],
    autoClosingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' },
    ],
    surroundingPairs: [
      { open: '{', close: '}' },
      { open: '[', close: ']' },
      { open: '(', close: ')' },
      { open: '"', close: '"' },
      { open: "'", close: "'" },
      { open: '`', close: '`' },
    ],
  },
  java: {
    name: 'Java',
    fileExtension: '.java',
    indentSize: 4,
    indentType: 'space',
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  cpp: {
    name: 'C++',
    fileExtension: '.cpp',
    indentSize: 2,
    indentType: 'space',
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
  c: {
    name: 'C',
    fileExtension: '.c',
    indentSize: 2,
    indentType: 'space',
    lineComment: '//',
    blockComment: ['/*', '*/'],
  },
};

// Export a function to get all highlighting info for a language
export const getLanguageHighlighting = (language) => {
  return {
    config: SYNTAX_HIGHLIGHTING_CONFIG[language] || SYNTAX_HIGHLIGHTING_CONFIG.javascript,
    highlighting: LANGUAGE_HIGHLIGHTING[language] || LANGUAGE_HIGHLIGHTING.javascript,
  };
};

export default {
  MONACO_THEMES,
  LANGUAGE_HIGHLIGHTING,
  SYNTAX_HIGHLIGHTING_CONFIG,
  getLanguageHighlighting,
};
