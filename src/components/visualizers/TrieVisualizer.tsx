import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type TriePreset = {
  words: string[]
  searchWord: string
  isPrefixOnly: boolean
}

const PRESETS: PresetOption<TriePreset>[] = [
  {
    id: 'search-car',
    label: 'Search "car" in [cat, car, card]',
    value: { words: ['cat', 'car', 'card'], searchWord: 'car', isPrefixOnly: false },
    description: 'Walks down shared prefix "c" ➔ "a" ➔ "r" (isWord=true)',
  },
  {
    id: 'prefix-ca',
    label: 'Prefix "ca" in [cat, car, card]',
    value: { words: ['cat', 'car', 'card'], searchWord: 'ca', isPrefixOnly: true },
    description: 'startsWith lookup returns True even if isWord is false',
  },
  {
    id: 'miss-bat',
    label: 'Missing "bat"',
    value: { words: ['cat', 'car', 'dog'], searchWord: 'bat', isPrefixOnly: false },
    description: 'Branch for "b" does not exist at root (instant False)',
  },
]

type Step = {
  activeChar: string
  activePath: string
  nodeFound: boolean
  isWordMatch: boolean
  explanation: string
  actionType: 'check' | 'found' | 'delete' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'curr = self.root' },
  { lineNum: 2, code: 'for ch in word:' },
  { lineNum: 3, code: '    if ch not in curr.children:' },
  { lineNum: 4, code: '        return False  # Branch missing' },
  { lineNum: 5, code: '    curr = curr.children[ch]' },
  { lineNum: 6, code: 'return curr.is_end if is_word_search else True' },
]

function generateTrieSteps(preset: TriePreset): Step[] {
  const steps: Step[] = []
  const { searchWord, isPrefixOnly } = preset
  let currentPath = ''

  steps.push({
    activeChar: 'root',
    activePath: '',
    nodeFound: true,
    isWordMatch: false,
    explanation: `Starting search at Root. Looking for ${isPrefixOnly ? 'prefix' : 'word'} "${searchWord}".`,
    actionType: 'check',
    codeLine: 1,
  })

  // Simulated trie nodes check
  for (let i = 0; i < searchWord.length; i++) {
    const ch = searchWord[i]
    currentPath += ch

    if (searchWord === 'bat' && ch === 'b') {
      steps.push({
        activeChar: 'b',
        activePath: currentPath,
        nodeFound: false,
        isWordMatch: false,
        explanation: `❌ Child '${ch}' not found under root! Immediate False.`,
        actionType: 'delete',
        codeLine: 4,
      })
      return steps
    }

    steps.push({
      activeChar: ch,
      activePath: currentPath,
      nodeFound: true,
      isWordMatch: i === searchWord.length - 1 && !isPrefixOnly,
      explanation: `Found character '${ch}'! Navigating to child node '${ch}' (path: "${currentPath}").`,
      actionType: 'check',
      codeLine: 5,
    })
  }

  const match = isPrefixOnly ? true : searchWord === 'car' || searchWord === 'cat'
  steps.push({
    activeChar: searchWord[searchWord.length - 1],
    activePath: currentPath,
    nodeFound: true,
    isWordMatch: match,
    explanation: match
      ? `🎯 ${isPrefixOnly ? 'Prefix' : 'Word'} "${searchWord}" matched successfully! Return True.`
      : `Path exists, but is_end == False. Word "${searchWord}" is only a prefix, not a full word. Return False.`,
    actionType: match ? 'found' : 'delete',
    codeLine: 6,
  })

  return steps
}

export function TrieVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<TriePreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const steps = useMemo(() => generateTrieSteps(activePreset.value), [activePreset.value])
  const currentStep = steps[Math.min(stepIndex, steps.length - 1)]

  useEffect(() => {
    setStepIndex(0)
    setIsPlaying(false)
  }, [activePreset])

  useEffect(() => {
    if (!isPlaying) return
    const intervalMs = Math.max(300, 1100 / speed)
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
    { label: 'Query Type', value: activePreset.value.isPrefixOnly ? 'startsWith()' : 'search()' },
    { label: 'Target String', value: `"${activePreset.value.searchWord}"`, highlight: true },
    { label: 'Current Path', value: `"${currentStep?.activePath || 'root'}"` },
    { label: 'Node Status', value: currentStep?.nodeFound ? 'Active Match' : 'Branch Missing', accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="Tries"
        title="Prefix Tree (Trie) Node Navigation"
        subtitle="Watch how common prefixes share tree branches, enabling O(L) search where L = word length."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<TriePreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* Visual Trie Hierarchy */}
        <div className="rounded-xl border border-line bg-panel p-6 flex flex-col items-center">
          <div className="flex flex-col items-center gap-4">
            {/* Root Node */}
            <div className="flex size-12 items-center justify-center rounded-2xl border-2 border-line bg-panel-2 font-mono text-sm font-bold text-muted">
              ROOT
            </div>

            <div className="w-0.5 h-6 bg-line" />

            {/* Level 1: 'c' vs other */}
            <div className="flex items-center gap-12">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={`flex size-11 items-center justify-center rounded-xl font-mono text-sm font-bold border-2 transition-all ${
                    currentStep?.activePath.startsWith('c')
                      ? 'border-gold bg-gold/20 text-gold scale-110 shadow-md shadow-gold/20'
                      : 'border-line bg-panel-2 text-ink'
                  }`}
                >
                  c
                </div>

                <div className="w-0.5 h-5 bg-line" />

                {/* Level 2: 'a' */}
                <div
                  className={`flex size-11 items-center justify-center rounded-xl font-mono text-sm font-bold border-2 transition-all ${
                    currentStep?.activePath.startsWith('ca')
                      ? 'border-gold bg-gold/20 text-gold scale-110 shadow-md shadow-gold/20'
                      : 'border-line bg-panel-2 text-ink'
                  }`}
                >
                  a
                </div>

                <div className="w-0.5 h-5 bg-line" />

                {/* Level 3: 't' and 'r' */}
                <div className="flex items-center gap-6">
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl font-mono text-sm font-bold border-2 transition-all ${
                      currentStep?.activePath === 'cat'
                        ? 'border-easy bg-easy/20 text-easy scale-110'
                        : 'border-line bg-panel-2 text-ink'
                    }`}
                  >
                    t*
                  </div>
                  <div
                    className={`flex size-11 items-center justify-center rounded-xl font-mono text-sm font-bold border-2 transition-all ${
                      currentStep?.activePath.startsWith('car')
                        ? 'border-easy bg-easy/20 text-easy scale-110'
                        : 'border-line bg-panel-2 text-ink'
                    }`}
                  >
                    r*
                  </div>
                </div>
              </div>
            </div>
          </div>
          <span className="mt-4 text-[11px] text-muted font-mono">* indicates is_end = True (complete word)</span>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.actionType === 'found' ? 'TRIE MATCH' : undefined}
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
