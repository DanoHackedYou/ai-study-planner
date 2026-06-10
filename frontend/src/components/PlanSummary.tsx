import type { PlannerResponse } from '../types';

type PlanSummaryProps = {
  result: PlannerResponse;
};

export function PlanSummary({ result }: PlanSummaryProps) {
  return (
    <section className="summary-grid">
      <article className="metric-card highlight">
        <span>Feasibility</span>
        <strong>{result.feasibility}</strong>
      </article>
      <article className="metric-card">
        <span>Study days</span>
        <strong>{result.total_days}</strong>
      </article>
      <article className="metric-card">
        <span>Available hours</span>
        <strong>{result.total_available_hours}</strong>
      </article>
      <article className="metric-card">
        <span>Required hours</span>
        <strong>{result.total_required_hours}</strong>
      </article>
    </section>
  );
}
