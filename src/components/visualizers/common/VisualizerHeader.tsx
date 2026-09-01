import type { ReactNode } from 'react'
import { Sparkles } from 'lucide-react'

export type PresetOption<T = string> = {
  id: string
  label: string
  value: T
  description?: string
}

type VisualizerHeaderProps<T = string> = {
  topicBadge: string
  title: string
  subtitle: string
  presets?: PresetOption<T>[]
  activePresetId?: string
  onSelectPreset?: (preset: PresetOption<T>) => void
  customAction?: ReactNode
}

export function VisualizerHeader<T = string>({
  topicBadge,
  title,
  subtitle,
  presets,
  activePresetId,
  onSelectPreset,
  customAction,
}: VisualizerHeaderProps<T>) {
  return (
    <div className="flex flex-col gap-3.5 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-gold">
          <Sparkles className="size-3.5 text-gold" />
          <span>{topicBadge}</span>
        </div>
        <h3 className="mt-1 font-serif text-lg text-ink sm:text-xl">{title}</h3>
        <p className="mt-0.5 text-xs text-muted sm:text-sm">{subtitle}</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {presets && presets.length > 0 && onSelectPreset && (
          <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-line bg-panel p-1">
            <span className="px-2 text-[10px] uppercase font-semibold tracking-wider text-muted hidden sm:inline">
              Presets
            </span>
            {presets.map((preset) => {
              const active = preset.id === activePresetId
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onSelectPreset(preset)}
                  title={preset.description}
                  className={`rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                    active
                      ? 'bg-gold text-canvas font-semibold shadow-xs'
                      : 'text-muted hover:text-ink hover:bg-panel-2'
                  }`}
                >
                  {preset.label}
                </button>
              )
            })}
          </div>
        )}
        {customAction}
      </div>
    </div>
  )
}
