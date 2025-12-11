from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, Enum, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class UserRole(str, enum.Enum):
    CANDIDATE = "candidate"
    INTERVIEWER = "interviewer"
    ADMIN = "admin"

class InterviewStatus(str, enum.Enum):
    SCHEDULED = "scheduled"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    full_name = Column(String)
    hashed_password = Column(String)
    role = Column(Enum(UserRole), default=UserRole.CANDIDATE)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    interviews_as_interviewer = relationship(
        "Interview", foreign_keys="Interview.interviewer_id", back_populates="interviewer"
    )
    interviews_as_candidate = relationship(
        "Interview", foreign_keys="Interview.candidate_id", back_populates="candidate"
    )
    solutions = relationship("Solution", back_populates="user")

class Problem(Base):
    __tablename__ = "problems"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(Text)
    difficulty = Column(String)  # easy, medium, hard
    tags = Column(JSON, default=list)  # ["array", "sorting", etc.]
    sample_input = Column(Text)
    sample_output = Column(Text)
    test_cases = Column(JSON)  # [{input, output, hidden}, ...]
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    interviews = relationship("Interview", back_populates="problem")
    solutions = relationship("Solution", back_populates="problem")

class Interview(Base):
    __tablename__ = "interviews"
    
    id = Column(Integer, primary_key=True, index=True)
    interviewer_id = Column(Integer, ForeignKey("users.id"))
    candidate_id = Column(Integer, ForeignKey("users.id"))
    problem_id = Column(Integer, ForeignKey("problems.id"))
    status = Column(Enum(InterviewStatus), default=InterviewStatus.SCHEDULED)
    scheduled_at = Column(DateTime)
    started_at = Column(DateTime, nullable=True)
    ended_at = Column(DateTime, nullable=True)
    feedback = Column(Text, nullable=True)
    rating = Column(Integer, nullable=True)  # 1-5
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    interviewer = relationship("User", foreign_keys=[interviewer_id], back_populates="interviews_as_interviewer")
    candidate = relationship("User", foreign_keys=[candidate_id], back_populates="interviews_as_candidate")
    problem = relationship("Problem", back_populates="interviews")
    solutions = relationship("Solution", back_populates="interview")

class Solution(Base):
    __tablename__ = "solutions"
    
    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    problem_id = Column(Integer, ForeignKey("problems.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    code = Column(Text)
    language = Column(String)  # python, java, cpp, javascript, etc.
    status = Column(String)  # accepted, wrong_answer, runtime_error, timeout
    test_results = Column(JSON)  # [{test_case, passed, output, expected}, ...]
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    interview = relationship("Interview", back_populates="solutions")
    problem = relationship("Problem", back_populates="solutions")
    user = relationship("User", back_populates="solutions")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, index=True)
    interview_id = Column(Integer, ForeignKey("interviews.id"))
    sender_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)
    message_type = Column(String)  # chat, code_update, system
    created_at = Column(DateTime, default=datetime.utcnow)
