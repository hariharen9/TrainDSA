import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type SlidingWindowPreset = {
  str: string
}

const PRESETS: PresetOption<SlidingWindowPreset>[] = [
  {
    id: 'abcabcbb',
    label: 'Standard "abcabcbb"',
    value: { str: 'abcabcbb' },
    description: 'Classic recurring characters expanding and contracting',
  },
  {
    id: 'pwwkew',
    label: 'Inner Duplicate "pwwkew"',
    value: { str: 'pwwkew' },
    description: 'Repeats in middle ("w"), resulting in substring "wke"',
  },
  {
    id: 'dvdf',
    label: 'Sandwich "dvdf"',
    value: { str: 'dvdf' },
    description: 'Important test case where L must jump past first d to capture "vdf"',
  },
]

type Step = {
  left: number
  right: number
  char: string
  seenSet: Record<string, number>
  currentWindowStr: string
  currentLen: number
  maxLen: number
  bestSubstring: string
  actionType: 'check' | 'insert' | 'delete' | 'done'
  explanation: string
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'char_map = {}  # char -> last_seen_index' },
  { lineNum: 2, code: 'left, max_len = 0, 0' },
  { lineNum: 3, code: 'for right, ch in enumerate(s):' },
  { lineNum: 4, code: '    if ch in char_map and char_map[ch] >= left:' },
  { lineNum: 5, code: '        left = char_map[ch] + 1  # Shrink window past duplicate' },
  { lineNum: 6, code: '    char_map[ch] = right' },
  { lineNum: 7, code: '    max_len = max(max_len, right - left + 1)' },
]

function generateSlidingWindowSteps(s: string): Step[] {
  const steps: Step[] = []
  const charMap: Record<string, number> = {}
  let left = 0
  let maxLen = 0
  let bestSub = ''

  for (let right = 0; right < s.length; right++) {
    const ch = s[right]
    const isDuplicate = ch in charMap && charMap[ch] >= left

    // Step A: Inspect character at right pointer
    steps.push({
      left,
      right,
      char: ch,
      seenSet: { ...charMap },
      currentWindowStr: s.slice(left, right + 1),
      currentLen: right - left + 1,
      maxLen,
      bestSubstring: bestSub,
      actionType: 'check',
      explanation: `Right pointer at index ${right} ('${ch}'). Checking if '${ch}' is already inside active window [${left}..${right}].`,
      codeLine: 4,
    })

    // Step B: If duplicate, shrink window
    if (isDuplicate) {
      const prevIdx = charMap[ch]
      left = prevIdx + 1
      steps.push({
        left,
        right,
        char: ch,
        seenSet: { ...charMap },
        currentWindowStr: s.slice(left, right + 1),
        currentLen: right - left + 1,
        maxLen,
        bestSubstring: bestSub,
        actionType: 'delete',
        explanation: `⚠️ Duplicate '${ch}' detected (previously seen at index ${prevIdx})! Advancing left pointer to ${left} to restore unique window.`,
        codeLine: 5,
      })
    }

    // Step C: Update last seen index and record best length
    charMap[ch] = right
    const currentLen = right - left + 1
    if (currentLen > maxLen) {
      maxLen = currentLen
      bestSub = s.slice(left, right + 1)
    }

    steps.push({
      left,
      right,
      char: ch,
      seenSet: { ...charMap },
      currentWindowStr: s.slice(left, right + 1),
      currentLen,
      maxLen,
      bestSubstring: bestSub,
      actionType: 'insert',
      explanation: `Updated position of '${ch}' -> index ${right}. Current window "${s.slice(left, right + 1)}" length = ${currentLen}. Max unique length = ${maxLen} ("${bestSub}").`,
      codeLine: 7,
    })
  }

  steps.push({
    left,
    right: s.length - 1,
    char: '',
    seenSet: { ...charMap },
    currentWindowStr: '',
    currentLen: 0,
    maxLen,
    bestSubstring: bestSub,
    actionType: 'done',
    explanation: `🎉 Complete scan of string! Longest non-repeating substring length is ${maxLen} ("${bestSub}").`,
    codeLine: 7,
  })

  return steps
}

export function SlidingWindowVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<SlidingWindowPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const s = activePreset.value.str
  const steps = useMemo(() => generateSlidingWindowSteps(s), [s])
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)]

  useEffect(() => {
    setStepIndex(0)
    setIsPlaying(false)
  }, [activePreset])

  useEffect(() => {
    if (!isPlaying) return
    const intervalMs = Math.max(300, 1000 / speed)
    timerRef.current = setInterval(() => {
      setStepIndex((curr) => {
        if (curr >= steps.length - 1) {
          setIsPlaying(false)
          return curr
        }
        return curr + 1
      })
    }, intervalMs)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, speed, steps.length])

  const stats: StatItem[] = [
    { label: 'Window Range', value: `[${currentStep?.left}..${currentStep?.right}]` },
    { label: 'Active Substring', value: `"${currentStep?.currentWindowStr || '-'}"`, highlight: true },
    { label: 'Current Window Length', value: currentStep?.currentLen ?? 0 },
    { label: 'Max Length (Global)', value: `${currentStep?.maxLen} ("${currentStep?.bestSubstring}")`, accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Sliding Window"
        title="Longest Substring Without Repeating Characters"
        subtitle="Watch how dynamic window boundaries expand and contract in O(N) single pass."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<SlidingWindowPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Character String & Dynamic Window Bracket */}
        <div className="rounded-xl border border-line bg-panel p-5">
          <div className="mb-3 flex items-center justify-between text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider">String Sequence</span>
            <span className="font-mono">Length: {s.length}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 py-4">
            {s.split('').map((char, idx) => {
              const isInsideWindow =
                currentStep && idx >= currentStep.left && idx <= currentStep.right
              const isL = currentStep?.left === idx
              const isR = currentStep?.right === idx

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`flex size-11 sm:size-12 items-center justify-center rounded-xl font-mono text-base font-bold border-2 transition-all ${
                      isInsideWindow
                        ? 'border-gold bg-gold/20 text-gold shadow-md shadow-gold/15 scale-105'
                        : 'border-line bg-panel-2 text-ink/70'
                    }`}
                  >
                    {char}
                  </div>
                  <span className="text-[10px] font-mono text-muted">{idx}</span>
                  <div className="h-4 font-mono text-[10px] flex items-center gap-1 font-bold">
                    {isL && <span className="text-gold">L</span>}
                    {isR && <span className="text-easy">R</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Live Set / Map of Seen Characters */}
        <div className="rounded-xl border border-line bg-panel p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
              Last Seen Index Table `char_map`
            </p>
            <span className="text-[10px] text-muted font-mono">Dynamic Lookahead Map</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {Object.entries(currentStep?.seenSet ?? {}).map(([char, pos]) => {
              const isInside = currentStep && pos >= currentStep.left
              return (
                <div
                  key={char}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-1 font-mono text-xs ${
                    isInside
                      ? 'border-gold/50 bg-gold/10 text-gold font-bold'
                      : 'border-line bg-panel-2 text-muted opacity-60'
                  }`}
                >
                  <span>'{char}'</span>
                  <span className="text-muted">➔</span>
                  <span>idx {pos}</span>
                </div>
              )
            })}
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.actionType === 'delete' ? 'DUPLICATE RESOLVED' : undefined}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <VisualizerControls
              currentStep={stepIndex}
              totalSteps={steps.length}
              isPlaying={isPlaying}
              onPlayPause={() => setIsPlaying((p) => !p)}
              onStepForward={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
              onStepBackward={() => setStepIndex((i) => Math.max(0, i - 1))}
              onReset={() => setStepIndex(0)}
              onSeek={setStepIndex}
              speed={speed}
              onSpeedChange={setSpeed}
            />
          </div>
          <div className="lg:col-span-5">
            <VisualizerCodeSnippet
              lines={CODE_LINES}
              activeLine={currentStep?.codeLine ?? 1}
              language="python"
            />
          </div>
        </div>
      </div>
    </VisualizerCard>
  )
}
