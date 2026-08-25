import type { Difficulty } from '../lib/types'

export type TopicProblem = {
  id: string
  title: string
  slug: string
  difficulty: Difficulty
}

export type CodeSnippet = {
  language: string
  snippet: string
}

export type WorkedExample = {
  title: string
  problem?: string
  code?: CodeSnippet
  explanation?: string
}

export type ComplexityInfo = {
  time: string
  timeDetail?: string
  space: string
  spaceDetail?: string
}

export type TopicContent = {
  id: string
  title: string
  order_index: number
  visualizer_id?: string | null
  summary: string
  intuition: string
  patternRecognition?: string
  workedExample?: WorkedExample
  complexity?: ComplexityInfo
  commonMistakes?: string
  gotchas: string[]
  problems: TopicProblem[]
}
