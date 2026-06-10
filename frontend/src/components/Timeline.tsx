import type { StudyDay } from '../types';

type TimelineProps = {
  days: StudyDay[];
};

export function Timeline({ days }: TimelineProps) {
  return (
    <section className="card timeline-card">
      <span className="eyebrow">Generated plan</span>
      <h2>Daily schedule</h2>

      <div className="timeline">
        {days.map((day) => (
          <article className="day-card" key={day.date}>
            <div className="day-header">
              <div>
                <strong>{day.weekday}</strong>
                <span>{day.date}</span>
              </div>
              <span>{day.total_hours}h</span>
            </div>

            <div className="task-list">
              {day.tasks.map((task, index) => (
                <div className="task" key={`${day.date}-${task.subject}-${index}`}>
                  <div>
                    <strong>{task.subject}</strong>
                    <p>{task.focus}</p>
                  </div>
                  <span>{task.hours}h</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
