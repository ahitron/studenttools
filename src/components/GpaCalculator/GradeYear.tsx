import { useState } from 'react';
import CourseRow from './CourseRow';
import type { GpaCourse, GradeYear as GradeYearType } from '../../types';

interface Props {
  year: GradeYearType;
  courses: GpaCourse[];
  gpa: number | null;
  onChange: (courses: GpaCourse[]) => void;
  onAddCourse: () => void;
  onDeleteCourse: (id: string) => void;
}

const YEAR_LABEL: Record<GradeYearType, string> = {
  '9': 'Grade 9',
  '10': 'Grade 10',
  '11': 'Grade 11',
  '12': 'Grade 12',
};

export default function GradeYear({ year, courses, gpa, onChange, onAddCourse, onDeleteCourse }: Props) {
  const [open, setOpen] = useState(courses.length > 0);

  const updateCourse = (id: string, updated: GpaCourse) => {
    onChange(courses.map(c => (c.id === id ? updated : c)));
  };

  const gpaDisplay = gpa !== null ? gpa.toFixed(2) : '—';

  return (
    <div className="bg-panel dark:bg-[#1A1D27] border border-border-default dark:border-[#2D3048] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-accent/5 dark:hover:bg-accent/10 transition-colors duration-150"
      >
        <span className="font-heading font-semibold text-primary dark:text-[#E8E8F0]">
          {YEAR_LABEL[year]}
        </span>
        <div className="flex items-center gap-3">
          <span className="text-accent dark:text-[#6366F1] font-heading font-bold text-lg tabular-nums">
            {gpaDisplay}
          </span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16" height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </button>

      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden ${
          open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-5 flex flex-col gap-2 border-t border-border-default dark:border-[#2D3048] pt-4">
          {courses.length === 0 && (
            <p className="text-muted dark:text-[#9CA3AF] text-sm py-2">No courses added yet.</p>
          )}
          {courses.map(course => (
            <CourseRow
              key={course.id}
              course={course}
              onChange={updated => updateCourse(course.id, updated)}
              onDelete={() => onDeleteCourse(course.id)}
            />
          ))}
          <button
            onClick={onAddCourse}
            className="mt-2 self-start flex items-center gap-2 text-accent dark:text-[#6366F1] hover:text-accent/80 font-medium text-sm transition-colors duration-150 min-h-[44px] px-1"
          >
            <span className="text-lg leading-none">+</span>
            Add Course
          </button>
        </div>
      </div>
    </div>
  );
}
