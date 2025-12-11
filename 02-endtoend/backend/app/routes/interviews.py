from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas import (
    InterviewCreate,
    InterviewUpdate,
    InterviewResponse,
    CodeExecutionRequest,
    CodeExecutionResult,
    SolutionCreate,
    SolutionResponse,
)
from app.services import InterviewService, SolutionService, CodeExecutionService
from app.models import Interview, Solution, InterviewStatus

router = APIRouter(prefix="/interviews", tags=["interviews"])

@router.post("/", response_model=InterviewResponse)
def create_interview(
    interview: InterviewCreate,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new interview session"""
    db_interview = InterviewService.create_interview(db, interview, int(current_user_id))
    return db_interview

@router.get("/{interview_id}", response_model=InterviewResponse)
def get_interview(interview_id: int, db: Session = Depends(get_db)):
    """Get interview details"""
    db_interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not db_interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    return db_interview

@router.put("/{interview_id}", response_model=InterviewResponse)
def update_interview(
    interview_id: int,
    interview_update: InterviewUpdate,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update interview status or feedback"""
    db_interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not db_interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    update_data = interview_update.dict(exclude_unset=True)
    
    # Start interview
    if "status" in update_data and update_data["status"] == InterviewStatus.ONGOING:
        db_interview.started_at = datetime.utcnow()
    
    # End interview
    if "status" in update_data and update_data["status"] == InterviewStatus.COMPLETED:
        db_interview.ended_at = datetime.utcnow()
    
    for key, value in update_data.items():
        setattr(db_interview, key, value)
    
    db.add(db_interview)
    db.commit()
    db.refresh(db_interview)
    return db_interview

@router.get("/user/{user_id}", response_model=List[InterviewResponse])
def get_user_interviews(user_id: int, db: Session = Depends(get_db)):
    """Get all interviews for a user"""
    interviews = db.query(Interview).filter(
        (Interview.interviewer_id == user_id) | (Interview.candidate_id == user_id)
    ).all()
    return interviews

@router.post("/{interview_id}/execute", response_model=CodeExecutionResult)
def execute_code(
    interview_id: int,
    request: CodeExecutionRequest,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Execute code during interview"""
    # Verify interview exists and user has access
    db_interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not db_interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    current_id = int(current_user_id)
    if db_interview.interviewer_id != current_id and db_interview.candidate_id != current_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this interview"
        )
    
    result = CodeExecutionService.execute_code(request)
    return result

@router.post("/{interview_id}/solutions", response_model=SolutionResponse)
def submit_solution(
    interview_id: int,
    solution: SolutionCreate,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Submit a solution during interview"""
    db_interview = db.query(Interview).filter(Interview.id == interview_id).first()
    if not db_interview:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Interview not found"
        )
    
    solution_data = solution.dict()
    solution_data["interview_id"] = interview_id
    solution_data["user_id"] = int(current_user_id)
    
    db_solution = SolutionService.create_solution(db, solution_data)
    return db_solution

@router.get("/{interview_id}/solutions", response_model=List[SolutionResponse])
def get_interview_solutions(
    interview_id: int,
    db: Session = Depends(get_db)
):
    """Get all solutions for an interview"""
    solutions = db.query(Solution).filter(Solution.interview_id == interview_id).all()
    return solutions
