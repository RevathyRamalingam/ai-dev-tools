from sqlalchemy.orm import Session
from app.models import User, Problem, Interview, Solution
from app.schemas import UserCreate, UserResponse, ProblemCreate, InterviewCreate
from app.core.security import get_password_hash, verify_password
from typing import Optional, List

class UserService:
    """Service for user operations"""
    
    @staticmethod
    def create_user(db: Session, user: UserCreate) -> User:
        """Create a new user"""
        db_user = User(
            email=user.email,
            username=user.username,
            full_name=user.full_name,
            hashed_password=get_password_hash(user.password)
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        """Get user by email"""
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
        """Authenticate user"""
        user = UserService.get_user_by_email(db, email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

class ProblemService:
    """Service for problem operations"""
    
    @staticmethod
    def create_problem(db: Session, problem: ProblemCreate) -> Problem:
        """Create a new problem"""
        db_problem = Problem(**problem.dict())
        db.add(db_problem)
        db.commit()
        db.refresh(db_problem)
        return db_problem
    
    @staticmethod
    def get_problem(db: Session, problem_id: int) -> Optional[Problem]:
        """Get problem by ID"""
        return db.query(Problem).filter(Problem.id == problem_id).first()
    
    @staticmethod
    def get_all_problems(db: Session, skip: int = 0, limit: int = 10) -> List[Problem]:
        """Get all problems with pagination"""
        return db.query(Problem).offset(skip).limit(limit).all()

class InterviewService:
    """Service for interview operations"""
    
    @staticmethod
    def create_interview(db: Session, interview: InterviewCreate, interviewer_id: int) -> Interview:
        """Create a new interview"""
        db_interview = Interview(
            **interview.dict(),
            interviewer_id=interviewer_id
        )
        db.add(db_interview)
        db.commit()
        db.refresh(db_interview)
        return db_interview
    
    @staticmethod
    def get_interview(db: Session, interview_id: int) -> Optional[Interview]:
        """Get interview by ID"""
        return db.query(Interview).filter(Interview.id == interview_id).first()
    
    @staticmethod
    def get_user_interviews(db: Session, user_id: int) -> List[Interview]:
        """Get all interviews for a user"""
        return db.query(Interview).filter(
            (Interview.interviewer_id == user_id) | (Interview.candidate_id == user_id)
        ).all()

class SolutionService:
    """Service for solution operations"""
    
    @staticmethod
    def create_solution(db: Session, solution_data: dict) -> Solution:
        """Create a new solution"""
        db_solution = Solution(**solution_data)
        db.add(db_solution)
        db.commit()
        db.refresh(db_solution)
        return db_solution
    
    @staticmethod
    def get_solution(db: Session, solution_id: int) -> Optional[Solution]:
        """Get solution by ID"""
        return db.query(Solution).filter(Solution.id == solution_id).first()
    
    @staticmethod
    def get_interview_solutions(db: Session, interview_id: int) -> List[Solution]:
        """Get all solutions for an interview"""
        return db.query(Solution).filter(Solution.interview_id == interview_id).all()
