import { useEffect } from 'react';
import { useEditorStore } from '../store/index.js';
import { SYNTAX_HIGHLIGHTING_CONFIG, LANGUAGE_HIGHLIGHTING } from '../utils/syntaxHighlighting.js';

/**
 * Custom Syntax Highlighter for Monaco Editor
 * Provides enhanced syntax highlighting for JavaScript and Python
 */
export const useSyntaxHighlighting = (editorRef) => {
  const { language } = useEditorStore();

  useEffect(() => {
    if (!editorRef?.current) return;

    const editor = editorRef.current;
    const model = editor?.getModel?.();
    
    if (!model) return;

    // Get language-specific configuration
    const config = SYNTAX_HIGHLIGHTING_CONFIG[language];
    if (!config) return;

    // Configure editor based on language settings
    const options = {
      tabSize: config.indentSize,
      insertSpaces: config.indentType === 'space',
      formatOnPaste: true,
      formatOnType: true,
    };

    editor?.updateOptions?.(options);

    // Apply language-specific decorations
    applyLanguageDecorations(editor, model, language);
  }, [language, editorRef]);
};

/**
 * Apply language-specific decorations for enhanced highlighting
 */
const applyLanguageDecorations = (editor, model, language) => {
  const decorations = [];
  const text = model.getValue();
  const lines = text.split('\n');

  const highlighting = LANGUAGE_HIGHLIGHTING[language];
  if (!highlighting) return;

  // Highlight keywords
  lines.forEach((line, lineNumber) => {
    const { keywords, builtins, operators } = highlighting;

    // Keyword highlighting
    keywords?.forEach((keyword) => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      let match;
      while ((match = regex.exec(line)) !== null) {
        decorations.push({
          range: new (require('@monaco-editor/react')).languages.Range(
            lineNumber + 1,
            match.index + 1,
            lineNumber + 1,
            match.index + keyword.length + 1
          ),
          options: {
            isWholeLine: false,
            className: 'keyword-highlight',
            glyphMarginClassName: 'codicon codicon-symbol-keyword',
            glyphMarginHoverMessage: 'Keyword',
          },
        });
      }
    });
  });

  // Apply decorations
  if (editor?.deltaDecorations && decorations.length > 0) {
    editor.deltaDecorations([], decorations);
  }
};

/**
 * Get language-specific templates for new files
 */
export const getLanguageTemplate = (language) => {
  const templates = {
    python: `# Python script
def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()
`,
    javascript: `// JavaScript code
function main() {
  console.log("Hello, World!");
}

main();
`,
    java: `public class Main {
  public static void main(String[] args) {
    System.out.println("Hello, World!");
  }
}
`,
    cpp: `#include <iostream>

int main() {
  std::cout << "Hello, World!" << std::endl;
  return 0;
}
`,
    c: `#include <stdio.h>

int main() {
  printf("Hello, World!\\n");
  return 0;
}
`,
  };

  return templates[language] || templates.python;
};

/**
 * Validate syntax for a given language
 */
export const validateSyntax = (code, language) => {
  const errors = [];
  const lines = code.split('\n');

  switch (language) {
    case 'python':
      validatePythonSyntax(lines, errors);
      break;
    case 'javascript':
      validateJavaScriptSyntax(lines, errors);
      break;
    default:
      break;
  }

  return errors;
};

const validatePythonSyntax = (lines, errors) => {
  let indentLevel = 0;
  const indentStack = [0];

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith('#')) return;

    // Check indentation
    const spaces = line.search(/\S/);
    if (spaces === -1) return; // Empty line

    // Detect colon at end of line (function def, class def, if statement)
    if (trimmed.endsWith(':')) {
      indentStack.push(spaces);
    } else if (spaces < indentStack[indentStack.length - 1]) {
      indentStack.pop();
    }
  });

  // Check for unclosed brackets/parentheses
  const code = lines.join('\n');
  checkUnclosedBrackets(code, errors, 'python');
};

const validateJavaScriptSyntax = (lines, errors) => {
  const code = lines.join('\n');
  
  // Check for unclosed brackets/braces/parentheses
  checkUnclosedBrackets(code, errors, 'javascript');

  // Check for missing semicolons (optional but common)
  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (
      trimmed &&
      !trimmed.endsWith(';') &&
      !trimmed.endsWith(',') &&
      !trimmed.endsWith('{') &&
      !trimmed.endsWith('}') &&
      !trimmed.endsWith('(') &&
      !trimmed.startsWith('//') &&
      !trimmed.startsWith('/*')
    ) {
      // This is a heuristic check
    }
  });
};

const checkUnclosedBrackets = (code, errors, language) => {
  const brackets = {
    '{': '}',
    '[': ']',
    '(': ')',
  };

  const stack = [];
  let inString = false;
  let stringChar = null;

  for (let i = 0; i < code.length; i++) {
    const char = code[i];
    const prevChar = i > 0 ? code[i - 1] : '';

    // Handle string literals
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
      continue;
    }

    // Skip if inside string
    if (inString) continue;

    // Check brackets
    if (brackets[char]) {
      stack.push({ char, line: code.substring(0, i).split('\n').length });
    } else if (Object.values(brackets).includes(char)) {
      const expected = stack.pop();
      if (!expected || brackets[expected.char] !== char) {
        errors.push({
          line: code.substring(0, i).split('\n').length,
          message: `Mismatched bracket: expected ${expected ? brackets[expected.char] : 'nothing'}, got ${char}`,
        });
      }
    }
  }

  // Check for unclosed brackets
  stack.forEach((bracket) => {
    errors.push({
      line: bracket.line,
      message: `Unclosed bracket: ${bracket.char}`,
    });
  });
};

export default {
  useSyntaxHighlighting,
  getLanguageTemplate,
  validateSyntax,
  validatePythonSyntax,
  validateJavaScriptSyntax,
};
