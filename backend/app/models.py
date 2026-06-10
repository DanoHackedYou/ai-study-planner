from pydantic import BaseModel, Field
from typing import List, Optional


class SubjectInput(BaseModel):
    name: str = Field(..., min_length=2, examples=["Operating Systems"])
    difficulty: int = Field(..., ge=1, le=5, description="1 means easy, 5 means very hard")
    importance: int = Field(..., ge=1, le=5, description="1 means low priority, 5 means critical")
    estimated_hours: float = Field(..., gt=0, le=200)


class PlannerRequest(BaseModel):
    exam_name: str = Field(..., min_length=2, examples=["Computer Architecture Final Exam"])
    exam_date: str = Field(..., examples=["2026-07-15"])
    daily_available_hours: float = Field(..., gt=0, le=12)
    rest_day: Optional[str] = Field(default=None, examples=["Sunday"])
    subjects: List[SubjectInput] = Field(..., min_length=1)


class DailyTask(BaseModel):
    subject: str
    hours: float
    focus: str


class StudyDay(BaseModel):
    date: str
    weekday: str
    total_hours: float
    tasks: List[DailyTask]


class SubjectSummary(BaseModel):
    name: str
    assigned_hours: float
    priority_score: float


class PlannerResponse(BaseModel):
    exam_name: str
    exam_date: str
    total_days: int
    total_available_hours: float
    total_required_hours: float
    feasibility: str
    advice: List[str]
    subject_summary: List[SubjectSummary]
    plan: List[StudyDay]
