"""
FastAPI server for the coding interview platform
Serves backend API and frontend static files
"""

from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from pathlib import Path
from typing import Optional

# Create FastAPI app
app = FastAPI(title="Coding Interview Platform API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models for request validation
class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class CodeExecute(BaseModel):
    code: str
    language: str
    stdin: Optional[str] = ""

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint for deployment"""
    return {"status": "healthy", "service": "coding-interview-platform"}

@app.get("/favicon.ico")
async def favicon():
    """Favicon endpoint"""
    return {"error": "No favicon"}

@app.get("/api/status")
async def api_status():
    """API status endpoint"""
    return {
        "status": "running",
        "version": "1.0.0",
        "timestamp": "2025-12-10"
    }

# Auth endpoints
@app.post("/api/auth/register")
async def register(user: UserRegister):
    """Register a new user"""
    return {
        "success": True,
        "message": "User registered successfully",
        "user": {
            "id": 1,
            "email": user.email,
            "name": user.name
        },
        "token": "mock-jwt-token-12345"
    }

@app.post("/api/auth/login")
async def login(user: UserLogin):
    """Login user"""
    return {
        "success": True,
        "message": "Login successful",
        "user": {
            "id": 1,
            "email": user.email,
            "name": "Test User"
        },
        "token": "mock-jwt-token-12345"
    }

@app.get("/api/auth/me")
async def get_current_user():
    """Get current authenticated user"""
    return {
        "success": True,
        "user": {
            "id": 1,
            "email": "user@example.com",
            "name": "Test User"
        }
    }

# Problem endpoints
@app.get("/api/problems")
async def get_problems(page: int = 1, limit: int = 10):
    """Get list of problems"""
    return {
        "success": True,
        "problems": [
            {
                "id": 1,
                "title": "Two Sum",
                "description": "Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.",
                "difficulty": "easy",
                "tags": ["array", "hash-table"],
                "acceptance_rate": "48.3%",
                "submissions": 15000000
            },
            {
                "id": 2,
                "title": "Reverse String",
                "description": "Write a function that reverses a string. The input string is given as an array of characters s.",
                "difficulty": "easy",
                "tags": ["string", "two-pointers"],
                "acceptance_rate": "78.2%",
                "submissions": 2500000
            },
            {
                "id": 3,
                "title": "Palindrome Check",
                "description": "Given a string s, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.",
                "difficulty": "easy",
                "tags": ["string", "two-pointers"],
                "acceptance_rate": "44.1%",
                "submissions": 1800000
            },
            {
                "id": 4,
                "title": "Longest Substring Without Repeating Characters",
                "description": "Given a string s, find the length of the longest substring without repeating characters.",
                "difficulty": "medium",
                "tags": ["string", "sliding-window", "hash-table"],
                "acceptance_rate": "33.4%",
                "submissions": 4500000
            },
            {
                "id": 5,
                "title": "Median of Two Sorted Arrays",
                "description": "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
                "difficulty": "hard",
                "tags": ["array", "binary-search", "divide-and-conquer"],
                "acceptance_rate": "26.1%",
                "submissions": 1200000
            },
            {
                "id": 6,
                "title": "Merge Two Sorted Lists",
                "description": "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list.",
                "difficulty": "easy",
                "tags": ["linked-list", "recursion"],
                "acceptance_rate": "60.5%",
                "submissions": 2100000
            }
        ],
        "total": 6,
        "page": page,
        "limit": limit
    }

@app.get("/api/problems/{problem_id}")
async def get_problem(problem_id: int):
    """Get a specific problem"""
    return {
        "success": True,
        "problem": {
            "id": problem_id,
            "title": "Two Sum",
            "description": "Find two numbers that add up to a target",
            "difficulty": "easy",
            "sampleInput": "[2, 7, 11, 15], target = 9",
            "sampleOutput": "[0, 1]",
            "testCases": []
        }
    }

# Interview endpoints
@app.get("/api/interviews")
async def get_interviews():
    """Get user's interviews"""
    return {
        "success": True,
        "interviews": [
            {
                "id": 1,
                "title": "Interview with John",
                "status": "completed",
                "created_at": "2025-12-10T10:00:00Z",
                "scheduled_at": "2025-12-10T10:00:00Z",
                "problem": {
                    "id": 1,
                    "title": "Two Sum"
                }
            },
            {
                "id": 2,
                "title": "Interview with Alice",
                "status": "scheduled",
                "created_at": "2025-12-11T14:00:00Z",
                "scheduled_at": "2025-12-15T14:00:00Z",
                "problem": {
                    "id": 2,
                    "title": "Reverse String"
                }
            },
            {
                "id": 3,
                "title": "Interview with Bob",
                "status": "ongoing",
                "created_at": "2025-12-11T15:00:00Z",
                "scheduled_at": "2025-12-11T15:00:00Z",
                "problem": {
                    "id": 3,
                    "title": "Palindrome Check"
                }
            }
        ]
    }

@app.get("/api/interviews/user/interviews")
async def get_user_interviews():
    """Get user's interviews (alias endpoint)"""
    return {
        "success": True,
        "interviews": [
            {
                "id": 1,
                "title": "Interview with John",
                "status": "completed",
                "created_at": "2025-12-10T10:00:00Z",
                "scheduled_at": "2025-12-10T10:00:00Z",
                "problem": {
                    "id": 1,
                    "title": "Two Sum"
                },
                "candidate": {
                    "id": 1,
                    "name": "John Doe",
                    "email": "john@example.com"
                },
                "interviewer": {
                    "id": 2,
                    "name": "Jane Smith",
                    "email": "jane@example.com"
                }
            },
            {
                "id": 2,
                "title": "Interview with Alice",
                "status": "scheduled",
                "created_at": "2025-12-11T14:00:00Z",
                "scheduled_at": "2025-12-15T14:00:00Z",
                "problem": {
                    "id": 2,
                    "title": "Reverse String"
                },
                "candidate": {
                    "id": 3,
                    "name": "Alice Johnson",
                    "email": "alice@example.com"
                },
                "interviewer": {
                    "id": 2,
                    "name": "Jane Smith",
                    "email": "jane@example.com"
                }
            },
            {
                "id": 3,
                "title": "Interview with Bob",
                "status": "ongoing",
                "created_at": "2025-12-11T15:00:00Z",
                "scheduled_at": "2025-12-11T15:00:00Z",
                "problem": {
                    "id": 3,
                    "title": "Palindrome Check"
                },
                "candidate": {
                    "id": 4,
                    "name": "Bob Wilson",
                    "email": "bob@example.com"
                },
                "interviewer": {
                    "id": 2,
                    "name": "Jane Smith",
                    "email": "jane@example.com"
                }
            }
        ]
    }

@app.post("/api/interviews")
async def create_interview(request: Request):
    """Create new interview"""
    data = await request.json()
    problem_id = data.get("problem_id", 1)
    title = data.get("title", "New Interview")
    return {
        "success": True,
        "interview": {
            "id": 999,
            "title": title,
            "problem_id": problem_id,
            "status": "active",
            "created_at": "2025-12-11T00:00:00Z",
            "problem": {
                "id": problem_id,
                "title": "Coding Problem"
            },
            "code": "",
            "output": ""
        }
    }

@app.get("/api/interviews/{interview_id}")
async def get_interview(interview_id: int):
    """Get interview details"""
    return {
        "success": True,
        "interview": {
            "id": interview_id,
            "title": "Interview Session",
            "status": "active",
            "problem_id": 1,
            "created_at": "2025-12-11T00:00:00Z",
            "problem": {
                "id": 1,
                "title": "Two Sum",
                "description": "Given an array of integers, find two numbers that add up to a target sum."
            },
            "code": "",
            "output": ""
        }
    }

@app.post("/api/interviews/{interview_id}/execute")
async def execute_code(interview_id: int, data: CodeExecute):
    """Execute code"""
    return {
        "success": True,
        "output": "Code execution successful (mock)",
        "error": None,
        "executionTime": 123.45
    }

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "ok"}

# Catch-all route for SPA (must be before static mount)
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    """Serve index.html for all unknown routes (SPA fallback)"""
    if full_path.startswith("api/"):
        # API routes should return 404
        raise HTTPException(status_code=404, detail="Not found")
    # For all other routes, serve the SPA
    frontend_path = Path(__file__).parent / "frontend" / "dist" / "index.html"
    if frontend_path.exists():
        return FileResponse(frontend_path)
    raise HTTPException(status_code=404, detail="Frontend not found")

# Mount static files (built React frontend)
# Must be done AFTER route definitions
frontend_path = Path(__file__).parent / "frontend" / "dist"
if frontend_path.exists():
    app.mount("/", StaticFiles(directory=str(frontend_path), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
