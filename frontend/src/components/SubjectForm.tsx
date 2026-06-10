import type { SubjectInput } from '../types';

type SubjectFormProps = {
  subjects: SubjectInput[];
  setSubjects: (subjects: SubjectInput[]) => void;
};

const emptySubject: SubjectInput = {
  name: '',
  difficulty: 3,
  importance: 3,
  estimated_hours: 6,
};

export function SubjectForm({ subjects, setSubjects }: SubjectFormProps) {
  function updateSubject(index: number, field: keyof SubjectInput, value: string) {
    const next = [...subjects];
    next[index] = {
      ...next[index],
      [field]: field === 'name' ? value : Number(value),
    };
    setSubjects(next);
  }

  function addSubject() {
    setSubjects([...subjects, { ...emptySubject }]);
  }

  function removeSubject(index: number) {
    if (subjects.length === 1) return;
    setSubjects(subjects.filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <section className="card">
      <div className="card-header">
        <div>
          <span className="eyebrow">Step 2</span>
          <h2>Subjects</h2>
        </div>
        <button type="button" className="secondary-button" onClick={addSubject}>
          Add subject
        </button>
      </div>

      <div className="subject-list">
        {subjects.map((subject, index) => (
          <div className="subject-row" key={index}>
            <label>
              Subject
              <input
                value={subject.name}
                onChange={(event) => updateSubject(index, 'name', event.target.value)}
                placeholder="Computer Architecture"
                required
              />
            </label>

            <label>
              Difficulty
              <select
                value={subject.difficulty}
                onChange={(event) => updateSubject(index, 'difficulty', event.target.value)}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>

            <label>
              Importance
              <select
                value={subject.importance}
                onChange={(event) => updateSubject(index, 'importance', event.target.value)}
              >
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>{value}</option>
                ))}
              </select>
            </label>

            <label>
              Hours
              <input
                type="number"
                min="1"
                step="0.5"
                value={subject.estimated_hours}
                onChange={(event) => updateSubject(index, 'estimated_hours', event.target.value)}
                required
              />
            </label>

            <button type="button" className="danger-button" onClick={() => removeSubject(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
