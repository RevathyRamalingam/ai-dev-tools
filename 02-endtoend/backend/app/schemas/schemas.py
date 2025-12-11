from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, List
from app.models import UserRole, InterviewStatus

class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    password: Optional[str] = None

class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class ProblemBase(BaseModel):
    title: str
    description: str
    difficulty: str
    tags: List[str] = []
    sample_input: str
    sample_output: str

class ProblemCreate(ProblemBase):
    test_cases: List[dict]

class ProblemResponse(ProblemBase):
    id: int
    test_cases: List[dict]
    created_at: datetime
    
    class Config:
        from_attributes = True

class InterviewBase(BaseModel):
    problem_id: int
    candidate_id: Optional[int] = None
    scheduled_at: datetime

class InterviewCreate(InterviewBase):
    pass

class InterviewUpdate(BaseModel):
    status: Optional[InterviewStatus] = None
    feedback: Optional[str] = None
    rating: Optional[int] = None

class InterviewResponse(BaseModel):
    id: int
    interviewer_id: int
    candidate_id: int
    problem_id: int
    status: InterviewStatus
    scheduled_at: datetime
    started_at: Optional[datetime]
    ended_at: Optional[datetime]
    feedback: Optional[str]
    rating: Optional[int]
    created_at: datetime
    
    class Config:
        from_attributes = True

class CodeExecutionRequest(BaseModel):
    code: str
    language: str = "python"
    input_data: Optional[str] = ""

class CodeExecutionResult(BaseModel):
    success: bool
    output: Optional[str] = None
    error: Optional[str] = None
    execution_time: float

class SolutionBase(BaseModel):
    code: str
    language: str

class SolutionCreate(SolutionBase):
    problem_id: int

class SolutionResponse(BaseModel):
    id: int
    interview_id: Optional[int]
    problem_id: int
    code: str
    language: str
    status: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True

class MessageBase(BaseModel):
    content: str
    message_type: str = "chat"

class MessageResponse(MessageBase):
    id: int
    interview_id: int
    sender_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True
