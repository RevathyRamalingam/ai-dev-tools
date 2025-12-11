from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user
from app.schemas import ProblemCreate, ProblemResponse
from app.services import ProblemService
from app.models import Problem

router = APIRouter(prefix="/problems", tags=["problems"])

@router.post("/", response_model=ProblemResponse)
def create_problem(
    problem: ProblemCreate,
    current_user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new coding problem (admin only)"""
    db_problem = ProblemService.create_problem(db, problem)
    return db_problem

@router.get("/{problem_id}", response_model=ProblemResponse)
def get_problem(problem_id: int, db: Session = Depends(get_db)):
    """Get a specific problem"""
    db_problem = db.query(Problem).filter(Problem.id == problem_id).first()
    if not db_problem:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Problem not found"
        )
    return db_problem

@router.get("/", response_model=List[ProblemResponse])
def get_problems(
    skip: int = 0,
    limit: int = 10,
    difficulty: str = None,
    db: Session = Depends(get_db)
):
    """Get all problems with optional filtering"""
    query = db.query(Problem)
    if difficulty:
        query = query.filter(Problem.difficulty == difficulty)
    return query.offset(skip).limit(limit).all()
