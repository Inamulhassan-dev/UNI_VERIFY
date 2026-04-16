from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import timedelta
import os
import json
import uuid

# Load .env file if present (no-op when the file is absent)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

from database import get_db, init_db, User, Project, Submission, WarehouseProject, UPLOAD_DIR
from auth import (
    create_access_token, 
    authenticate_user, 
    create_user, 
    get_current_user,
    get_current_admin,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

from ml_engine import analyze_project, generate_embedding, embedding_to_bytes
from document_processor import (
    extract_text_from_file,
    save_compressed_text,
    delete_compressed_text,
    is_supported_format,
    get_file_format,
    validate_document_content,
    get_warehouse_stats,
    extract_title_and_abstract,
    SUPPORTED_FORMATS,
    WAREHOUSE_DIR
)

# ============ INITIALIZE APP ============

app = FastAPI(
    title="UNI-VERIFY API",
    description="Project Originality Validation Portal for St. Philomena's College",
    version="1.0.0"
)

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup():
    init_db()
    print("[OK] Database initialized!")
    print("[OK] UNI-VERIFY API is running!")


# ============ PYDANTIC SCHEMAS ============

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    roll_number: Optional[str] = None
    department: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str
    roll_number: Optional[str]
    department: Optional[str]
    
    class Config:
        from_attributes = True

class ProjectResponse(BaseModel):
    id: int
    title: str
    abstract: Optional[str]
    originality_score: float
    status: str
    created_at: str
    student_name: Optional[str] = None
    
    class Config:
        from_attributes = True


# ============ AUTH ROUTES ============

@app.post("/api/auth/register", response_model=TokenResponse)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new student account"""
    user = create_user(
        db=db,
        name=user_data.name,
        email=user_data.email,
        password=user_data.password,
        role="student",
        roll_number=user_data.roll_number,
        department=user_data.department,
        year=user_data.year,
        semester=user_data.semester
    )
    
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }


@app.post("/api/auth/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """Login with email and password"""
    user = authenticate_user(db, credentials.email, credentials.password)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    access_token = create_access_token(
        data={"sub": str(user.id), "role": user.role},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": access_token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": user.role
        }
    }


@app.get("/api/auth/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """Get current user profile"""
    return current_user


# ============ PROJECT ROUTES ============

@app.post("/api/projects/upload")
async def upload_project(
    file: UploadFile = File(...),
    title: str = Form(...),
    year: int = Form(None),
    semester: int = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Upload a project document (PDF, DOCX, TXT, PPTX) and check for originality"""
    
    # Validate file type — now supports multiple formats
    if not is_supported_format(file.filename):
        supported = ', '.join(SUPPORTED_FORMATS)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format. Accepted: {supported}"
        )
    
    # Generate unique filename with original extension
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1].lower()
    file_path = os.path.join(UPLOAD_DIR, f"{file_id}{file_ext}")
    
    # Save file temporarily
    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    # Extract text from any supported format
    extracted_text = extract_text_from_file(file_path)
    
    if not extracted_text:
        os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from the document. Please ensure it contains readable text."
        )
    
    # Validate content
    is_valid, validation_message = validate_document_content(extracted_text)
    if not is_valid:
        os.remove(file_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=validation_message
        )
    
    # Delete original file and save compressed version to save space
    compressed_path, _ = save_compressed_text(extracted_text, file_id)
    os.remove(file_path)  # Remove original — only keep compressed
    
    # Extract title and abstract
    extracted_info = extract_title_and_abstract(extracted_text)
    
    # Get all existing project embeddings (student projects)
    existing_projects = db.query(Project.id, Project.embedding).filter(
        Project.embedding.isnot(None)
    ).all()
    
    existing_embeddings = [(p.id, p.embedding) for p in existing_projects]
    
    # Also get warehouse project embeddings (admin knowledge base)
    warehouse_projects = db.query(WarehouseProject.id, WarehouseProject.embedding).filter(
        WarehouseProject.embedding.isnot(None)
    ).all()
    
    # Combine both — use negative IDs for warehouse to distinguish
    warehouse_embeddings = [(-wp.id, wp.embedding) for wp in warehouse_projects]
    all_embeddings = existing_embeddings + warehouse_embeddings
    
    # Analyze for originality
    analysis = analyze_project(extracted_text, all_embeddings)
    
    # Create project record
    project = Project(
        title=title,
        abstract=extracted_info["abstract"][:1000],  # Limit abstract length
        extracted_text=extracted_text[:5000],  # Limit stored text
        file_path=compressed_path,  # Store compressed path instead of original
        embedding=analysis["embedding_bytes"],
        student_id=current_user.id,
        originality_score=analysis["originality_score"],
        status="pending",
        year=year,
        semester=semester
    )
    
    db.add(project)
    db.commit()
    db.refresh(project)
    
    # Create submission record
    submission = Submission(
        project_id=project.id,
        similar_projects=json.dumps(analysis["similar_projects"]),
        final_score=analysis["originality_score"]
    )
    
    db.add(submission)
    db.commit()
    
    # Get similar project details
    similar_details = []
    for sim in analysis["similar_projects"][:5]:  # Top 5 similar
        pid = sim["project_id"]
        if pid < 0:
            # Warehouse project (negative ID)
            wp = db.query(WarehouseProject).filter(WarehouseProject.id == abs(pid)).first()
            if wp:
                similar_details.append({
                    "id": wp.id,
                    "title": wp.title,
                    "similarity": sim["similarity"],
                    "year": wp.year,
                    "department": wp.department,
                    "source": "warehouse"
                })
        else:
            # Student project
            sim_project = db.query(Project).filter(Project.id == pid).first()
            if sim_project:
                similar_details.append({
                    "id": sim_project.id,
                    "title": sim_project.title,
                    "similarity": sim["similarity"],
                    "year": sim_project.year,
                    "semester": sim_project.semester,
                    "source": "student"
                })
    
    return {
        "success": True,
        "project": {
            "id": project.id,
            "title": project.title,
            "abstract": project.abstract,
            "originality_score": analysis["originality_score"],
            "status": analysis["status"],
            "message": analysis["message"]
        },
        "similar_projects": similar_details,
        "project_details": analysis.get("project_details", {}),
        "suggestions": analysis.get("suggestions", [])
    }


@app.get("/api/projects/my-projects")
def get_my_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all projects submitted by current user"""
    projects = db.query(Project).filter(
        Project.student_id == current_user.id
    ).order_by(Project.created_at.desc()).all()
    
    return {
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "abstract": p.abstract,
                "originality_score": p.originality_score,
                "status": p.status,
                "year": p.year,
                "semester": p.semester,
                "created_at": p.created_at.isoformat()
            }
            for p in projects
        ]
    }


@app.get("/api/projects/{project_id}")
def get_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get project details"""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Check access (owner or admin)
    if project.student_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Access denied")
    
    # Get submission details
    submission = db.query(Submission).filter(
        Submission.project_id == project_id
    ).order_by(Submission.checked_at.desc()).first()
    
    similar_projects = []
    if submission and submission.similar_projects:
        similar_ids = json.loads(submission.similar_projects)
        for sim in similar_ids[:5]:
            sim_project = db.query(Project).filter(Project.id == sim["project_id"]).first()
            if sim_project:
                similar_projects.append({
                    "id": sim_project.id,
                    "title": sim_project.title,
                    "similarity": sim["similarity"]
                })
    
    return {
        "id": project.id,
        "title": project.title,
        "abstract": project.abstract,
        "originality_score": project.originality_score,
        "status": project.status,
        "year": project.year,
        "semester": project.semester,
        "created_at": project.created_at.isoformat(),
        "similar_projects": similar_projects
    }


# ============ ADMIN ROUTES ============

@app.get("/api/admin/projects")
def get_all_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all projects (admin only)"""
    projects = db.query(Project).order_by(Project.created_at.desc()).all()
    
    result = []
    for p in projects:
        student = db.query(User).filter(User.id == p.student_id).first()
        result.append({
            "id": p.id,
            "title": p.title,
            "abstract": p.abstract,
            "originality_score": p.originality_score,
            "status": p.status,
            "year": p.year,
            "semester": p.semester,
            "created_at": p.created_at.isoformat(),
            "student": {
                "id": student.id if student else None,
                "name": student.name if student else "Unknown",
                "roll_number": student.roll_number if student else None,
                "department": student.department if student else None
            }
        })
    
    return {"projects": result}


@app.patch("/api/admin/projects/{project_id}/status")
def update_project_status(
    project_id: int,
    status: str = Form(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Update project status (admin only)"""
    project = db.query(Project).filter(Project.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    if status not in ["pending", "approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status")
    
    project.status = status
    db.commit()
    
    return {"success": True, "message": f"Project status updated to {status}"}


@app.get("/api/admin/stats")
def get_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get dashboard statistics (admin only)"""
    total_students = db.query(User).filter(User.role == "student").count()
    total_projects = db.query(Project).count()
    pending_projects = db.query(Project).filter(Project.status == "pending").count()
    approved_projects = db.query(Project).filter(Project.status == "approved").count()
    rejected_projects = db.query(Project).filter(Project.status == "rejected").count()
    
    # Average originality score
    from sqlalchemy import func
    avg_score = db.query(func.avg(Project.originality_score)).scalar() or 0
    
    return {
        "total_students": total_students,
        "total_projects": total_projects,
        "pending_projects": pending_projects,
        "approved_projects": approved_projects,
        "rejected_projects": rejected_projects,
        "average_originality_score": round(avg_score, 2)
    }


@app.get("/api/admin/users")
def get_all_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all users (admin only)"""
    users = db.query(User).order_by(User.created_at.desc()).all()
    
    return {
        "users": [
            {
                "id": u.id,
                "name": u.name,
                "email": u.email,
                "role": u.role,
                "roll_number": u.roll_number,
                "department": u.department,
                "created_at": u.created_at.isoformat()
            }
            for u in users
        ]
    }


# ============ ADMIN WAREHOUSE ROUTES ============

@app.post("/api/admin/warehouse/upload")
async def upload_to_warehouse(
    file: UploadFile = File(...),
    title: str = Form(...),
    department: str = Form(None),
    year: int = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Upload a project document to the admin data warehouse"""
    
    # Validate format
    if not is_supported_format(file.filename):
        supported = ', '.join(SUPPORTED_FORMATS)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format. Accepted: {supported}"
        )
    
    # Save file temporarily
    file_id = str(uuid.uuid4())
    file_ext = os.path.splitext(file.filename)[1].lower()
    temp_path = os.path.join(UPLOAD_DIR, f"temp_{file_id}{file_ext}")
    
    try:
        contents = await file.read()
        with open(temp_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    # Extract text from the document
    extracted_text = extract_text_from_file(temp_path)
    
    # Clean up temp file
    if os.path.exists(temp_path):
        os.remove(temp_path)
    
    if not extracted_text:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract text from the document."
        )
    
    # Validate content
    is_valid, msg = validate_document_content(extracted_text)
    if not is_valid:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)
    
    # Save as compressed text
    compressed_path, compressed_size = save_compressed_text(extracted_text, file_id)
    
    # Generate embedding for similarity matching
    embedding = generate_embedding(extracted_text)
    embedding_bytes = embedding_to_bytes(embedding)
    
    # ── Duplicate Detection: check if this document already exists in warehouse ──
    from ml_engine import find_similar_projects, bytes_to_embedding
    existing_warehouse = db.query(WarehouseProject.id, WarehouseProject.title, WarehouseProject.embedding).filter(
        WarehouseProject.embedding.isnot(None)
    ).all()
    
    existing_pairs = [(wp.id, wp.embedding) for wp in existing_warehouse]
    duplicates = find_similar_projects(embedding, existing_pairs, threshold=0.85)
    
    if duplicates:
        # Find the matching project title
        top_dup = duplicates[0]
        match = next((wp for wp in existing_warehouse if wp.id == top_dup["project_id"]), None)
        match_title = match.title if match else f"Project #{top_dup['project_id']}"
        
        # Clean up compressed file since we're not saving
        delete_compressed_text(compressed_path)
        
        return {
            "success": False,
            "duplicate": True,
            "message": f"⚠️ This document is {top_dup['similarity']}% similar to '{match_title}' already in the warehouse. Upload skipped.",
            "similar_to": {
                "id": top_dup["project_id"],
                "title": match_title,
                "similarity": top_dup["similarity"]
            }
        }
    
    # Create abstract from first 500 chars
    abstract = extracted_text[:500] + "..." if len(extracted_text) > 500 else extracted_text
    
    # Save to database
    warehouse_project = WarehouseProject(
        title=title,
        department=department,
        year=year,
        file_format=get_file_format(file.filename),
        text_path=compressed_path,
        embedding=embedding_bytes,
        word_count=len(extracted_text.split()),
        abstract=abstract,
        uploaded_by=current_user.id
    )
    
    db.add(warehouse_project)
    db.commit()
    db.refresh(warehouse_project)
    
    return {
        "success": True,
        "duplicate": False,
        "message": f"Project '{title}' added to warehouse!",
        "project": {
            "id": warehouse_project.id,
            "title": warehouse_project.title,
            "department": warehouse_project.department,
            "year": warehouse_project.year,
            "file_format": warehouse_project.file_format,
            "word_count": warehouse_project.word_count,
            "compressed_size": compressed_size
        }
    }


@app.get("/api/admin/warehouse/projects")
def get_warehouse_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Get all projects in the data warehouse"""
    projects = db.query(WarehouseProject).order_by(WarehouseProject.created_at.desc()).all()
    
    stats = get_warehouse_stats()
    
    return {
        "projects": [
            {
                "id": p.id,
                "title": p.title,
                "department": p.department,
                "year": p.year,
                "file_format": p.file_format,
                "word_count": p.word_count,
                "abstract": p.abstract[:200] if p.abstract else None,
                "created_at": p.created_at.isoformat() if p.created_at else None
            }
            for p in projects
        ],
        "stats": stats
    }


@app.delete("/api/admin/warehouse/{project_id}")
def delete_warehouse_project(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin)
):
    """Delete a project from the data warehouse"""
    project = db.query(WarehouseProject).filter(WarehouseProject.id == project_id).first()
    
    if not project:
        raise HTTPException(status_code=404, detail="Warehouse project not found")
    
    # Delete compressed file
    if project.text_path:
        delete_compressed_text(project.text_path)
    
    # Delete from database
    db.delete(project)
    db.commit()
    
    return {"success": True, "message": f"Project '{project.title}' removed from warehouse"}


# ============ HEALTH CHECK ============

@app.get("/api/health")
def health_check():
    """API health check"""
    return {"status": "healthy", "message": "UNI-VERIFY API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
