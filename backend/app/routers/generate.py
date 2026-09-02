from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form
from typing import Optional
import json
import io
from pypdf import PdfReader
from app.schemas.schemas import GenerateResponse
from app.services.ai_engine import ai_engine

router = APIRouter(prefix="/api", tags=["Generation"])

@router.post("/generate", response_model=GenerateResponse, status_code=status.HTTP_200_OK)
async def generate_endpoint(
    subject: str = Form(...),
    gradeLevel: str = Form("Grade 10"),
    objectives: str = Form("[]"),  # Passed as JSON string from frontend FormData
    duration: int = Form(45),
    sourceMaterial: Optional[str] = Form(""),
    classContext: Optional[str] = Form(None), # Passed as JSON string
    file: Optional[UploadFile] = File(None)
):
    try:
        # 1. Parse JSON strings back into Python objects
        parsed_objectives = json.loads(objectives)
        parsed_class_context = json.loads(classContext) if classContext else None
        
        # 2. Extract file text if uploaded
        file_name = None
        extracted_text = ""
        
        if file and file.filename:
            file_name = file.filename
            file_bytes = await file.read()
            
            # Simple PDF and TXT parsing
            if file_name.lower().endswith('.pdf'):
                reader = PdfReader(io.BytesIO(file_bytes))
                extracted_text = "\n".join([page.extract_text() for page in reader.pages if page.extract_text()])
            elif file_name.lower().endswith('.txt'):
                extracted_text = file_bytes.decode("utf-8")
                
            # Combine the extracted file text with any text they typed in the box
            if extracted_text:
                sourceMaterial = f"{sourceMaterial}\n\n[Extracted from uploaded {file_name}]:\n{extracted_text}".strip()

        # 3. Pass everything into the AI Engine
        result = await ai_engine.generate_content(
            subject=subject,
            grade_level=gradeLevel,
            objectives=parsed_objectives,
            duration=duration,
            source_material=sourceMaterial,
            file_name=file_name,
            class_context=parsed_class_context
        )
        return result
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lesson generation failed: {str(e)}"
        )

from app.schemas.schemas import QuizGenerateRequest, QuizGenerateResponse

@router.post("/generate/quiz", response_model=QuizGenerateResponse, status_code=status.HTTP_200_OK)
async def generate_quiz_endpoint(payload: QuizGenerateRequest):
    try:
        result = await ai_engine.generate_quiz(
            topic=payload.topic,
            context=payload.context,
            num_questions=payload.num_questions
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quiz generation failed: {str(e)}")

from app.schemas.schemas import StudyMaterialRequest, StudyMaterialResponse

@router.post("/generate/study-materials", response_model=StudyMaterialResponse, status_code=status.HTTP_200_OK)
async def generate_study_materials_endpoint(payload: StudyMaterialRequest):
    try:
        result = await ai_engine.generate_study_materials(
            topic=payload.topic,
            context=payload.context
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Study materials generation failed: {str(e)}")
