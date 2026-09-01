import { useState, useMemo, useEffect, useRef } from 'react'
import { VisualizerCard } from './common/VisualizerCard'
import { VisualizerHeader, type PresetOption } from './common/VisualizerHeader'
import { VisualizerControls } from './common/VisualizerControls'
import { VisualizerStats, type StatItem } from './common/VisualizerStats'
import { VisualizerExplanation } from './common/VisualizerExplanation'
import { VisualizerCodeSnippet } from './common/VisualizerCodeSnippet'

type DPPreset = {
  coins: number[]
  amount: number
}

const PRESETS: PresetOption<DPPreset>[] = [
  {
    id: 'coins-125',
    label: 'Coins [1, 2, 5] (Amount 7)',
    value: { coins: [1, 2, 5], amount: 7 },
    description: 'Optimal solution = 2 coins (5 + 2)',
  },
  {
    id: 'coins-25',
    label: 'Coins [2, 5] (Amount 6)',
    value: { coins: [2, 5], amount: 6 },
    description: 'Requires three 2-coins (2 + 2 + 2 = 6)',
  },
]

type Step = {
  currentAmount: number
  activeCoin: number | null
  dp: number[]
  prevSubproblemAmount: number | null
  explanation: string
  actionType: 'check' | 'insert' | 'done'
  codeLine: number
}

const CODE_LINES = [
  { lineNum: 1, code: 'dp = [inf] * (amount + 1)' },
  { lineNum: 2, code: 'dp[0] = 0' },
  { lineNum: 3, code: 'for a in range(1, amount + 1):' },
  { lineNum: 4, code: '    for c in coins:' },
  { lineNum: 5, code: '        if a - c >= 0:' },
  { lineNum: 6, code: '            dp[a] = min(dp[a], 1 + dp[a - c])' },
  { lineNum: 7, code: 'return dp[amount] if dp[amount] != inf else -1' },
]

function generateCoinChangeSteps(coins: number[], amount: number): Step[] {
  const steps: Step[] = []
  const dp = new Array(amount + 1).fill(Infinity)
  dp[0] = 0

  steps.push({
    currentAmount: 0,
    activeCoin: null,
    dp: [...dp],
    prevSubproblemAmount: null,
    explanation: 'Base case: dp[0] = 0 (0 coins needed for amount $0). All other amounts initialized to ∞.',
    actionType: 'check',
    codeLine: 2,
  })

  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (a - c >= 0) {
        const prevVal = dp[a - c]
        const candidate = prevVal !== Infinity ? 1 + prevVal : Infinity
        const wasImproved = candidate < dp[a]

        if (wasImproved) {
          dp[a] = candidate
        }

        steps.push({
          currentAmount: a,
          activeCoin: c,
          dp: [...dp],
          prevSubproblemAmount: a - c,
          explanation: `At amount $${a} using coin $${c}: subproblem dp[${a} - ${c}] = dp[${a - c}] (${prevVal === Infinity ? '∞' : prevVal} coins). Candidate = 1 + ${prevVal} = ${candidate}. dp[${a}] = ${dp[a]}.`,
          actionType: wasImproved ? 'insert' : 'check',
          codeLine: 6,
        })
      }
    }
  }

  steps.push({
    currentAmount: amount,
    activeCoin: null,
    dp: [...dp],
    prevSubproblemAmount: null,
    explanation: `🏁 DP Tabulation Complete! Minimum coins needed for amount $${amount} = ${dp[amount]} coins.`,
    actionType: 'done',
    codeLine: 7,
  })

  return steps
}

export function OneDDPVisualizer() {
  const [activePreset, setActivePreset] = useState<PresetOption<DPPreset>>(PRESETS[0])
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(1.0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { coins, amount } = activePreset.value
  const steps = useMemo(() => generateCoinChangeSteps(coins, amount), [coins, amount])
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
    { label: 'Target Amount', value: `$${amount}` },
    { label: 'Current Amount (a)', value: `$${currentStep?.currentAmount}`, highlight: true },
    { label: 'Active Coin (c)', value: currentStep?.activeCoin ? `$${currentStep.activeCoin}` : '-' },
    { label: 'Min Coins for Target', value: currentStep?.dp[amount] !== Infinity ? `${currentStep?.dp[amount]} coins` : '∞', accent: true },
  ]

  return (
    <VisualizerCard>
      <VisualizerHeader
        topicBadge="1-D Dynamic Programming"
        title="Coin Change: Bottom-Up Tabulation Table"
        subtitle="Watch the DP array solve each subproblem amount once and reuse prior states in O(1)."
        presets={PRESETS}
        activePresetId={activePreset.id}
        onSelectPreset={(p) => setActivePreset(p as PresetOption<DPPreset>)}
      />

      <div className="mt-5 space-y-5">
        {/* DP Array Cells Visualizer */}
        <div className="rounded-xl border border-line bg-panel p-5">
          <div className="mb-3 flex items-center justify-between text-xs text-muted">
            <span className="font-semibold uppercase tracking-wider">DP State Table `dp[amount]`</span>
            <span>Available Coins: <strong className="text-gold font-mono">[{coins.join(', ')}]</strong></span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 py-3">
            {currentStep?.dp.map((coinsNeeded, idx) => {
              const isCurrent = currentStep.currentAmount === idx
              const isSubproblem = currentStep.prevSubproblemAmount === idx

              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`flex size-13 sm:size-14 items-center justify-center rounded-xl font-mono text-base font-bold border-2 transition-all ${
                      isCurrent
                        ? 'border-gold bg-gold/25 text-gold scale-110 shadow-md shadow-gold/20'
                        : isSubproblem
                        ? 'border-easy bg-easy/25 text-easy scale-105'
                        : coinsNeeded !== Infinity
                        ? 'border-line bg-panel-2 text-ink'
                        : 'border-line/40 bg-panel-2/30 text-muted/40'
                    }`}
                  >
                    {coinsNeeded === Infinity ? '∞' : coinsNeeded}
                  </div>
                  <span className="text-[10px] font-mono text-muted">${idx}</span>
                  <div className="h-3 text-[9px] font-mono font-bold">
                    {isCurrent && <span className="text-gold">curr</span>}
                    {isSubproblem && <span className="text-easy">prev</span>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <VisualizerStats stats={stats} />

        <VisualizerExplanation
          text={currentStep?.explanation ?? ''}
          actionType={currentStep?.actionType ?? 'info'}
          highlightKey={currentStep?.actionType === 'insert' ? 'OPTIMAL SUBSTRUCTURE' : undefined}
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
