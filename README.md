# AI Career Assistant

An AI-powered career assistant that analyzes resumes, scores them against ATS systems, matches them to job descriptions, and generates tailored cover letters and interview questions.

## 🚧 Project Status
Actively in development. Currently built: backend foundation, database design, and authentication.

## Tech Stack

**Backend**
- Python, FastAPI
- PostgreSQL + SQLAlchemy (ORM)
- Alembic (database migrations)
- JWT Authentication
- Docker & Docker Compose

**Frontend** *(coming soon)*
- React
- Responsive dashboard with charts

**AI Integration** *(coming soon)*
- Resume analysis & ATS scoring
- Job match scoring
- Cover letter & interview question generation

### Prerequisites
- Python 3.11+
- Docker Desktop

### 1. Clone the repo
```bash
git clone https://github.com/PriyakumariG/ai-career-assistant.git
cd ai-career-assistant
```

### 2. Start the database
```bash
docker compose up -d
```

### 3. Set up the backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

### 4. Configure environment variables
Copy `.env.example` to `.env` and fill in your values.

### 5. Run database migrations
```bash
alembic upgrade head
```

### 6. Start the server
```bash
uvicorn app.main:app --reload
```

API available at `http://127.0.0.1:8000`, docs at `http://127.0.0.1:8000/docs`.

## Project Structure

## Author
**Priya Gupta** — [LinkedIn](https://linkedin.com/in/priyug)