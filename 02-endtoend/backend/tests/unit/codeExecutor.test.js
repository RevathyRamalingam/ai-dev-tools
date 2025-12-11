import { CodeExecutionService } from '../../src/services/codeExecutor.js';

describe('CodeExecutionService', () => {
  describe('executeCode - Python', () => {
    it('should execute simple Python code', async () => {
      const result = await CodeExecutionService.executeCode(
        'print("Hello, World!")',
        'python'
      );

      expect(result.success).toBe(true);
      expect(result.output).toContain('Hello, World!');
    });

    it('should handle Python with input', async () => {
      const result = await CodeExecutionService.executeCode(
        'n = int(input())\nprint(n * 2)',
        'python',
        '5'
      );

      expect(result.success).toBe(true);
      expect(result.output).toContain('10');
    });

    it('should handle Python syntax errors', async () => {
      const result = await CodeExecutionService.executeCode(
        'pritn("error")',
        'python'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle Python runtime errors', async () => {
      const result = await CodeExecutionService.executeCode(
        'x = 1 / 0',
        'python'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('executeCode - JavaScript', () => {
    it('should execute simple JavaScript code', async () => {
      const result = await CodeExecutionService.executeCode(
        'console.log("Hello, World!");',
        'javascript'
      );

      expect(result.success).toBe(true);
      expect(result.output).toContain('Hello, World!');
    });

    it('should handle JavaScript with multiple statements', async () => {
      const code = `
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce((a, b) => a + b, 0);
console.log(sum);
`;

      const result = await CodeExecutionService.executeCode(code, 'javascript');

      expect(result.success).toBe(true);
      expect(result.output).toContain('15');
    });

    it('should handle JavaScript syntax errors', async () => {
      const result = await CodeExecutionService.executeCode(
        'console.logg("error");',
        'javascript'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('executeCode - Unsupported Language', () => {
    it('should reject unsupported language', async () => {
      const result = await CodeExecutionService.executeCode(
        'package main',
        'go'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('not supported');
    });
  });

  describe('executeCode - Performance', () => {
    it('should measure execution time accurately', async () => {
      const result = await CodeExecutionService.executeCode(
        'print("test")',
        'python'
      );

      expect(result.executionTime).toBeDefined();
      expect(parseFloat(result.executionTime)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('executeCode - Edge Cases', () => {
    it('should handle empty code', async () => {
      const result = await CodeExecutionService.executeCode('', 'python');

      expect(result.success).toBe(true);
    });

    it('should handle code with output and errors', async () => {
      const code = `
print("Starting")
x = 1 / 0
`;

      const result = await CodeExecutionService.executeCode(code, 'python');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
