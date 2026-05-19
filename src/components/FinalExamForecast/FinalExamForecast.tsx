import { useLocalStorage } from '../../hooks/useLocalStorage';
import ForecastCourse from './ForecastCourse';
import type { AppState, ForecastCourseData } from '../../types';

const defaultState: AppState = {
  gpaCalculator: {
    years: { '9': [], '10': [], '11': [], '12': [] },
  },
  finalExamForecast: {
    courses: [],
  },
};

export default function FinalExamForecast() {
  const [state, setState] = useLocalStorage<AppState>('phs-student-tools', defaultState);
  const courses = state.finalExamForecast.courses;

  const setCourses = (updated: ForecastCourseData[]) => {
    setState({ ...state, finalExamForecast: { courses: updated } });
  };

  const addCourse = () => {
    const newCourse: ForecastCourseData = {
      id: crypto.randomUUID(),
      name: '',
      mp1: '',
      mp2: '',
      mp3: '',
      mp4: '',
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (id: string, updated: ForecastCourseData) => {
    setCourses(courses.map(c => (c.id === id ? updated : c)));
  };

  const deleteCourse = (id: string) => {
    setCourses(courses.filter(c => c.id !== id));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-primary dark:text-[#E8E8F0]">
            Final Exam Forecast
          </h1>
          <p className="text-muted dark:text-[#9CA3AF] text-sm mt-1">
            See what exam score you need for each possible final grade.
          </p>
        </div>
        <button
          onClick={addCourse}
          className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-medium px-5 py-2.5 rounded-lg transition-colors duration-150 text-sm min-h-[44px]"
        >
          <span className="text-lg leading-none">+</span>
          Add Course
        </button>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {courses.length === 0 ? (
          <div className="bg-panel dark:bg-[#1A1D27] border border-border-default dark:border-[#2D3048] rounded-2xl p-10 text-center">
            <div className="text-4xl mb-3">📝</div>
            <p className="font-heading font-semibold text-primary dark:text-[#E8E8F0] mb-1">
              No courses yet
            </p>
            <p className="text-muted dark:text-[#9CA3AF] text-sm">
              Add a course above to start planning for finals.
            </p>
          </div>
        ) : (
          courses.map(course => (
            <ForecastCourse
              key={course.id}
              course={course}
              onChange={updated => updateCourse(course.id, updated)}
              onDelete={() => deleteCourse(course.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
