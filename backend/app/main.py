from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.models import PlannerRequest, PlannerResponse
from app.services.planner import StudyPlanner, StudyPlannerError

app = FastAPI(
    title="AI Study Planner API",
    description="Generate personalized study plans based on time, difficulty and exam goals.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/plan", response_model=PlannerResponse)
def create_study_plan(payload: PlannerRequest) -> PlannerResponse:
    try:
        return StudyPlanner().generate(payload)
    except StudyPlannerError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
