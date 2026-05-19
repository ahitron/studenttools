import { describe, it, expect } from 'vitest';
import { calculateGpa } from './gpa';
import type { GpaCourse } from '../types';

function makeCourse(overrides: Partial<GpaCourse> = {}): GpaCourse {
  return {
    id: crypto.randomUUID(),
    name: '',
    level: 'CP',
    grade: 'A',
    duration: 'Full Year',
    ...overrides,
  };
}

describe('calculateGpa', () => {
  it('single course: full-year CP A → 4.00', () => {
    const result = calculateGpa([makeCourse({ level: 'CP', grade: 'A', duration: 'Full Year' })]);
    expect(result).toBeCloseTo(4.00);
  });

  it('credit weighting: full-year CP A + semester H A+', () => {
    const courses = [
      makeCourse({ level: 'CP', grade: 'A', duration: 'Full Year' }),   // 4.00 × 5.0 = 20.00
      makeCourse({ level: 'H', grade: 'A+', duration: 'Semester' }),    // 5.08 × 2.5 = 12.70
    ];
    // (20.00 + 12.70) / 7.5 = 4.36
    expect(calculateGpa(courses)).toBeCloseTo(4.36, 2);
  });

  it('multi-level mixing: CP, H, and AP in same calculation', () => {
    const courses = [
      makeCourse({ level: 'CP', grade: 'B', duration: 'Full Year' }),   // 3.00 × 5.0 = 15.00
      makeCourse({ level: 'H', grade: 'A', duration: 'Semester' }),     // 4.75 × 2.5 = 11.875
      makeCourse({ level: 'AP', grade: 'A+', duration: 'Full Year' }),  // 5.83 × 5.0 = 29.15
    ];
    const expected = (15.00 + 11.875 + 29.15) / (5.0 + 2.5 + 5.0);
    expect(calculateGpa(courses)).toBeCloseTo(expected, 4);
  });

  it('all letter grades resolve to correct GPA points', () => {
    const gradeMap: Array<[GpaCourse['grade'], number]> = [
      ['A+', 4.33], ['A', 4.00], ['A-', 3.66],
      ['B+', 3.33], ['B', 3.00], ['B-', 2.66],
      ['C+', 2.33], ['C', 2.00], ['C-', 1.66],
      ['D+', 1.33], ['D', 1.00], ['F', 0.00],
    ];
    for (const [grade, expected] of gradeMap) {
      const result = calculateGpa([makeCourse({ level: 'CP', grade, duration: 'Full Year' })]);
      expect(result, `grade ${grade}`).toBeCloseTo(expected, 2);
    }
  });

  it('F grade contributes 0 points but still counts credits', () => {
    const courses = [
      makeCourse({ level: 'CP', grade: 'F', duration: 'Full Year' }),  // 0 × 5 = 0
      makeCourse({ level: 'CP', grade: 'A', duration: 'Full Year' }),  // 4.00 × 5 = 20
    ];
    // (0 + 20) / 10 = 2.00
    expect(calculateGpa(courses)).toBeCloseTo(2.00, 4);
  });

  it('incomplete courses (missing level) are excluded', () => {
    const courses = [
      makeCourse({ level: '', grade: 'A', duration: 'Full Year' }),
      makeCourse({ level: 'CP', grade: 'B', duration: 'Full Year' }),
    ];
    expect(calculateGpa(courses)).toBeCloseTo(3.00, 4);
  });

  it('incomplete courses (missing grade) are excluded', () => {
    const courses = [
      makeCourse({ level: 'CP', grade: '', duration: 'Full Year' }),
      makeCourse({ level: 'CP', grade: 'A', duration: 'Full Year' }),
    ];
    expect(calculateGpa(courses)).toBeCloseTo(4.00, 4);
  });

  it('incomplete courses (missing duration) are excluded', () => {
    const courses = [
      makeCourse({ level: 'CP', grade: 'A', duration: '' }),
      makeCourse({ level: 'CP', grade: 'B', duration: 'Full Year' }),
    ];
    expect(calculateGpa(courses)).toBeCloseTo(3.00, 4);
  });

  it('all incomplete courses → null', () => {
    const courses = [
      makeCourse({ level: '', grade: 'A', duration: 'Full Year' }),
      makeCourse({ level: 'CP', grade: '', duration: 'Full Year' }),
    ];
    expect(calculateGpa(courses)).toBeNull();
  });

  it('empty array → null', () => {
    expect(calculateGpa([])).toBeNull();
  });

  it('One Quarter duration uses 1.25 credits', () => {
    const courses = [
      makeCourse({ level: 'CP', grade: 'A', duration: 'One Quarter' }),   // 4.00 × 1.25
      makeCourse({ level: 'CP', grade: 'F', duration: 'One Quarter' }),   // 0.00 × 1.25
    ];
    // (5.00 + 0) / 2.5 = 2.00
    expect(calculateGpa(courses)).toBeCloseTo(2.00, 4);
  });

  it('Three Quarters duration uses 3.75 credits', () => {
    const result = calculateGpa([makeCourse({ level: 'AP', grade: 'B', duration: 'Three Quarters' })]);
    // 4.50 × 3.75 / 3.75 = 4.50
    expect(result).toBeCloseTo(4.50, 2);
  });

  it('per-year isolation: only counts courses from the provided list', () => {
    const year9 = [makeCourse({ level: 'CP', grade: 'A', duration: 'Full Year' })];
    const year10 = [makeCourse({ level: 'AP', grade: 'B', duration: 'Full Year' })];
    const year9Gpa = calculateGpa(year9);
    const year10Gpa = calculateGpa(year10);
    expect(year9Gpa).toBeCloseTo(4.00, 2);
    expect(year10Gpa).toBeCloseTo(4.50, 2);
    expect(year9Gpa).not.toEqual(year10Gpa);
  });
});
