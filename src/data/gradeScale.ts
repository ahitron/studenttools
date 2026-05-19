import type { LetterGrade } from './gradeWeights';

export interface GradeScaleEntry {
  letter: LetterGrade;
  min: number;
  max: number;
}

export const GRADE_SCALE: GradeScaleEntry[] = [
  { letter: 'A+', min: 97, max: 100 },
  { letter: 'A',  min: 93, max: 96  },
  { letter: 'A-', min: 90, max: 92  },
  { letter: 'B+', min: 87, max: 89  },
  { letter: 'B',  min: 83, max: 86  },
  { letter: 'B-', min: 80, max: 82  },
  { letter: 'C+', min: 77, max: 79  },
  { letter: 'C',  min: 73, max: 76  },
  { letter: 'C-', min: 70, max: 72  },
  { letter: 'D+', min: 67, max: 69  },
  { letter: 'D',  min: 65, max: 66  },
  { letter: 'F',  min: 0,  max: 64  },
];

export function scoreToLetter(score: number): LetterGrade | null {
  for (const { letter, min, max } of GRADE_SCALE) {
    if (score >= min && score <= max) return letter;
  }
  return null;
}
