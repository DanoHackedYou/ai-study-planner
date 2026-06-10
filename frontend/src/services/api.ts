import type { PlannerRequest, PlannerResponse } from '../types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export async function generateStudyPlan(payload: PlannerRequest): Promise<PlannerResponse> {
  const response = await fetch(`${API_URL}/api/plan`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(error?.detail ?? 'Could not generate study plan');
  }

  return response.json();
}
