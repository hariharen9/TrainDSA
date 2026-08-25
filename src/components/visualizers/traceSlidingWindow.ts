export type SlidingWindowStep = {
  left: number
  right: number
  /** characters currently inside the window, mirroring the algorithm's `window` set */
  windowChars: Set<string>
  best: number
  /** index just touched this step, for a brief highlight pulse */
  touched: number
  kind: 'duplicate-found' | 'shrink' | 'add' | 'record'
  note: string
}

/**
 * Re-runs the exact algorithm from the concept's worked example, one primitive
 * operation at a time, so the UI can scrub through it.
 *
 *   window = set()
 *   left = 0
 *   best = 0
 *   for right in range(len(s)):
 *       while s[right] in window:
 *           window.remove(s[left]); left += 1
 *       window.add(s[right])
 *       best = max(best, right - left + 1)
 */
export function traceSlidingWindow(s: string): SlidingWindowStep[] {
  const steps: SlidingWindowStep[] = []
  const windowChars = new Set<string>()
  let left = 0
  let best = 0

  const snapshot = (kind: SlidingWindowStep['kind'], right: number, touched: number, note: string) => {
    steps.push({ left, right, windowChars: new Set(windowChars), best, touched, kind, note })
  }

  for (let right = 0; right < s.length; right++) {
    const ch = s[right]

    if (windowChars.has(ch)) {
      snapshot('duplicate-found', right, right, `'${ch}' is already in the window — shrink from the left until it's gone.`)
      while (windowChars.has(ch)) {
        const leaving = s[left]
        windowChars.delete(leaving)
        snapshot('shrink', right, left, `Removed '${leaving}' from the window, left moves to ${left + 1}.`)
        left += 1
      }
    }

    windowChars.add(ch)
    snapshot('add', right, right, `Added '${ch}' to the window.`)

    const windowLen = right - left + 1
    const isNewBest = windowLen > best
    best = Math.max(best, windowLen)
    snapshot(
      'record',
      right,
      right,
      isNewBest
        ? `Window is now "${s.slice(left, right + 1)}" (length ${windowLen}) — new best!`
        : `Window is now "${s.slice(left, right + 1)}" (length ${windowLen}), best stays ${best}.`,
    )
  }

  return steps
}
