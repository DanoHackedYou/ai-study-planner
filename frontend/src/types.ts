export type SubjectInput = {
  name: string;
  difficulty: number;
  importance: number;
  estimated_hours: number;
};

export type PlannerRequest = {
  exam_name: string;
  exam_date: string;
  daily_available_hours: number;
  rest_day?: string | null;
  subjects: SubjectInput[];
};

export type DailyTask = {
  subject: string;
  hours: number;
  focus: string;
};

export type StudyDay = {
  date: string;
  weekday: string;
  total_hours: number;
  tasks: DailyTask[];
};

export type SubjectSummary = {
  name: string;
  assigned_hours: number;
  priority_score: number;
};

export type PlannerResponse = {
  exam_name: string;
  exam_date: string;
  total_days: number;
  total_available_hours: number;
  total_required_hours: number;
  feasibility: string;
  advice: string[];
  subject_summary: SubjectSummary[];
  plan: StudyDay[];
};
