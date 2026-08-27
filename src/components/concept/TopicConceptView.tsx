import type { TopicContent } from '../../content/types'
import { IntuitionSection } from './IntuitionSection'
import { PatternSection } from './PatternSection'
import { WorkedExampleSection } from './WorkedExampleSection'
import { ComplexitySection } from './ComplexitySection'
import { CommonMistakesSection } from './CommonMistakesSection'

interface TopicConceptViewProps {
  topic: TopicContent
}

/**
 * Renders the full concept content for a topic as structured,
 * visually distinct section cards instead of a flat Markdown blob.
 *
 * Sections rendered (in order, all optional):
 *   1. Intuition        — gold-accented card with MarkdownBody
 *   2. Pattern Recognition — green-accented card with parsed pattern cards
 *   3. Worked Example   — blue-accented card with code/trace split pane
 *   4. Complexity       — Time + Space pill cards
 *   5. Common Mistakes  — red-accented alert cards
 */
export function TopicConceptView({ topic }: TopicConceptViewProps) {
  return (
    <div className="space-y-5">
      {topic.intuition && <IntuitionSection intuition={topic.intuition} />}

      {topic.patternRecognition && (
        <PatternSection patternRecognition={topic.patternRecognition} />
      )}

      {topic.workedExample && (
        <WorkedExampleSection example={topic.workedExample} />
      )}

      {topic.complexity && <ComplexitySection complexity={topic.complexity} />}

      {topic.commonMistakes && (
        <CommonMistakesSection mistakes={topic.commonMistakes} />
      )}
    </div>
  )
}
