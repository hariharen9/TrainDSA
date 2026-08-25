import { Pause, Play, RotateCcw, SkipBack, SkipForward } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { traceSlidingWindow } from './traceSlidingWindow'

const DEFAULT_INPUT = 'abcabcbb'
const MAX_LEN = 16
const STEP_MS = 900

export function SlidingWindowVisualizer() {
  const [input, setInput] = useState(DEFAULT_INPUT)
  const [stepIndex, setStepIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const s = input.length > 0 ? input : DEFAULT_INPUT
  const steps = useMemo(() => traceSlidingWindow(s), [s])
  const step = steps[Math.min(stepIndex, steps.length - 1)]

  useEffect(() => {
    setStepIndex(0)
    setPlaying(false)
  }, [s])

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
          <p className="mt-1 text-sm text-muted">Longest substring without repeating characters</p>
        </div>
        <label className="flex items-center gap-2 text-xs text-muted">
          Try your own input
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, MAX_LEN).replace(/\s/g, ''))}
            placeholder={DEFAULT_INPUT}
            className="w-32 rounded-lg border border-line bg-panel px-2 py-1.5 font-mono text-sm text-ink outline-none focus:border-gold"
            maxLength={MAX_LEN}
          />
        </label>
      </div>

      <CharRow s={s} step={step} />

      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
        <Stat label="left" value={step.left} />
        <Stat label="right" value={step.right} />
        <Stat label="best so far" value={step.best} accent />
      </div>

      <p className="min-h-10 rounded-xl border border-line bg-panel px-4 py-3 text-sm text-ink/90">{step.note}</p>

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

function CharRow({ s, step }: { s: string; step: ReturnType<typeof traceSlidingWindow>[number] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {s.split('').map((ch, i) => {
        const inWindow = i >= step.left && i <= step.right
        const isTouched = i === step.touched
        const isLeft = i === step.left && inWindow
        const isRight = i === step.right

        return (
          <div key={i} className="flex flex-col items-center gap-1">
            <div className="flex h-5 items-center justify-center text-[10px] font-medium text-gold">
              {isLeft && isRight ? 'L·R' : isLeft ? 'L' : isRight ? 'R' : ''}
            </div>
            <div
              className={[
                'flex size-9 items-center justify-center rounded-lg border font-mono text-sm transition-all duration-200',
                inWindow ? 'border-gold bg-gold-dim text-ink' : 'border-line bg-panel text-muted',
                isTouched && step.kind === 'shrink' ? 'scale-95 border-hard/60 bg-hard/10 text-hard' : '',
                isTouched && (step.kind === 'add' || step.kind === 'duplicate-found') ? 'scale-105 border-easy/60' : '',
              ].join(' ')}
            >
              {ch}
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
