import {
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Gauge,
} from 'lucide-react'
import type { ChangeEvent } from 'react'

type VisualizerControlsProps = {
  currentStep: number
  totalSteps: number
  isPlaying: boolean
  onPlayPause: () => void
  onStepForward: () => void
  onStepBackward: () => void
  onReset: () => void
  onSeek: (stepIndex: number) => void
  speed: number
  onSpeedChange: (speed: number) => void
}

export function VisualizerControls({
  currentStep,
  totalSteps,
  isPlaying,
  onPlayPause,
  onStepForward,
  onStepBackward,
  onReset,
  onSeek,
  speed,
  onSpeedChange,
}: VisualizerControlsProps) {
  const atStart = currentStep === 0
  const atEnd = currentStep >= totalSteps - 1

  const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
    onSeek(Number(e.target.value))
  }

  const speedOptions = [
    { label: '0.5x', value: 0.5 },
    { label: '1x', value: 1.0 },
    { label: '2x', value: 2.0 },
  ]

  return (
    <div className="space-y-3 rounded-xl border border-line bg-panel p-3 sm:p-4">
      {/* Scrubbable Timeline */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-mono text-muted min-w-[60px]">
          Step {Math.min(currentStep + 1, totalSteps)}/{totalSteps}
        </span>
        <div className="relative flex-1">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={handleSliderChange}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-panel-2 accent-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Button Transport Row */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onReset}
            disabled={atStart}
            title="Reset to beginning"
            className="flex size-8 items-center justify-center rounded-lg border border-line bg-panel-2 text-muted transition hover:border-line/80 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={onStepBackward}
            disabled={atStart}
            title="Previous step"
            className="flex size-8 items-center justify-center rounded-lg border border-line bg-panel-2 text-muted transition hover:border-line/80 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <SkipBack className="size-3.5" />
          </button>

          <button
            type="button"
            onClick={onPlayPause}
            disabled={atEnd && !isPlaying}
            title={isPlaying ? 'Pause' : 'Auto Play'}
            className="flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold-dim px-3.5 py-1.5 text-xs font-semibold text-gold transition hover:bg-gold/25 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs"
          >
            {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5 fill-current" />}
            <span>{isPlaying ? 'Pause' : 'Play'}</span>
          </button>

          <button
            type="button"
            onClick={onStepForward}
            disabled={atEnd}
            title="Next step"
            className="flex size-8 items-center justify-center rounded-lg border border-line bg-panel-2 text-muted transition hover:border-line/80 hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <SkipForward className="size-3.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1">
          <Gauge className="size-3.5 text-muted hidden sm:inline" />
          <div className="flex items-center rounded-lg border border-line bg-panel-2 p-0.5">
            {speedOptions.map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => onSpeedChange(opt.value)}
                className={`rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                  speed === opt.value
                    ? 'bg-gold text-canvas font-bold'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
