export type CourseLevel = 'CP' | 'H' | 'AP';
export type LetterGrade = 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'F';

export const GRADE_WEIGHTS: Record<CourseLevel, Record<LetterGrade, number>> = {
  CP: {
    'A+': 4.33, 'A': 4.00, 'A-': 3.66,
    'B+': 3.33, 'B': 3.00, 'B-': 2.66,
    'C+': 2.33, 'C': 2.00, 'C-': 1.66,
    'D+': 1.33, 'D': 1.00, 'F': 0.00,
  },
  H: {
    'A+': 5.08, 'A': 4.75, 'A-': 4.41,
    'B+': 4.08, 'B': 3.75, 'B-': 3.41,
    'C+': 3.08, 'C': 2.75, 'C-': 2.41,
    'D+': 2.08, 'D': 1.75, 'F': 0.00,
  },
  AP: {
    'A+': 5.83, 'A': 5.50, 'A-': 5.16,
    'B+': 4.83, 'B': 4.50, 'B-': 4.16,
    'C+': 3.83, 'C': 3.50, 'C-': 3.16,
    'D+': 2.83, 'D': 2.50, 'F': 0.00,
  },
};

export const LEVELS: CourseLevel[] = ['CP', 'H', 'AP'];

export const LETTER_GRADES: LetterGrade[] = [
  'A+', 'A', 'A-',
  'B+', 'B', 'B-',
  'C+', 'C', 'C-',
  'D+', 'D', 'F',
];
