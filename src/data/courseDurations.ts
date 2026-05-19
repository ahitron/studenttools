export interface CourseDuration {
  label: string;
  credits: number;
}

export const COURSE_DURATIONS: CourseDuration[] = [
  { label: 'Full Year',      credits: 5.00 },
  { label: 'Three Quarters', credits: 3.75 },
  { label: 'Semester',       credits: 2.50 },
  { label: 'One Quarter',    credits: 1.25 },
];
