from collections import defaultdict
from datetime import date, datetime, timedelta
from typing import Dict, List

from app.models import DailyTask, PlannerRequest, PlannerResponse, StudyDay, SubjectSummary

WEEKDAYS = {
    "monday": 0,
    "tuesday": 1,
    "wednesday": 2,
    "thursday": 3,
    "friday": 4,
    "saturday": 5,
    "sunday": 6,
}

FOCUS_BY_PROGRESS = [
    "Understand core concepts and create summary notes",
    "Practice exercises and identify weak points",
    "Review mistakes and reinforce difficult topics",
    "Active recall, mock questions and final consolidation",
]


class StudyPlannerError(Exception):
    pass


class StudyPlanner:
    def generate(self, payload: PlannerRequest) -> PlannerResponse:
        exam_date = self._parse_exam_date(payload.exam_date)
        today = date.today()

        if exam_date <= today:
            raise StudyPlannerError("The exam date must be in the future.")

        study_dates = self._build_study_dates(today, exam_date, payload.rest_day)

        if not study_dates:
            raise StudyPlannerError("There are no available study days before the exam.")

        total_available_hours = round(len(study_dates) * payload.daily_available_hours, 2)
        total_required_hours = round(sum(subject.estimated_hours for subject in payload.subjects), 2)

        subject_weights = self._calculate_subject_weights(payload.subjects)
        assigned_hours = self._distribute_hours(total_available_hours, total_required_hours, subject_weights)
        plan = self._build_plan(study_dates, payload.daily_available_hours, assigned_hours)
        advice = self._build_advice(total_available_hours, total_required_hours, payload.daily_available_hours, len(study_dates))
        feasibility = self._get_feasibility(total_available_hours, total_required_hours)

        return PlannerResponse(
            exam_name=payload.exam_name,
            exam_date=payload.exam_date,
            total_days=len(study_dates),
            total_available_hours=total_available_hours,
            total_required_hours=total_required_hours,
            feasibility=feasibility,
            advice=advice,
            subject_summary=[
                SubjectSummary(
                    name=name,
                    assigned_hours=round(hours, 2),
                    priority_score=round(subject_weights[name], 2),
                )
                for name, hours in sorted(
                    assigned_hours.items(),
                    key=lambda item: subject_weights[item[0]],
                    reverse=True,
                )
            ],
            plan=plan,
        )

    def _parse_exam_date(self, value: str) -> date:
        try:
            return datetime.strptime(value, "%Y-%m-%d").date()
        except ValueError as exc:
            raise StudyPlannerError("Invalid exam date. Use YYYY-MM-DD format.") from exc

    def _build_study_dates(self, start: date, end: date, rest_day: str | None) -> List[date]:
        rest_weekday = WEEKDAYS.get(rest_day.lower()) if rest_day else None
        days: List[date] = []
        current = start

        while current < end:
            if current.weekday() != rest_weekday:
                days.append(current)
            current += timedelta(days=1)

        return days

    def _calculate_subject_weights(self, subjects) -> Dict[str, float]:
        weights: Dict[str, float] = {}

        for subject in subjects:
            weights[subject.name] = (
                subject.estimated_hours * 0.45
                + subject.difficulty * 2.8
                + subject.importance * 3.2
            )

        return weights

    def _distribute_hours(
        self,
        total_available_hours: float,
        total_required_hours: float,
        weights: Dict[str, float],
    ) -> Dict[str, float]:
        hours_to_assign = min(total_available_hours, total_required_hours)
        total_weight = sum(weights.values())

        return {
            subject: round((weight / total_weight) * hours_to_assign, 2)
            for subject, weight in weights.items()
        }

    def _build_plan(
        self,
        study_dates: List[date],
        daily_hours: float,
        assigned_hours: Dict[str, float],
    ) -> List[StudyDay]:
        remaining = dict(assigned_hours)
        subject_order = sorted(remaining, key=remaining.get, reverse=True)
        completed_progress = defaultdict(float)
        plan: List[StudyDay] = []

        for current_date in study_dates:
            day_remaining = daily_hours
            tasks: List[DailyTask] = []
            rotations = 0

            while day_remaining > 0.05 and any(value > 0.05 for value in remaining.values()):
                subject = subject_order[rotations % len(subject_order)]
                rotations += 1

                if remaining[subject] <= 0.05:
                    continue

                block = min(1.5, day_remaining, remaining[subject])
                remaining[subject] = round(remaining[subject] - block, 2)
                completed_progress[subject] += block
                day_remaining = round(day_remaining - block, 2)

                original = assigned_hours[subject] or 1
                progress_ratio = min(completed_progress[subject] / original, 0.99)
                focus_index = int(progress_ratio * len(FOCUS_BY_PROGRESS))

                tasks.append(
                    DailyTask(
                        subject=subject,
                        hours=round(block, 2),
                        focus=FOCUS_BY_PROGRESS[focus_index],
                    )
                )

            if tasks:
                plan.append(
                    StudyDay(
                        date=current_date.isoformat(),
                        weekday=current_date.strftime("%A"),
                        total_hours=round(sum(task.hours for task in tasks), 2),
                        tasks=tasks,
                    )
                )

        return plan

    def _get_feasibility(self, available: float, required: float) -> str:
        ratio = available / required if required else 1

        if ratio >= 1.15:
            return "Comfortable"
        if ratio >= 0.9:
            return "Realistic"
        if ratio >= 0.65:
            return "Tight"
        return "Risky"

    def _build_advice(self, available: float, required: float, daily_hours: float, days: int) -> List[str]:
        advice: List[str] = []

        if available < required:
            missing = round(required - available, 1)
            advice.append(f"Your current schedule is short by approximately {missing} hours.")
            advice.append("Reduce scope, increase daily study time or start earlier if possible.")
        else:
            extra = round(available - required, 1)
            advice.append(f"Your plan has around {extra} extra hours for revision and mock exams.")

        if daily_hours > 5:
            advice.append("Daily study time is high. Split sessions into blocks and include breaks.")

        if days <= 7:
            advice.append("The timeline is short. Prioritize active recall and exam-style practice.")
        else:
            advice.append("Use the first half for understanding and the second half for practice and revision.")

        return advice
