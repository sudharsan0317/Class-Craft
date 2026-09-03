from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form
from typing import Optional
import json
import io
from pypdf import PdfReader
from app.schemas.schemas import GenerateResponse, TeacherPreferences
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
    preferences: Optional[str] = Form(None), # Passed as JSON string
    file: Optional[UploadFile] = File(None)
):
    try:
        # 1. Parse JSON strings back into Python objects
        parsed_objectives = json.loads(objectives)
        parsed_class_context = json.loads(classContext) if classContext else None
        
        prefs_dict = json.loads(preferences) if preferences else {}
        teacher_prefs = TeacherPreferences(**prefs_dict)
        
        # 2. Extract file text if uploaded
        file_name = None
        extracted_text = ""
        
        if file and file.filename:
            file_name = file.filename
            if file.filename.endswith(".pdf"):
                pdf_reader = PdfReader(io.BytesIO(await file.read()))
                for page in pdf_reader.pages:
                    extracted_text += page.extract_text() + "\n"
            else:
                extracted_text = (await file.read()).decode("utf-8")
                
        # 3. Combine text
        final_source_material = sourceMaterial
        if extracted_text:
            final_source_material += f"\n\n[Content from attached file {file_name}]:\n{extracted_text}"

        # 4. Trigger AI Generation
        result = await ai_engine.generate_content(
            subject=subject,
            grade_level=gradeLevel,
            objectives=parsed_objectives,
            duration=duration,
            source_material=final_source_material,
            file_name=file_name,
            class_context=parsed_class_context,
            preferences=teacher_prefs.model_dump()
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
