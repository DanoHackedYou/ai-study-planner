# AI Study Planner

AI Study Planner is a full-stack productivity app that generates personalized study plans based on exam date, available daily hours, subject difficulty, importance and estimated workload.

The project is designed as a professional GitHub portfolio project. It includes a FastAPI backend, a React + TypeScript frontend, Docker support and GitHub Actions CI.

## Screenshot

Add your screenshot here after running the project locally.

```md
![AI Study Planner Screenshot](docs/screenshot.png)
```

## Features

- Generate personalized study plans.
- Prioritize subjects using difficulty, importance and estimated hours.
- Calculate plan feasibility.
- Create a daily study schedule.
- Provide study strategy recommendations.
- Show subject workload breakdown.
- Full-stack architecture ready for deployment.
- Docker support.
- GitHub Actions workflow.

## Technologies

### Backend

- Python 3.12
- FastAPI
- Pydantic
- Uvicorn

### Frontend

- React
- TypeScript
- Vite
- CSS

### DevOps

- Docker
- Docker Compose
- GitHub Actions

## Project Structure

```txt
ai-study-planner/
├── .github/
│   └── workflows/
│       └── ci.yml
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── models.py
│   │   └── services/
│   │       └── planner.py
│   ├── .env.example
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── styles.css
│   │   ├── types.ts
│   │   └── vite-env.d.ts
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── .gitignore
├── docker-compose.yml
└── README.md
```

## Local Installation

### Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

On macOS/Linux:

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The backend runs at:

```txt
http://localhost:8000
```

API documentation:

```txt
http://localhost:8000/docs
```

### Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```txt
http://localhost:5173
```

## Docker

Create the environment file:

```bash
cd backend
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

Run the project:

```bash
docker compose up --build
```

## Environment Variables

No API key is required for the MVP.

The `.env.example` file includes a placeholder for a future optional LLM integration:

```env
OPENAI_API_KEY=your_api_key_here
```

Do not commit real `.env` files.

## Roadmap

- Add authentication.
- Save study plans in SQLite or PostgreSQL.
- Export study plan to PDF.
- Export study plan to calendar format.
- Add AI-generated explanations using an optional LLM.
- Add user profiles and plan history.
- Add dark mode.
- Deploy frontend on Vercel and backend on Render.

## GitHub Topics

Recommended repository topics:

```txt
ai
study-planner
fastapi
react
typescript
vite
productivity
portfolio-project
docker
github-actions
```

## Status

MVP completed. Ready for local execution, GitHub publication and future improvements.

## Author

Created by DanoHackedYou.

## License

This project can be released under the MIT License.
