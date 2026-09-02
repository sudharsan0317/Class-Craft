import os
import requests
import secrets
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from app.models import User
from app.schemas.schemas import UserCreate, LoginRequest, LoginResponse, UserData, GoogleLoginRequest, MicrosoftLoginRequest

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
if not GOOGLE_CLIENT_ID:
    raise ValueError("CRITICAL: GOOGLE_CLIENT_ID environment variable is missing from the backend .env file.")

@router.post("/signup", response_model=LoginResponse, status_code=status.HTTP_201_CREATED)
async def signup(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    new_user = User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    
    return LoginResponse(
        token=access_token,
        user=UserData(name=new_user.username, email=new_user.email)
    )

@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == credentials.email).first()
    if not db_user or not verify_password(credentials.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": db_user.email}, expires_delta=access_token_expires
    )
    
    return LoginResponse(
        token=access_token,
        user=UserData(name=db_user.username, email=db_user.email)
    )

@router.post("/google", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def google_login(payload: GoogleLoginRequest, db: Session = Depends(get_db)):
    try:
        user_info_response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {payload.credential}"}
        )
        
        if user_info_response.status_code != 200:
            raise ValueError(f"Google rejected token: {user_info_response.text}")
            
        idinfo = user_info_response.json()
        email = idinfo.get('email')
        name = idinfo.get('name', 'Google User')
        
        if not email:
            raise ValueError("Google account has no email attached")
        
        db_user = db.query(User).filter(User.email == email).first()
        
        if not db_user:
            hashed_password = get_password_hash(secrets.token_urlsafe(32))
            db_user = User(username=name, email=email, hashed_password=hashed_password)
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.email}, expires_delta=access_token_expires
        )
        
        return LoginResponse(
            token=access_token,
            user=UserData(name=db_user.username, email=db_user.email)
        )
        
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Google Token: {str(e)}")

@router.post("/microsoft", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def microsoft_login(payload: MicrosoftLoginRequest, db: Session = Depends(get_db)):
    try:
        ms_response = requests.get(
            "https://graph.microsoft.com/v1.0/me",
            headers={"Authorization": f"Bearer {payload.access_token}"}
        )
        if ms_response.status_code != 200:
            raise ValueError(f"Microsoft rejected token: {ms_response.text}")
        
        data = ms_response.json()
        email = data.get('mail') or data.get('userPrincipalName')
        name = data.get('displayName', 'Microsoft User')
        
        if not email:
            raise ValueError("No email attached to this Microsoft account")
        
        db_user = db.query(User).filter(User.email == email).first()
        if not db_user:
            hashed_password = get_password_hash(secrets.token_urlsafe(32))
            db_user = User(username=name, email=email, hashed_password=hashed_password)
            db.add(db_user)
            db.commit()
            db.refresh(db_user)
            
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": db_user.email}, 
            expires_delta=access_token_expires
        )
        
        return LoginResponse(
            token=access_token,
            user=UserData(name=db_user.username, email=db_user.email)
        )
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid Microsoft Token: {str(e)}")