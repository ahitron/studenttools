import { LEVELS, LETTER_GRADES } from '../../data/gradeWeights';
import { COURSE_DURATIONS } from '../../data/courseDurations';
import type { GpaCourse } from '../../types';

interface Props {
  course: GpaCourse;
  onChange: (updated: GpaCourse) => void;
  onDelete: () => void;
}

const baseSelect = 'min-h-[44px] px-3 py-2 rounded-lg border bg-bg-input dark:bg-[#22253A] text-primary dark:text-[#E8E8F0] text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 w-full';
const baseInput  = 'min-h-[44px] px-3 py-2 rounded-lg border bg-bg-input dark:bg-[#22253A] text-primary dark:text-[#E8E8F0] text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50 w-full';
const normalBorder = 'border-border-default dark:border-[#2D3048]';
const warnBorder   = 'border-amber-400 dark:border-amber-500';

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      className="text-emerald-500 dark:text-emerald-400">
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className="text-amber-500 dark:text-amber-400">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function CourseRow({ course, onChange, onDelete }: Props) {
  const update = (field: keyof GpaCourse, value: string) =>
    onChange({ ...course, [field]: value });

  const anyFilled = course.level || course.grade || course.duration;
  const complete = course.level && course.grade && course.duration;
  const incomplete = anyFilled && !complete;

  return (
    <div className={`grid grid-cols-[auto_1fr_auto_auto_auto_auto] sm:grid-cols-[auto_2fr_1fr_1fr_1.5fr_auto] gap-2 items-center rounded-lg transition-colors duration-150 ${
      incomplete ? 'bg-amber-50/60 dark:bg-amber-900/10 px-1.5 -mx-1.5' : ''
    }`}>
      <div className="flex items-center justify-center w-6">
        {complete && <CheckIcon />}
        {incomplete && (
          <span title="Missing fields — this course is excluded from GPA">
            <WarnIcon />
          </span>
        )}
      </div>

      <input
        type="text"
        value={course.name}
        onChange={e => update('name', e.target.value)}
        placeholder="Course name (optional)"
        className={`${baseInput} ${normalBorder}`}
      />

      <select
        value={course.level}
        onChange={e => update('level', e.target.value)}
        className={`${baseSelect} ${incomplete && !course.level ? warnBorder : normalBorder}`}
        aria-label="Course level"
      >
        <option value="">Level</option>
        {LEVELS.map(l => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      <select
        value={course.grade}
        onChange={e => update('grade', e.target.value)}
        className={`${baseSelect} ${incomplete && !course.grade ? warnBorder : normalBorder}`}
        aria-label="Grade"
      >
        <option value="">Grade</option>
        {LETTER_GRADES.map(g => (
          <option key={g} value={g}>{g}</option>
        ))}
      </select>

      <select
        value={course.duration}
        onChange={e => update('duration', e.target.value)}
        className={`${baseSelect} ${incomplete && !course.duration ? warnBorder : normalBorder}`}
        aria-label="Duration"
      >
        <option value="">Duration</option>
        {COURSE_DURATIONS.map(d => (
          <option key={d.label} value={d.label}>{d.label}</option>
        ))}
      </select>

      <button
        onClick={onDelete}
        className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted hover:text-danger dark:hover:text-[#F87171] hover:bg-danger/10 transition-colors duration-150"
        aria-label="Delete course"
      >
        ✕
      </button>
    </div>
  );
}
