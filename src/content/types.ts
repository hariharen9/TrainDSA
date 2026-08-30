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
  /** Simple, jargon-free explanation with an analogy — shown first, before the deep Intuition section */
  eliExplain?: {
    /** 1-2 sentence plain English hook — what is this and why does it matter? */
    hook: string
    /** A real-world analogy that makes the concept click immediately */
    analogy: string
    /** 3-5 simple bullet points: what you need to know before reading the deep stuff */
    keyIdeas: string[]
    /** One-line mental shortcut to remember this topic in an interview */
    oneliner: string
  }
  intuition: string
  patternRecognition?: string
  workedExample?: WorkedExample
  complexity?: ComplexityInfo
  commonMistakes?: string
  gotchas: string[]
  problems: TopicProblem[]
}
