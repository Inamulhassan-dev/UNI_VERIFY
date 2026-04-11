from sqlalchemy import create_engine, Column, Integer, String, Text, Float, DateTime, ForeignKey, LargeBinary
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# Database URL - SQLite for simplicity
DATABASE_URL = "sqlite:///./uni_verify.db"

# Create engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# ============ DATABASE MODELS ============

class User(Base):
    """User model for students and admins"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(20), default="student")  # student, admin
    roll_number = Column(String(50), nullable=True)
    department = Column(String(100), nullable=True)
    year = Column(Integer, nullable=True)
    semester = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    projects = relationship("Project", back_populates="student")


class Project(Base):
    """Project model for storing submitted projects"""
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    abstract = Column(Text, nullable=True)
    extracted_text = Column(Text, nullable=True)
    file_path = Column(String(500), nullable=True)
    embedding = Column(LargeBinary, nullable=True)  # Stored as bytes
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    originality_score = Column(Float, default=100.0)
    status = Column(String(20), default="pending")  # pending, approved, rejected
    year = Column(Integer, nullable=True)
    semester = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    student = relationship("User", back_populates="projects")
    submissions = relationship("Submission", back_populates="project")


class Submission(Base):
    """Submission model for tracking originality checks"""
    __tablename__ = "submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    similar_projects = Column(Text, nullable=True)  # JSON string of similar project IDs
    final_score = Column(Float, nullable=False)
    checked_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    project = relationship("Project", back_populates="submissions")


class WarehouseProject(Base):
    """Admin-managed knowledge base of existing projects"""
    __tablename__ = "warehouse_projects"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    department = Column(String(100), nullable=True)
    year = Column(Integer, nullable=True)
    file_format = Column(String(10), nullable=True)  # pdf, docx, txt, pptx
    text_path = Column(String(500), nullable=True)    # path to compressed .txt.gz
    embedding = Column(LargeBinary, nullable=True)     # model embedding bytes
    word_count = Column(Integer, nullable=True)
    abstract = Column(Text, nullable=True)
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationship
    uploader = relationship("User")


# ============ DATABASE UTILITIES ============

def get_db():
    """Dependency to get database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables"""
    Base.metadata.create_all(bind=engine)


# Create uploads directory if it doesn't exist
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
