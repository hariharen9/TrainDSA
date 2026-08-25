import type { Problem, Topic } from '../lib/types'
import { arraysHashingTopic } from './topics/01-arrays-hashing'
import { twoPointersTopic } from './topics/02-two-pointers'
import { slidingWindowTopic } from './topics/03-sliding-window'
import { stackTopic } from './topics/04-stack'
import { binarySearchTopic } from './topics/05-binary-search'
import { linkedListsTopic } from './topics/06-linked-lists'
import { treesTopic } from './topics/07-trees'
import { triesTopic } from './topics/08-tries'
import { heapPriorityQueueTopic } from './topics/09-heap-priority-queue'
import { backtrackingTopic } from './topics/10-backtracking'
import { graphsTopic } from './topics/11-graphs'
import { advancedGraphsTopic } from './topics/12-advanced-graphs'
import { oneDDynamicProgrammingTopic } from './topics/13-1d-dynamic-programming'
import { twoDDynamicProgrammingTopic } from './topics/14-2d-dynamic-programming'
import { greedyTopic } from './topics/15-greedy'
import { intervalsTopic } from './topics/16-intervals'
import { bitManipulationTopic } from './topics/17-bit-manipulation'
import type { TopicContent } from './types'

export * from './types'

export const RAW_TOPICS: TopicContent[] = [
  arraysHashingTopic,
  twoPointersTopic,
  slidingWindowTopic,
  stackTopic,
  binarySearchTopic,
  linkedListsTopic,
  treesTopic,
  triesTopic,
  heapPriorityQueueTopic,
  backtrackingTopic,
  graphsTopic,
  advancedGraphsTopic,
  oneDDynamicProgrammingTopic,
  twoDDynamicProgrammingTopic,
  greedyTopic,
  intervalsTopic,
  bitManipulationTopic,
]

function compileConceptMarkdown(topic: TopicContent): string {
  const parts: string[] = []

  if (topic.intuition) {
    parts.push(`## Intuition\n\n${topic.intuition.trim()}`)
  }

  if (topic.patternRecognition) {
    parts.push(`## Pattern Recognition\n\n${topic.patternRecognition.trim()}`)
  }

  if (topic.workedExample) {
    const { title, problem, code, explanation } = topic.workedExample
    let ex = `## Worked Example: ${title}\n\n`
    if (problem) ex += `${problem.trim()}\n\n`
    if (code) ex += `\`\`\`${code.language}\n${code.snippet.trim()}\n\`\`\`\n\n`
    if (explanation) ex += `${explanation.trim()}`
    parts.push(ex.trim())
  }

  if (topic.complexity) {
    const { time, timeDetail, space, spaceDetail } = topic.complexity
    const comp = `## Complexity\n\n- **Time**: \`${time}\`${timeDetail ? ` — ${timeDetail}` : ''}\n- **Space**: \`${space}\`${spaceDetail ? ` — ${spaceDetail}` : ''}`
    parts.push(comp)
  }

  if (topic.commonMistakes) {
    parts.push(`## Common Mistakes\n\n${topic.commonMistakes.trim()}`)
  }

  if (topic.visualizer_id) {
    parts.push(`## Try It Yourself\n\nUse the interactive explainer below to step through and visualize the state transitions.`)
  }

  return parts.join('\n\n')
}

function compileGotchasMarkdown(topic: TopicContent): string {
  return topic.gotchas.map((g) => `- ${g.trim()}`).join('\n')
}

const lc = (slug: string) => `https://leetcode.com/problems/${slug}/`

export const TOPICS: Topic[] = RAW_TOPICS.map((topic) => ({
  id: topic.id,
  title: topic.title,
  order_index: topic.order_index,
  concept_md: compileConceptMarkdown(topic),
  gotchas_md: compileGotchasMarkdown(topic),
  visualizer_id: topic.visualizer_id ?? null,
}))

export const PROBLEMS: Problem[] = RAW_TOPICS.flatMap((topic) =>
  topic.problems.map((p, index) => ({
    id: p.id,
    topic_id: topic.id,
    title: p.title,
    url: lc(p.slug),
    difficulty: p.difficulty,
    order_index: index + 1,
  })),
)

export const TOPIC_MAP = new Map<string, Topic>(TOPICS.map((t) => [t.id, t]))
export const TOPIC_CONTENT_MAP = new Map<string, TopicContent>(RAW_TOPICS.map((t) => [t.id, t]))
export const PROBLEM_MAP = new Map<string, Problem>(PROBLEMS.map((p) => [p.id, p]))

export const PROBLEMS_BY_TOPIC = new Map<string, Problem[]>()
for (const problem of PROBLEMS) {
  const list = PROBLEMS_BY_TOPIC.get(problem.topic_id) ?? []
  list.push(problem)
  PROBLEMS_BY_TOPIC.set(problem.topic_id, list)
}
