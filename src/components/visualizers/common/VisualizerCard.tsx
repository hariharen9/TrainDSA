import type { ReactNode } from 'react'

type VisualizerCardProps = {
  children: ReactNode
  className?: string
}

export function VisualizerCard({ children, className = '' }: VisualizerCardProps) {
  return (
    <div
      className={`rounded-2xl border border-line bg-panel-2 p-4 sm:p-6 shadow-sm transition-all ${className}`}
    >
      {children}
    </div>
  )
}
