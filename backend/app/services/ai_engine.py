import os
import json
from typing import Dict, Any, List
from groq import Groq
from app.schemas.schemas import GenerateResponse, QuizGenerateResponse, StudyMaterialResponse

class AIEngine:
    def __init__(self):
        # Dynamically initialize client if key exists
        self.api_key = os.getenv("GROQ_API_KEY")
        if self.api_key:
            self.client = Groq(api_key=self.api_key)
        else:
            self.client = None

    async def generate_content(
        self,
        subject: str,
        grade_level: str = "Grade 10",
        objectives: List[str] = None,
        duration: int = 45,
        source_material: str = None,
        file_name: str = None,
        class_context: dict = None
    ) -> Dict[str, Any]:
        """
        Generates a structured lesson plan using Groq's llama-3.3-70b-versatile.
        """
        if not self.client:
            raise ValueError("CRITICAL: GROQ_API_KEY is missing from backend .env file. Real generation aborted.")

        prompt = f"""
        You are an expert curriculum designer. Generate a highly structured lesson plan.
        Subject: {subject}
        Grade Level: {grade_level}
        Objectives: {', '.join(objectives) if objectives else 'General mastery'}
        Target Duration: {duration} minutes
        """
        
        if source_material:
            prompt += f"\n\nSource Material to base the lesson on:\n{source_material}"
            
        if class_context:
            prompt += f"\n\nClass Context (differentiate instruction for this profile):\n{json.dumps(class_context)}"

        # Provide schema instructions for deterministic JSON output
        schema_json = json.dumps(GenerateResponse.model_json_schema())
        system_prompt = f"You are an expert educational API. Output ONLY valid JSON matching this exact JSON schema:\n{schema_json}"

        response = self.client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_completion_tokens=4096,
        )
        
        return json.loads(response.choices[0].message.content)

    async def generate_quiz(self, topic: str, context: str, num_questions: int = 3) -> Dict[str, Any]:
        """Generates contextual quiz questions for a specific lesson phase."""
        if not self.client:
            raise ValueError("CRITICAL: GROQ_API_KEY is missing from backend .env file. Real generation aborted.")
            
        prompt = f"""
        You are an expert educator. Generate exactly {num_questions} multiple-choice diagnostic questions.
        Topic: {topic}
        Context/Instructions: {context}
        """
        
        schema_json = json.dumps(QuizGenerateResponse.model_json_schema())
        system_prompt = f"You are an expert educational API. Output ONLY valid JSON matching this exact JSON schema:\n{schema_json}"

        response = self.client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_completion_tokens=4096,
        )
        return json.loads(response.choices[0].message.content)

    async def generate_study_materials(self, topic: str, context: str) -> Dict[str, Any]:
        """Generates student-facing study materials."""
        if not self.client:
            raise ValueError("CRITICAL: GROQ_API_KEY is missing from backend .env file. Real generation aborted.")
            
        prompt = f"""
        You are an expert tutor creating study materials for students.
        Topic: {topic}
        Context: {context}
        Create a comprehensive title, a brief summary, key vocabulary terms with definitions, and detailed study notes in markdown format.
        """
        
        schema_json = json.dumps(StudyMaterialResponse.model_json_schema())
        system_prompt = f"You are an expert educational API. Output ONLY valid JSON matching this exact JSON schema:\n{schema_json}"

        response = self.client.chat.completions.create(
            model="openai/gpt-oss-20b",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_completion_tokens=4096,
        )
        return json.loads(response.choices[0].message.content)

ai_engine = AIEngine()
