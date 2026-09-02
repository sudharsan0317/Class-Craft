# Class Craft Backend API

FastAPI backend service powering `/api/generate`.

## Setup & Execution

1. **Create & Activate Virtual Environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   ```

2. **Install Dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start Development Server:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

4. **API Documentation:**
   Open Swagger UI at `http://localhost:8000/docs`
