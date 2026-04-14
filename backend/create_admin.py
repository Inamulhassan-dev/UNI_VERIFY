"""
Script to create an admin user for UNI-VERIFY
"""
from database import SessionLocal, User, init_db
from auth import hash_password

def create_admin_user(name: str, email: str, password: str):
    """Create an admin user"""
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(User).filter(User.email == email).first()
        if existing_admin:
            print(f"❌ Admin user with email '{email}' already exists!")
            return False
        
        # Create admin user
        hashed_password = hash_password(password)
        admin_user = User(
            name=name,
            email=email,
            password_hash=hashed_password,
            role="admin"
        )
        
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        
        print(f"✅ Admin user created successfully!")
        print(f"   Name: {name}")
        print(f"   Email: {email}")
        print(f"   Role: admin")
        return True
        
    except Exception as e:
        print(f"❌ Error creating admin user: {e}")
        db.rollback()
        return False
    finally:
        db.close()


if __name__ == "__main__":
    print("\n" + "="*60)
    print("  UNI-VERIFY - Admin User Creation")
    print("="*60 + "\n")
    
    # Initialize database
    init_db()
    
    # Default admin credentials
    name = input("Enter admin name (default: Admin): ").strip() or "Admin"
    email = input("Enter admin email (default: admin@univerify.com): ").strip() or "admin@univerify.com"
    password = input("Enter admin password (default: admin123): ").strip() or "admin123"
    
    print("\nCreating admin user...")
    success = create_admin_user(name, email, password)
    
    if success:
        print("\n✅ You can now login with these credentials:")
        print(f"   Email: {email}")
        print(f"   Password: {password}")
    
    print("\n" + "="*60 + "\n")
