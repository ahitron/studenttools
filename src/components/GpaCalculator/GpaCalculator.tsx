import { useLocalStorage } from '../../hooks/useLocalStorage';
import { calculateGpa } from '../../utils/gpa';
import GradeYear from './GradeYear';
import type { AppState, GpaCourse, GradeYear as GradeYearType } from '../../types';

const GRADE_YEARS: GradeYearType[] = ['9', '10', '11', '12'];

const defaultState: AppState = {
  gpaCalculator: {
    years: { '9': [], '10': [], '11': [], '12': [] },
  },
  finalExamForecast: {
    courses: [],
  },
};

export default function GpaCalculator() {
  const [state, setState] = useLocalStorage<AppState>('phs-student-tools', defaultState);

  const allCourses = GRADE_YEARS.flatMap(y => state.gpaCalculator.years[y]);
  const cumulativeGpa = calculateGpa(allCourses);

  const updateYear = (year: GradeYearType, courses: GpaCourse[]) => {
    setState({
      ...state,
      gpaCalculator: {
        years: { ...state.gpaCalculator.years, [year]: courses },
      },
    });
  };

  const addCourse = (year: GradeYearType) => {
    const newCourse: GpaCourse = {
      id: crypto.randomUUID(),
      name: '',
      level: '',
      grade: '',
      duration: '',
    };
    updateYear(year, [...state.gpaCalculator.years[year], newCourse]);
  };

  const deleteCourse = (year: GradeYearType, id: string) => {
    updateYear(year, state.gpaCalculator.years[year].filter(c => c.id !== id));
  };

  const gpaDisplay = cumulativeGpa !== null ? cumulativeGpa.toFixed(2) : '—';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-heading text-3xl font-bold text-primary dark:text-[#E8E8F0] mb-2">
        GPA Calculator
      </h1>
      <p className="text-muted dark:text-[#9CA3AF] text-sm mb-8">
        Add your courses below. GPA updates automatically.
      </p>

      <div className="bg-panel dark:bg-[#1A1D27] border border-border-default dark:border-[#2D3048] rounded-2xl p-6 mb-8 flex items-center justify-between">
        <div>
          <p className="text-muted dark:text-[#9CA3AF] text-sm font-medium uppercase tracking-wide">
            Cumulative GPA
          </p>
          <p className="font-heading text-5xl font-bold text-accent dark:text-[#6366F1] tabular-nums mt-1">
            {gpaDisplay}
          </p>
        </div>
        <div className="text-6xl opacity-20">🎓</div>
      </div>

      <div className="flex flex-col gap-3">
        {GRADE_YEARS.map(year => (
          <GradeYear
            key={year}
            year={year}
            courses={state.gpaCalculator.years[year]}
            gpa={calculateGpa(state.gpaCalculator.years[year])}
            onChange={courses => updateYear(year, courses)}
            onAddCourse={() => addCourse(year)}
            onDeleteCourse={id => deleteCourse(year, id)}
          />
        ))}
      </div>
    </div>
  );
}
