export function Logo({ className = 'size-8' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      aria-label="TrainDSA Logo"
    >
      <rect width="32" height="32" rx="8" className="fill-panel-2" />
      <rect width="32" height="32" rx="8" stroke="var(--line)" strokeWidth="1" />
      {/* Train track / DSA graph spine */}
      <path d="M9 23V9" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" />
      {/* Nodes */}
      <circle cx="9" cy="11" r="2" fill="var(--gold)" />
      <circle cx="9" cy="16" r="2" fill="var(--easy)" />
      <circle cx="9" cy="21" r="2" fill="var(--muted)" />
      {/* Code / Track lines */}
      <path
        d="M15 11h9M15 16h7M15 21h5"
        stroke="var(--ink)"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}
