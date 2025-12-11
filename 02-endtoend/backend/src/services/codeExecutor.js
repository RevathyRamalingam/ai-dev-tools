import { spawn } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/config.js';

export class CodeExecutionService {
  static languageConfig = {
    python: {
      extension: '.py',
      command: 'python',
      timeout: config.maxExecutionTime * 1000,
    },
    javascript: {
      extension: '.js',
      command: 'node',
      timeout: config.maxExecutionTime * 1000,
    },
    java: {
      extension: '.java',
      command: 'java',
      timeout: config.maxExecutionTime * 1000,
    },
    cpp: {
      extension: '.cpp',
      command: 'g++',
      timeout: config.maxExecutionTime * 1000,
    },
    c: {
      extension: '.c',
      command: 'gcc',
      timeout: config.maxExecutionTime * 1000,
    },
  };

  static async executeCode(code, language, input = '') {
    language = language.toLowerCase();

    if (!this.languageConfig[language]) {
      return {
        success: false,
        output: null,
        error: `Language '${language}' is not supported`,
        executionTime: 0,
      };
    }

    const config = this.languageConfig[language];
    const tempDir = join(process.cwd(), 'temp');
    const fileName = `${uuidv4()}${config.extension}`;
    const filePath = join(tempDir, fileName);

    try {
      // Ensure temp directory exists
      if (!require('fs').existsSync(tempDir)) {
        require('fs').mkdirSync(tempDir, { recursive: true });
      }

      writeFileSync(filePath, code);
      const startTime = Date.now();

      let result;
      if (language === 'python' || language === 'javascript') {
        result = await this.executeScript(config.command, [filePath], input, config.timeout);
      } else if (language === 'cpp' || language === 'c') {
        // Compile first
        const compiledPath = filePath.replace(config.extension, '');
        await this.compileCode(language, filePath, compiledPath, config.timeout);
        result = await this.executeScript(compiledPath, [], input, config.timeout);
      }

      const executionTime = (Date.now() - startTime) / 1000;

      return {
        success: result.success,
        output: result.output,
        error: result.error,
        executionTime: executionTime.toFixed(2),
      };
    } catch (error) {
      return {
        success: false,
        output: null,
        error: error.message,
        executionTime: 0,
      };
    } finally {
      try {
        unlinkSync(filePath);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }

  static executeScript(command, args, input, timeout) {
    return new Promise((resolve) => {
      const process = spawn(command, args);
      let output = '';
      let error = '';

      const timeoutId = setTimeout(() => {
        process.kill();
        resolve({
          success: false,
          output: output || null,
          error: `Timeout: execution exceeded ${timeout / 1000}s`,
        });
      }, timeout);

      process.stdout.on('data', (data) => {
        output += data.toString();
      });

      process.stderr.on('data', (data) => {
        error += data.toString();
      });

      process.on('close', (code) => {
        clearTimeout(timeoutId);
        resolve({
          success: code === 0,
          output: output || null,
          error: error || null,
        });
      });

      process.on('error', (err) => {
        clearTimeout(timeoutId);
        resolve({
          success: false,
          output: null,
          error: err.message,
        });
      });

      if (input) {
        process.stdin.write(input);
      }
      process.stdin.end();
    });
  }

  static compileCode(language, source, output, timeout) {
    return new Promise((resolve, reject) => {
      const command = language === 'cpp' ? 'g++' : 'gcc';
      const compiler = spawn(command, [source, '-o', output]);
      let error = '';

      const timeoutId = setTimeout(() => {
        compiler.kill();
        reject(new Error('Compilation timeout'));
      }, timeout);

      compiler.stderr.on('data', (data) => {
        error += data.toString();
      });

      compiler.on('close', (code) => {
        clearTimeout(timeoutId);
        if (code !== 0) {
          reject(new Error(`Compilation failed: ${error}`));
        } else {
          resolve();
        }
      });
    });
  }
}

export default CodeExecutionService;
