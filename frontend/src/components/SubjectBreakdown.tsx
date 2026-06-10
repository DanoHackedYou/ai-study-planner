import type { SubjectSummary } from '../types';

type SubjectBreakdownProps = {
  subjects: SubjectSummary[];
};

export function SubjectBreakdown({ subjects }: SubjectBreakdownProps) {
  const maxHours = Math.max(...subjects.map((subject) => subject.assigned_hours), 1);

  return (
    <section className="card">
      <span className="eyebrow">Priorities</span>
      <h2>Subject breakdown</h2>

      <div className="breakdown-list">
        {subjects.map((subject) => {
          const width = Math.round((subject.assigned_hours / maxHours) * 100);

          return (
            <div className="breakdown-item" key={subject.name}>
              <div className="breakdown-row">
                <span>{subject.name}</span>
                <strong>{subject.assigned_hours}h</strong>
              </div>
              <div className="bar">
                <div style={{ width: `${width}%` }} />
              </div>
              <small>Priority score: {subject.priority_score}</small>
            </div>
          );
        })}
      </div>
    </section>
  );
}
