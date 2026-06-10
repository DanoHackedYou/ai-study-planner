import { useMemo, useState } from 'react';
import { generateStudyPlan } from './services/api';
import type { PlannerResponse, SubjectInput } from './types';
import { PlanSummary } from './components/PlanSummary';
import { SubjectBreakdown } from './components/SubjectBreakdown';
import { SubjectForm } from './components/SubjectForm';
import { Timeline } from './components/Timeline';
import './styles.css';

const initialSubjects: SubjectInput[] = [
  { name: 'Computer Architecture', difficulty: 4, importance: 5, estimated_hours: 10 },
  { name: 'Operating Systems', difficulty: 5, importance: 5, estimated_hours: 12 },
  { name: 'Databases', difficulty: 3, importance: 4, estimated_hours: 8 },
];

function App() {
  const [examName, setExamName] = useState('Final Engineering Exam');
  const [examDate, setExamDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 14);
    return date.toISOString().slice(0, 10);
  });
  const [dailyHours, setDailyHours] = useState(3);
  const [restDay, setRestDay] = useState('Sunday');
  const [subjects, setSubjects] = useState<SubjectInput[]>(initialSubjects);
  const [result, setResult] = useState<PlannerResponse | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const totalEstimatedHours = useMemo(
    () => subjects.reduce((sum, subject) => sum + Number(subject.estimated_hours || 0), 0),
    [subjects],
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await generateStudyPlan({
        exam_name: examName,
        exam_date: examDate,
        daily_available_hours: dailyHours,
        rest_day: restDay || null,
        subjects,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">
      <section className="hero">
        <div className="badge">AI productivity project</div>
        <h1>AI Study Planner</h1>
        <p>
          Generate a personalized study plan based on your exam date, available time,
          subject difficulty and priority.
        </p>
      </section>

      <form className="planner-layout" onSubmit={handleSubmit}>
        <section className="card">
          <span className="eyebrow">Step 1</span>
          <h2>Exam setup</h2>

          <div className="form-grid">
            <label>
              Exam name
              <input value={examName} onChange={(event) => setExamName(event.target.value)} required />
            </label>

            <label>
              Exam date
              <input type="date" value={examDate} onChange={(event) => setExamDate(event.target.value)} required />
            </label>

            <label>
              Daily available hours
              <input
                type="number"
                min="0.5"
                max="12"
                step="0.5"
                value={dailyHours}
                onChange={(event) => setDailyHours(Number(event.target.value))}
                required
              />
            </label>

            <label>
              Rest day
              <select value={restDay} onChange={(event) => setRestDay(event.target.value)}>
                <option value="">No rest day</option>
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </label>
          </div>

          <div className="inline-note">
            Current estimated workload: <strong>{totalEstimatedHours} hours</strong>
          </div>
        </section>

        <SubjectForm subjects={subjects} setSubjects={setSubjects} />

        <div className="actions">
          <button type="submit" disabled={loading}>
            {loading ? 'Generating plan...' : 'Generate study plan'}
          </button>
          {error && <p className="error">{error}</p>}
        </div>
      </form>

      {result && (
        <section className="results">
          <PlanSummary result={result} />

          <div className="result-grid">
            <section className="card">
              <span className="eyebrow">Recommendations</span>
              <h2>Study strategy</h2>
              <ul className="advice-list">
                {result.advice.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <SubjectBreakdown subjects={result.subject_summary} />
          </div>

          <Timeline days={result.plan} />
        </section>
      )}
    </main>
  );
}

export default App;
