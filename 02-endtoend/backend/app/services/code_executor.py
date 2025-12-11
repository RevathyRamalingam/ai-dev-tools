import subprocess
import tempfile
import os
from typing import Dict, Tuple
from app.schemas import CodeExecutionRequest, CodeExecutionResult
from app.core.config import settings
import time

class CodeExecutionService:
    """Service for executing code in sandboxed environment"""
    
    LANGUAGE_CONFIG = {
        "python": {
            "extension": ".py",
            "command": "python",
            "timeout": settings.max_execution_time,
        },
        "javascript": {
            "extension": ".js",
            "command": "node",
            "timeout": settings.max_execution_time,
        },
        "java": {
            "extension": ".java",
            "command": "java",
            "timeout": settings.max_execution_time,
        },
        "cpp": {
            "extension": ".cpp",
            "command": "g++",
            "timeout": settings.max_execution_time,
        },
        "c": {
            "extension": ".c",
            "command": "gcc",
            "timeout": settings.max_execution_time,
        },
    }
    
    @staticmethod
    def execute_code(request: CodeExecutionRequest) -> CodeExecutionResult:
        """Execute code and return result"""
        language = request.language.lower()
        
        if language not in CodeExecutionService.LANGUAGE_CONFIG:
            return CodeExecutionResult(
                success=False,
                error=f"Language '{language}' is not supported",
                output=None,
                execution_time=0
            )
        
        try:
            config = CodeExecutionService.LANGUAGE_CONFIG[language]
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(
                mode='w',
                suffix=config['extension'],
                delete=False
            ) as f:
                f.write(request.code)
                temp_file = f.name
            
            try:
                start_time = time.time()
                
                # Prepare command
                if language == "python":
                    cmd = [config['command'], temp_file]
                elif language == "javascript":
                    cmd = [config['command'], temp_file]
                elif language == "cpp":
                    # Compile and run
                    output_file = temp_file.replace('.cpp', '')
                    subprocess.run(
                        [config['command'], temp_file, '-o', output_file],
                        capture_output=True,
                        timeout=config['timeout'],
                        text=True
                    )
                    cmd = [output_file]
                elif language == "c":
                    output_file = temp_file.replace('.c', '')
                    subprocess.run(
                        [config['command'], temp_file, '-o', output_file],
                        capture_output=True,
                        timeout=config['timeout'],
                        text=True
                    )
                    cmd = [output_file]
                else:
                    cmd = [config['command'], temp_file]
                
                # Execute
                result = subprocess.run(
                    cmd,
                    input=request.input_data,
                    capture_output=True,
                    timeout=config['timeout'],
                    text=True
                )
                
                execution_time = time.time() - start_time
                
                if result.returncode != 0:
                    return CodeExecutionResult(
                        success=False,
                        error=result.stderr or "Execution failed",
                        output=result.stdout if result.stdout else None,
                        execution_time=execution_time
                    )
                
                return CodeExecutionResult(
                    success=True,
                    output=result.stdout,
                    error=result.stderr if result.stderr else None,
                    execution_time=execution_time
                )
                
            finally:
                # Clean up
                os.unlink(temp_file)
                
        except subprocess.TimeoutExpired:
            return CodeExecutionResult(
                success=False,
                error=f"Code execution timed out (limit: {settings.max_execution_time}s)",
                output=None,
                execution_time=settings.max_execution_time
            )
        except Exception as e:
            return CodeExecutionResult(
                success=False,
                error=str(e),
                output=None,
                execution_time=0
            )
