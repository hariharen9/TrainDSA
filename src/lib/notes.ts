export type ProblemNoteData = {
  text: string
  timeComplexity?: string
  spaceComplexity?: string
  codeSnippet?: string
  timeSpentSeconds?: number
}

const PREFIX = '/*__TRAINDSA_NOTE_V1__*/'

export function parseProblemNote(raw: string | null | undefined): ProblemNoteData {
  if (!raw) {
    return { text: '' }
  }

  if (raw.startsWith(PREFIX)) {
    try {
      const json = raw.slice(PREFIX.length)
      const data = JSON.parse(json) as ProblemNoteData
      return {
        text: data.text || '',
        timeComplexity: data.timeComplexity,
        spaceComplexity: data.spaceComplexity,
        codeSnippet: data.codeSnippet,
        timeSpentSeconds: data.timeSpentSeconds,
      }
    } catch {
      return { text: raw }
    }
  }

  // Fallback for regular markdown / plain text
  return { text: raw }
}

export function serializeProblemNote(data: ProblemNoteData): string | null {
  const hasComplexity = Boolean(data.timeComplexity || data.spaceComplexity)
  const hasCode = Boolean(data.codeSnippet?.trim())
  const hasTime = Boolean(data.timeSpentSeconds && data.timeSpentSeconds > 0)
  const hasText = Boolean(data.text?.trim())

  if (!hasText && !hasComplexity && !hasCode && !hasTime) {
    return null
  }

  // If user only wrote plain notes with no extra structured fields, save as clean markdown
  if (!hasComplexity && !hasCode && !hasTime) {
    return data.text.trim()
  }

  return `${PREFIX}${JSON.stringify({
    text: data.text.trim(),
    timeComplexity: data.timeComplexity || undefined,
    spaceComplexity: data.spaceComplexity || undefined,
    codeSnippet: data.codeSnippet?.trim() || undefined,
    timeSpentSeconds: data.timeSpentSeconds || undefined,
  })}`
}

export function formatSeconds(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
