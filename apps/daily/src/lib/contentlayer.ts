export const MonthSubjectsMap = {
  January: 'Clarity',
  Febuary: 'Passions and Emotion',
  March: 'Awareness',
  April: 'Unbiased Thought',
  May: 'Right Action',
  June: 'Problem Solving',
  July: 'Duty',
  August: 'Pragmatism',
  September: 'Fortitude and Resilience',
  October: 'Virtue and Kindness',
  November: 'Acceptance',
  December: 'Meditation On Mortality',
} as const

export type Month = keyof typeof MonthSubjectsMap
export const Months = Object.keys(MonthSubjectsMap) as Month[]

export function getDateFromPath(path: string) {
  /* path format is `{Month}/{day}` */
  const [month, day] = path.split('/')
  return {
    month: month as Month,
    day: parseInt(day, 10),
  }
}