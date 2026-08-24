import type { Confidence, Difficulty, ProgressStatus } from '../lib/types'

export function statusLabel(status: ProgressStatus): string {
  if (status === 'unattempted') return 'Unattempted'
  if (status === 'attempted') return 'Attempted'
  return 'Solved'
}

export function confidenceLabel(value: Confidence): string {
  if (value === 'struggled') return 'Struggled'
  if (value === 'solved_with_hints') return 'Hints'
  return 'Easy'
}

export function difficultyClass(difficulty: Difficulty): string {
  if (difficulty === 'easy') return 'border-easy/40 bg-easy/10 text-easy'
  if (difficulty === 'medium') return 'border-medium/40 bg-medium/10 text-medium'
  return 'border-hard/40 bg-hard/10 text-hard'
}

export function difficultyLabel(difficulty: Difficulty): string {
  return difficulty[0].toUpperCase() + difficulty.slice(1)
}
