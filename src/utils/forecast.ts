import { LETTER_GRADES } from '../data/gradeWeights';
import { scoreToLetter } from '../data/gradeScale';
import type { LetterGrade } from '../data/gradeWeights';

export interface ForecastRow {
  letter: LetterGrade;
  examRange: [number, number] | null;
  achievable: boolean;
}

export function calculateForecast(mp1: number, mp2: number, mp3: number, mp4: number): ForecastRow[] {
  const mpContribution = (mp1 + mp2 + mp3 + mp4) * 0.225;

  // Map each exam score 0–100 to its resulting letter grade
  const examToLetter: (LetterGrade | null)[] = Array.from({ length: 101 }, (_, examScore) => {
    const finalScore = Math.round(mpContribution + examScore * 0.10);
    return scoreToLetter(finalScore);
  });

  // Build a map: letter → [min exam score, max exam score]
  const rangeMap = new Map<LetterGrade, [number, number]>();
  for (let i = 0; i <= 100; i++) {
    const letter = examToLetter[i];
    if (!letter) continue;
    const existing = rangeMap.get(letter);
    if (!existing) {
      rangeMap.set(letter, [i, i]);
    } else {
      rangeMap.set(letter, [existing[0], i]);
    }
  }

  return LETTER_GRADES.map((letter) => {
    const range = rangeMap.get(letter) ?? null;
    return {
      letter,
      examRange: range,
      achievable: range !== null,
    };
  });
}
