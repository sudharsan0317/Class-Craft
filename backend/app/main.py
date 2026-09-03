from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.routers import generate, auth
from app.core.database import engine
from app import models

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    debug=settings.DEBUG,
)

# Enable CORS for React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount endpoints
app.include_router(generate.router)
app.include_router(auth.router)

@app.get("/")
async def root():
    return {"message": "Class Craft Backend API is running", "docs": "/docs"}

@app.get("/api/classes")
async def get_classes():
    # Placeholder for database retrieval
    return [
        {"id": "os-10", "name": "II AI&DS - B (OS)", "gradeLevel": "UG - 2nd Year", "subject": "Operating Systems", "studentsCount": 25, "level": "Intermediate", "notes": "Understanding process management."},
        {"id": "aia-8", "name": "III AI&DS - A (AIA)", "gradeLevel": "UG - 3rd Year", "subject": "AI & Applications", "studentsCount": 28, "level": "Beginner", "notes": "Introduction to AI."},
        {"id": "rdbms-12", "name": "II CSE - B (RDBMS)", "gradeLevel": "UG - 2nd Year", "subject": "Relational Database Management Systems", "studentsCount": 22, "level": "Advanced", "notes": "Database design and implementation."}
    ]

@app.get("/api/config")
async def get_config():
    return {
        "grades": ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12","Higher Ed / AP"],
        "durations": [30, 45, 60, 90]
    }

@app.get("/api/faqs")
async def get_faqs():
    return [
        {"q": "How does the AI lesson planner work?", "a": "It uses openai/gpt-oss-20b Under Groq API to generate structured educational content based on your inputs."},
        {"q": "Can I edit the generated quiz questions?", "a": "Yes, you can edit, add, or delete questions in the Lesson Plan Editor."},
        {"q": "How do I export my lesson?", "a": "Click the 'Export PDF/Word' button in the class dashboard to download a formatted .doc file."}
    ]
