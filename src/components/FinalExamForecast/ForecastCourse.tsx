import { useState } from 'react';
import { calculateForecast } from '../../utils/forecast';
import ForecastTable from './ForecastTable';
import type { ForecastCourseData } from '../../types';

interface Props {
  course: ForecastCourseData;
  onChange: (updated: ForecastCourseData) => void;
  onDelete: () => void;
}

const MP_FIELDS: Array<{ key: keyof ForecastCourseData; label: string }> = [
  { key: 'mp1', label: 'MP1' },
  { key: 'mp2', label: 'MP2' },
  { key: 'mp3', label: 'MP3' },
  { key: 'mp4', label: 'MP4' },
];

function isValidMp(val: string): boolean {
  if (val === '') return false;
  const n = Number(val);
  return Number.isInteger(n) && n >= 0 && n <= 100;
}

function mpError(val: string): string | null {
  if (val === '') return null;
  const n = Number(val);
  if (!Number.isInteger(n)) return 'Must be a whole number';
  if (n < 0 || n > 100) return 'Must be 0–100';
  return null;
}

export default function ForecastCourse({ course, onChange, onDelete }: Props) {
  const [open, setOpen] = useState(true);

  const update = (field: keyof ForecastCourseData, value: string) =>
    onChange({ ...course, [field]: value });

  const allValid = MP_FIELDS.every(({ key }) => isValidMp(course[key]));

  const forecastData = allValid
    ? calculateForecast(
        Number(course.mp1),
        Number(course.mp2),
        Number(course.mp3),
        Number(course.mp4),
      )
    : null;

  const mpSummary = MP_FIELDS.every(({ key }) => course[key] !== '')
    ? MP_FIELDS.map(({ key }) => course[key]).join(' · ')
    : null;

  return (
    <div className="bg-panel dark:bg-[#1A1D27] border border-border-default dark:border-[#2D3048] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-transparent data-[open]:border-border-default dark:data-[open]:border-[#2D3048]"
        data-open={open ? '' : undefined}
        style={{ borderBottomColor: open ? undefined : 'transparent' }}
      >
        <input
          type="text"
          value={course.name}
          onChange={e => update('name', e.target.value)}
          placeholder="Course name (optional)"
          className="flex-1 min-h-[44px] px-3 py-2 rounded-lg border border-border-default dark:border-[#2D3048] bg-bg-input dark:bg-[#22253A] text-primary dark:text-[#E8E8F0] text-sm placeholder-muted focus:outline-none focus:ring-2 focus:ring-accent/50"
        />

        {!open && mpSummary && (
          <span className="hidden sm:block text-muted dark:text-[#9CA3AF] text-sm tabular-nums whitespace-nowrap">
            {mpSummary}
          </span>
        )}

        <button
          onClick={() => setOpen(o => !o)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted hover:text-primary dark:hover:text-[#E8E8F0] hover:bg-accent/10 dark:hover:bg-accent/20 transition-colors duration-150 flex-shrink-0"
          aria-label={open ? 'Collapse course' : 'Expand course'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <button
          onClick={onDelete}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-muted hover:text-danger dark:hover:text-[#F87171] hover:bg-danger/10 transition-colors duration-150 flex-shrink-0"
          aria-label="Delete course"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className={`transition-all duration-200 ease-in-out overflow-hidden ${
        open ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="px-4 pb-4 pt-4 border-t border-border-default dark:border-[#2D3048]">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {MP_FIELDS.map(({ key, label }) => {
              const err = mpError(course[key]);
              return (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-muted dark:text-[#9CA3AF] uppercase tracking-wide">
                    {label}
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={course[key]}
                    onChange={e => update(key, e.target.value)}
                    placeholder="0–100"
                    className={`min-h-[44px] px-3 py-2 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 bg-bg-input dark:bg-[#22253A] text-primary dark:text-[#E8E8F0] placeholder-muted w-full ${
                      err
                        ? 'border-danger dark:border-[#F87171]'
                        : 'border-border-default dark:border-[#2D3048]'
                    }`}
                  />
                  {err && (
                    <p className="text-xs text-danger dark:text-[#F87171]">{err}</p>
                  )}
                </div>
              );
            })}
          </div>

          {forecastData ? (
            <ForecastTable forecastData={forecastData} />
          ) : (
            <div className="rounded-xl border border-border-default dark:border-[#2D3048] bg-surface dark:bg-[#0F1117] px-5 py-8 text-center">
              <p className="text-muted dark:text-[#9CA3AF] text-sm">
                Enter all four marking period grades to see your forecast.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
