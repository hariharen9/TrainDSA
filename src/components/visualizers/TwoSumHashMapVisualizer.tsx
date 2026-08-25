import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { traceTwoSum } from './traceTwoSum'

const DEFAULT_NUMS = [2, 7, 11, 15]
const DEFAULT_TARGET = 9
const MAX_ITEMS = 10
const STEP_MS = 1000

function parseNums(raw: string): number[] {
  const parsed = raw
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n) => Number.isFinite(n))
    .slice(0, MAX_ITEMS)
  return parsed.length > 0 ? parsed : DEFAULT_NUMS
}

export function TwoSumHashMapVisualizer() {
  const [numsInput, setNumsInput] = useState(DEFAULT_NUMS.join(', '))
  const [targetInput, setTargetInput] = useState(String(DEFAULT_TARGET))
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const nums = useMemo(() => parseNums(numsInput), [numsInput])
  const target = Number.isFinite(Number(targetInput)) ? Number(targetInput) : DEFAULT_TARGET
  const steps = useMemo(() => traceTwoSum(nums, target), [nums, target])
  const step = steps[Math.min(stepIndex, steps.length - 1)]

  useEffect(() => {
    setStepIndex(0)
    setPlaying(false)
  }, [nums, target])

  useEffect(() => {
    if (!playing) return
    timerRef.current = setInterval(() => {
      setStepIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false)
          return i
        }
        return i + 1
      })
    }, STEP_MS)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [playing, steps.length])

  if (!step) return null

  const atStart = stepIndex === 0
  const atEnd = stepIndex === steps.length - 1

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-panel-2 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gold">Interactive walkthrough</p>
          <p className="mt-1 text-sm text-muted">Two Sum with a hash map</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
          <label className="flex items-center gap-2">
            nums
            <input
              value={numsInput}
              onChange={(e) => setNumsInput(e.target.value)}
              placeholder="2, 7, 11, 15"
              className="w-36 rounded-lg border border-line bg-panel px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-gold"
            />
          </label>
          <label className="flex items-center gap-2">
            target
            <input
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="9"
              className="w-16 rounded-lg border border-line bg-panel px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-gold"
            />
          </label>
        </div>
      </div>

      <NumRow nums={nums} step={step} />

      <div className="rounded-xl border border-line bg-panel p-4">
        <p className="mb-2 text-[11px] uppercase tracking-wide text-muted">Map: value → index</p>
        {step.seen.size === 0 ? (
          <p className="text-sm text-muted/70">empty</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {[...step.seen.entries()].map(([value, idx]) => {
              const isComplementMatch = step.kind === 'found' && value === step.complement
              return (
                <span
                  key={value}
                  className={[
                    'rounded-lg border px-2.5 py-1 font-mono text-xs',
                    isComplementMatch ? 'border-easy/60 bg-easy/10 text-easy' : 'border-line bg-panel-2 text-ink/80',
                  ].join(' ')}
                >
                  {value} → {idx}
                </span>
              )
            })}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Stat label="index" value={step.index} />
        <Stat label="num" value={step.num} />
        <Stat label="complement" value={step.complement} accent />
      </div>

      <p
        className={`min-h-10 rounded-xl border px-4 py-3 text-sm ${
          step.kind === 'found' ? 'border-easy/50 bg-easy/10 text-ink' : 'border-line bg-panel text-ink/90'
        }`}
      >
        {step.note}
      </p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <IconButton onClick={() => setStepIndex(0)} disabled={atStart} label="Restart">
            <RotateCcw className="size-4" />
          </IconButton>
          <IconButton onClick={() => setStepIndex((i) => Math.max(0, i - 1))} disabled={atStart} label="Previous step">
            <SkipBack className="size-4" />
          </IconButton>
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            disabled={atEnd && !playing}
            className="flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold-dim px-3 py-1.5 text-sm font-medium text-gold transition hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            {playing ? 'Pause' : 'Play'}
          </button>
          <IconButton
            onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
            disabled={atEnd}
            label="Next step"
          >
            <SkipForward className="size-4" />
          </IconButton>
        </div>
        <p className="text-xs text-muted">
          Step {stepIndex + 1} / {steps.length}
        </p>
      </div>
    </div>
  )
}

function NumRow({ nums, step }: { nums: number[]; step: ReturnType<typeof traceTwoSum>[number] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {nums.map((num, i) => {
        const isCurrent = i === step.index
        const isMatch = step.kind === 'found' && (i === step.index || i === step.matchIndex)
        const isRemembered = step.seen.has(num) && step.seen.get(num) === i

        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="flex h-4 items-center justify-center text-[10px] text-muted">{i}</div>
            <div
              className={[
                'flex size-10 items-center justify-center rounded-lg border font-mono text-sm transition-all duration-200',
                isMatch
                  ? 'scale-105 border-easy bg-easy/15 text-easy'
                  : isCurrent
                    ? 'border-gold bg-gold-dim text-ink'
                    : isRemembered
                      ? 'border-line bg-panel-2 text-ink/80'
                      : 'border-line bg-panel text-muted',
              ].join(' ')}
            >
              {num}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="rounded-xl border border-line bg-panel px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-muted">{label}</p>
      <p className={`font-mono text-lg ${accent ? 'text-gold' : 'text-ink'}`}>{value}</p>
    </div>
  )
}

function IconButton({
  onClick,
  disabled,
  label,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  label: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="flex size-8 items-center justify-center rounded-lg border border-line bg-panel text-muted transition hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  )
}
