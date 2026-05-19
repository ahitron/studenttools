import { describe, it, expect } from 'vitest';
import { calculateForecast } from './forecast';
import { LETTER_GRADES } from '../data/gradeWeights';

describe('calculateForecast', () => {
  it('always returns exactly 12 rows (one per letter grade)', () => {
    const result = calculateForecast(90, 88, 92, 86);
    expect(result).toHaveLength(12);
    result.forEach((row, i) => {
      expect(row.letter).toBe(LETTER_GRADES[i]);
    });
  });

  it('basic mpContribution: (90+88+92+86) × 0.225 = 80.1', () => {
    // With mpContribution=80.1, examScore=100 → round(80.1 + 10.0) = round(90.1) = 90 → A-
    const result = calculateForecast(90, 88, 92, 86);
    const aMinus = result.find(r => r.letter === 'A-')!;
    expect(aMinus.achievable).toBe(true);
    expect(aMinus.examRange![1]).toBe(100);
  });

  it('final score rounding: 89.5 rounds to 90 → A-, not 89 → B+', () => {
    // Need mpContribution + examScore * 0.10 = 89.5
    // e.g. mpContribution = 80.5, examScore = 90 → 80.5 + 9.0 = 89.5 → round = 90 → A-
    // MP scores: sum × 0.225 = 80.5 → sum = 357.78... hard to hit exactly
    // Use: sum=358, 358×0.225=80.55, exam=89 → 80.55+8.9=89.45 → round=89 → B+
    // Use: sum=356, 356×0.225=80.1, exam=94 → 80.1+9.4=89.5 → round=90 → A-
    const result = calculateForecast(89, 89, 89, 89); // sum=356, mpContrib=80.1
    // exam=94: round(80.1 + 9.4) = round(89.5) = 90 → A-
    const aMinus = result.find(r => r.letter === 'A-')!;
    expect(aMinus.achievable).toBe(true);
    expect(aMinus.examRange![0]).toBeLessThanOrEqual(94);
    expect(aMinus.examRange![1]).toBeGreaterThanOrEqual(94);
  });

  it('A+ not achievable when even 100 on exam cannot reach 97', () => {
    // mpContribution = (70+70+70+70)*0.225 = 63, exam=100 → round(63+10) = 73 → C
    const result = calculateForecast(70, 70, 70, 70);
    const aPlus = result.find(r => r.letter === 'A+')!;
    expect(aPlus.achievable).toBe(false);
    expect(aPlus.examRange).toBeNull();
  });

  it('F not achievable when even 0 on exam still exceeds F threshold', () => {
    // mpContribution = (100+100+100+100)*0.225 = 90, exam=0 → round(90+0) = 90 → A-
    const result = calculateForecast(100, 100, 100, 100);
    const f = result.find(r => r.letter === 'F')!;
    expect(f.achievable).toBe(false);
    expect(f.examRange).toBeNull();
  });

  it('perfect MPs: only high grades are achievable', () => {
    const result = calculateForecast(100, 100, 100, 100);
    // mpContribution=90, exam range 0–100 → final 90–100
    // Achievable: A- (90–92), A (93–96), A+ (97–100)
    const achievable = result.filter(r => r.achievable).map(r => r.letter);
    expect(achievable).toContain('A+');
    expect(achievable).toContain('A');
    expect(achievable).toContain('A-');
    expect(achievable).not.toContain('B+');
    expect(achievable).not.toContain('F');
  });

  it('low MPs: only low grades are achievable', () => {
    // mpContribution = (65+65+65+65)*0.225 = 58.5, exam 0–100 → final 59–69
    const result = calculateForecast(65, 65, 65, 65);
    const achievable = result.filter(r => r.achievable).map(r => r.letter);
    expect(achievable).not.toContain('A+');
    expect(achievable).not.toContain('A');
    expect(achievable).not.toContain('B');
    expect(achievable).toContain('F');
  });

  it('boundary: exact exam score producing final 93 → A, not A-', () => {
    // Need round(mpContrib + exam*0.10) = 93
    // Use mpContrib=83.7 (sum=372, 372*0.225=83.7)
    // exam=93 → 83.7+9.3=93.0 → round=93 → A
    const result = calculateForecast(93, 93, 93, 93); // sum=372, mpContrib=83.7
    const a = result.find(r => r.letter === 'A')!;
    expect(a.achievable).toBe(true);
    expect(a.examRange![0]).toBeLessThanOrEqual(93);
    expect(a.examRange![1]).toBeGreaterThanOrEqual(93);
    // exam=89 → 83.7+8.9=92.6 → round=93 → A, not A-
    // Verify A- range does not include 93
    const aMinus = result.find(r => r.letter === 'A-')!;
    if (aMinus.achievable && aMinus.examRange) {
      expect(aMinus.examRange[1]).toBeLessThan(93);
    }
  });

  it('exam score ranges are contiguous and non-overlapping', () => {
    const result = calculateForecast(85, 85, 85, 85);
    const achievable = result.filter(r => r.achievable && r.examRange);
    // Sort by range min
    const sorted = [...achievable].sort((a, b) => a.examRange![0] - b.examRange![0]);
    for (let i = 1; i < sorted.length; i++) {
      expect(sorted[i].examRange![0]).toBe(sorted[i - 1].examRange![1] + 1);
    }
  });

  it('all rows for impossible grades have achievable=false and examRange=null', () => {
    const result = calculateForecast(100, 100, 100, 100);
    const notAchievable = result.filter(r => !r.achievable);
    notAchievable.forEach(row => {
      expect(row.examRange).toBeNull();
    });
  });
});
