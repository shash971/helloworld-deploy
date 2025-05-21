from sqlalchemy.orm import Session
from config.db import SessionLocal, Base, engine
from models.user_model import User
from utils.auth_utils import get_password_hash
import os

def create_default_admin_user():
    # Create tables if they don't exist
    Base.metadata.create_all(bind=engine)
    
    # Create a session
    db = SessionLocal()
    try:
        # Check if admin user already exists
        existing_user = db.query(User).filter(User.username == "admin").first()
        if existing_user:
            print("Admin user already exists")
            return
        
        # Create a new admin user
        hashed_password = get_password_hash("admin")
        admin_user = User(
            username="admin",
            hashed_password=hashed_password,
            role="admin"
        )
        
        # Add the user to the database
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("Admin user created successfully!")
        
    finally:
        db.close()

if __name__ == "__main__":
    create_default_admin_user()