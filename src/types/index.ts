import type { CourseLevel, LetterGrade } from '../data/gradeWeights';

export type { CourseLevel, LetterGrade };

export interface GpaCourse {
  id: string;
  name: string;
  level: CourseLevel | '';
  grade: LetterGrade | '';
  duration: string;
}

export interface ForecastCourseData {
  id: string;
  name: string;
  mp1: string;
  mp2: string;
  mp3: string;
  mp4: string;
}

export type GradeYear = '9' | '10' | '11' | '12';

export interface AppState {
  gpaCalculator: {
    years: Record<GradeYear, GpaCourse[]>;
  };
  finalExamForecast: {
    courses: ForecastCourseData[];
  };
}
