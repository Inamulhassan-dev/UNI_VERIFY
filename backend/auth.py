from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db, User
import bcrypt

# ============ CONFIGURATION ============

SECRET_KEY = "uni-verify-secret-key-change-in-production-2024"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# HTTP Bearer token scheme
security = HTTPBearer()


# ============ PASSWORD UTILITIES ============

def hash_password(password: str) -> str:
    """Hash a plain password using bcrypt"""
    # Encode password to bytes and hash it
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    try:
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception:
        return False


# ============ JWT TOKEN UTILITIES ============

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """Decode and validate a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"DEBUG decode_token: Successfully decoded token")
        return payload
    except JWTError as e:
        print(f"DEBUG decode_token: JWTError - {type(e).__name__}: {e}")
        return None
    except Exception as e:
        print(f"DEBUG decode_token: Unexpected error - {type(e).__name__}: {e}")
        return None


# ============ AUTHENTICATION DEPENDENCIES ============

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """Get the current authenticated user from JWT token"""
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token = credentials.credentials
    print(f"DEBUG: Received token: {token[:20]}..." if token else "DEBUG: No token received")
    
    payload = decode_token(token)
    print(f"DEBUG: Decoded payload: {payload}")
    
    if payload is None:
        print("DEBUG: Payload is None - token decode failed")
        raise credentials_exception
    
    # Get user_id and ensure it's an integer
    user_id_raw = payload.get("sub")
    print(f"DEBUG: User ID raw: {user_id_raw}")
    
    if user_id_raw is None:
        print("DEBUG: User ID is None")
        raise credentials_exception
    
    try:
        user_id = int(user_id_raw)
    except (ValueError, TypeError):
        print(f"DEBUG: Could not convert user_id to int: {user_id_raw}")
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    print(f"DEBUG: Found user: {user.name if user else 'None'}")
    
    if user is None:
        print(f"DEBUG: No user found with ID {user_id}")
        raise credentials_exception
    
    return user


async def get_current_admin(current_user: User = Depends(get_current_user)) -> User:
    """Ensure the current user is an admin"""
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )
    return current_user


# ============ USER AUTHENTICATION FUNCTIONS ============

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password"""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        return None
    
    if not verify_password(password, user.password_hash):
        return None
    
    return user


def create_user(
    db: Session,
    name: str,
    email: str,
    password: str,
    role: str = "student",
    roll_number: str = None,
    department: str = None,
    year: int = None,
    semester: int = None
) -> User:
    """Create a new user"""
    
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = hash_password(password)
    new_user = User(
        name=name,
        email=email,
        password_hash=hashed_password,
        role=role,
        roll_number=roll_number,
        department=department,
        year=year,
        semester=semester
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user
