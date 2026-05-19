import { GRADE_WEIGHTS } from '../data/gradeWeights';
import { COURSE_DURATIONS } from '../data/courseDurations';
import type { GpaCourse } from '../types';

export function calculateGpa(courses: GpaCourse[]): number | null {
  let totalPoints = 0;
  let totalCredits = 0;

  for (const course of courses) {
    if (!course.level || !course.grade || !course.duration) continue;

    const duration = COURSE_DURATIONS.find(d => d.label === course.duration);
    if (!duration) continue;

    const points = GRADE_WEIGHTS[course.level][course.grade];
    totalPoints += points * duration.credits;
    totalCredits += duration.credits;
  }

  if (totalCredits === 0) return null;
  return totalPoints / totalCredits;
}
