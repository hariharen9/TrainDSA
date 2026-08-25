import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const seedPath = join(dirname(fileURLToPath(import.meta.url)), 'generate-seed.mjs')
const seedContent = readFileSync(seedPath, 'utf8')

// Extract the topics array definition from generate-seed.mjs
const startMarker = 'const topics = ['
const startIndex = seedContent.indexOf(startMarker)
const endMarker = '\n]\n\nfunction sqlString'
const endIndex = seedContent.indexOf(endMarker)

if (startIndex === -1 || endIndex === -1) {
  console.error('Could not parse topics from generate-seed.mjs')
  process.exit(1)
}

const topicsCode = seedContent.slice(startIndex, endIndex + 2)

// Evaluate topics safely
const lc = (slug) => `https://leetcode.com/problems/${slug}/`
const fn = new Function('lc', `${topicsCode}; return topics;`)
const rawTopics = fn(lc)

const formattedTopics = []
const formattedProblems = []

for (const t of rawTopics) {
  formattedTopics.push({
    id: t.id,
    title: t.title,
    order_index: t.order,
    concept_md: t.concept,
    gotchas_md: t.gotchas,
    visualizer_id: t.visualizer || null,
  })

  for (let i = 0; i < t.problems.length; i++) {
    const [id, title, slug, difficulty] = t.problems[i]
    formattedProblems.push({
      id,
      topic_id: t.id,
      title,
      url: lc(slug),
      difficulty,
      order_index: i + 1,
    })
  }
}

const tsContent = `import type { Problem, Topic } from '../lib/types'

export const TOPICS: Topic[] = ${JSON.stringify(formattedTopics, null, 2)}

export const PROBLEMS: Problem[] = ${JSON.stringify(formattedProblems, null, 2)}

export const TOPIC_MAP = new Map<string, Topic>(TOPICS.map((t) => [t.id, t]))
export const PROBLEM_MAP = new Map<string, Problem>(PROBLEMS.map((p) => [p.id, p]))

export const PROBLEMS_BY_TOPIC = new Map<string, Problem[]>()
for (const problem of PROBLEMS) {
  const list = PROBLEMS_BY_TOPIC.get(problem.topic_id) ?? []
  list.push(problem)
  PROBLEMS_BY_TOPIC.set(problem.topic_id, list)
}
`

const outPath = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'curriculum.ts')
mkdirSync(dirname(outPath), { recursive: true })
writeFileSync(outPath, tsContent, 'utf8')
console.log(`Generated ${outPath} with ${formattedTopics.length} topics and ${formattedProblems.length} problems.`)
