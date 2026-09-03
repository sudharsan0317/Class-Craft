from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict

class TeacherPreferences(BaseModel):
    teaching_depth: Optional[str] = "Standard"
    explanation_style: Optional[str] = "Balanced"
    student_readiness: Optional[str] = "At Grade Level"
    assessment_difficulty: Optional[str] = "Moderate"
    include_misconceptions: Optional[bool] = False

class GenerateRequest(BaseModel):
    subject: str = Field(..., description="Subject area (e.g. Biology, Chemistry)")
    gradeLevel: Optional[str] = Field(default="Grade 10", description="Target grade level")
    objectives: List[str] = Field(default_factory=list, description="Learning objectives")
    duration: Optional[int] = Field(default=45, description="Lesson duration in minutes")
    sourceMaterial: Optional[str] = Field(default=None, description="Optional text source material")
    fileName: Optional[str] = Field(default=None, description="Optional attached document name")
    classContext: Optional[Dict[str, Any]] = Field(default=None, description="Class context profile")
    preferences: Optional[TeacherPreferences] = Field(default=None, description="Teacher specific preferences")

class QuestionSchema(BaseModel):
    id: str
    question: str
    type: str = "multiple-choice"
    options: List[str]
    correctAnswer: int

class LessonPhaseSchema(BaseModel):
    id: str
    title: str
    duration: int
    instructions: str
    questions: List[QuestionSchema] = []

class GenerateResponse(BaseModel):
    title: str
    subject: str
    gradeLevel: str
    duration: int
    objectives: List[str]
    phases: List[LessonPhaseSchema]

# --- Auth Schemas ---

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class UserData(BaseModel):
    name: str
    email: str

class LoginResponse(BaseModel):
    status: str = "success"
    token: str
    user: UserData

class GoogleLoginRequest(BaseModel):
    credential: str

class MicrosoftLoginRequest(BaseModel):
    access_token: str

class QuizGenerateRequest(BaseModel):
    topic: str
    context: str = ""
    num_questions: int = 3

class QuizGenerateResponse(BaseModel):
    questions: List[QuestionSchema]

class VocabItem(BaseModel):
    term: str
    definition: str

class StudyMaterialRequest(BaseModel):
    topic: str
    context: str = ""

class StudyMaterialResponse(BaseModel):
    title: str
    summary: str
    key_vocabulary: List[VocabItem]
    study_notes: str