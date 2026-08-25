import {
  CheckCircle2,
  Database,
  Layers,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { traceTwoSum } from './traceTwoSum'

type VisualizerTab = 'two-sum' | 'under-the-hood' | 'array-vs-hashset'

export function TwoSumHashMapVisualizer() {
  const [activeTab, setActiveTab] = useState<VisualizerTab>('two-sum')

  return (
    <div className="space-y-4 rounded-2xl border border-line bg-panel-2 p-5">
      {/* Visualizer Header & Mode Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-gold">Arrays & Hashing Visualizer</p>
          <h3 className="mt-0.5 text-base font-serif text-ink">Interactive Mental Model</h3>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1 rounded-xl border border-line bg-panel p-1">
          <TabButton
            active={activeTab === 'two-sum'}
            onClick={() => setActiveTab('two-sum')}
            icon={<Zap className="size-3.5" />}
            label="Two Sum Map"
          />
          <TabButton
            active={activeTab === 'under-the-hood'}
            onClick={() => setActiveTab('under-the-hood')}
            icon={<Database className="size-3.5" />}
            label="How Hashing Works"
          />
          <TabButton
            active={activeTab === 'array-vs-hashset'}
            onClick={() => setActiveTab('array-vs-hashset')}
            icon={<Layers className="size-3.5" />}
            label="Array vs Hash Set"
          />
        </div>
      </div>

      {activeTab === 'two-sum' && <TwoSumSection />}
      {activeTab === 'under-the-hood' && <UnderTheHoodSection />}
      {activeTab === 'array-vs-hashset' && <ArrayVsHashSetSection />}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
        active ? 'bg-gold text-canvas font-semibold shadow-xs' : 'text-muted hover:text-ink'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

/* =========================================================================
 * Tab 1: Two Sum with Hash Map
 * ========================================================================= */
const DEFAULT_NUMS = [2, 7, 11, 15]
const DEFAULT_TARGET = 9
const MAX_ITEMS = 10
const STEP_MS = 1100

function parseNums(raw: string): number[] {
  const parsed = raw
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && Number.isFinite(Number(s)))
    .map(Number)
    .slice(0, MAX_ITEMS)
  return parsed.length > 0 ? parsed : DEFAULT_NUMS
}

function TwoSumSection() {
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
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
        <p className="text-muted">
          Watch how the <strong className="text-ink">Hash Map</strong> remembers numbers already visited to find the partner in one pass.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5">
            Array (nums):
            <input
              value={numsInput}
              onChange={(e) => setNumsInput(e.target.value)}
              placeholder="2, 7, 11, 15"
              className="w-36 rounded-lg border border-line bg-panel px-2 py-1 font-mono text-sm text-ink outline-none focus:border-gold"
            />
          </label>
          <label className="flex items-center gap-1.5">
            Target:
            <input
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              placeholder="9"
              className="w-16 rounded-lg border border-line bg-panel px-2 py-1 font-mono text-sm text-ink outline-none focus:border-gold"
            />
          </label>
        </div>
      </div>

      {/* Array Elements Visual */}
      <div className="rounded-xl border border-line bg-panel p-4">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted">Input Array (nums)</p>
        <div className="flex flex-wrap gap-2">
          {nums.map((num, i) => {
            const isCurrent = i === step.index
            const isMatch = step.kind === 'found' && (i === step.index || i === step.matchIndex)
            const isRemembered = step.seen.has(num) && step.seen.get(num) === i

            return (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-mono text-muted">idx {i}</span>
                <div
                  className={[
                    'flex size-11 items-center justify-center rounded-xl border font-mono text-sm font-semibold transition-all duration-200 shadow-xs',
                    isMatch
                      ? 'scale-110 border-easy bg-easy/20 text-easy ring-2 ring-easy/40'
                      : isCurrent
                        ? 'border-gold bg-gold-dim text-ink ring-2 ring-gold/40'
                        : isRemembered
                          ? 'border-line bg-panel-2 text-ink/90'
                          : 'border-line/60 bg-panel text-muted/60',
                  ].join(' ')}
                >
                  {num}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Live Equation / Math Insight */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="rounded-xl border border-line bg-panel p-3.5 space-y-1">
          <p className="text-[11px] uppercase font-semibold text-muted tracking-wider">1. Current Number</p>
          <p className="font-mono text-lg font-bold text-ink">
            nums[{step.index}] = <span className="text-gold">{step.num}</span>
          </p>
        </div>

        <div className="rounded-xl border border-gold/40 bg-gold-dim p-3.5 space-y-1">
          <p className="text-[11px] uppercase font-semibold text-gold tracking-wider">2. Needed Complement</p>
          <p className="font-mono text-lg font-bold text-gold">
            {target} - {step.num} = <span className="underline">{step.complement}</span>
          </p>
        </div>

        <div className="rounded-xl border border-line bg-panel p-3.5 space-y-1">
          <p className="text-[11px] uppercase font-semibold text-muted tracking-wider">3. Map Lookup (O(1))</p>
          <p className="font-mono text-sm font-semibold text-ink">
            {step.kind === 'found' ? (
              <span className="text-easy font-bold">Found in map at index {step.matchIndex}!</span>
            ) : step.seen.has(step.complement) ? (
              <span className="text-easy">Complement exists!</span>
            ) : (
              <span className="text-muted">Not in map yet</span>
            )}
          </p>
        </div>
      </div>

      {/* Hash Map State */}
      <div className="rounded-xl border border-line bg-panel p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            Hash Map Memory: <span className="text-ink font-mono font-normal">value → index</span>
          </p>
          <span className="text-[10px] text-muted">{step.seen.size} entries stored</span>
        </div>

        {step.seen.size === 0 ? (
          <p className="text-xs text-muted/60 italic py-1">Hash Map is currently empty. As we move forward, each un-matched number is remembered here.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {[...step.seen.entries()].map(([value, idx]) => {
              const isComplementMatch = step.kind === 'found' && value === step.complement
              return (
                <div
                  key={value}
                  className={[
                    'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs transition-all shadow-xs',
                    isComplementMatch
                      ? 'border-easy bg-easy/20 text-easy font-bold ring-2 ring-easy/40'
                      : 'border-line bg-panel-2 text-ink',
                  ].join(' ')}
                >
                  <span className="text-gold font-bold">{value}</span>
                  <span className="text-muted">→</span>
                  <span>idx {idx}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Explanation Note */}
      <div
        className={`rounded-xl border px-4 py-3 text-sm transition ${
          step.kind === 'found' ? 'border-easy/60 bg-easy/10 text-ink font-medium' : 'border-line bg-panel text-ink/90'
        }`}
      >
        {step.note}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2 pt-1">
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
            className="flex items-center gap-1.5 rounded-lg border border-gold/40 bg-gold-dim px-3 py-1.5 text-sm font-semibold text-gold transition hover:bg-gold/20 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
            {playing ? 'Pause' : 'Play Step-by-Step'}
          </button>
          <IconButton
            onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
            disabled={atEnd}
            label="Next step"
          >
            <SkipForward className="size-4" />
          </IconButton>
        </div>
        <p className="text-xs text-muted font-mono">
          Step {stepIndex + 1} of {steps.length}
        </p>
      </div>
    </div>
  )
}

/* =========================================================================
 * Tab 2: Under-the-Hood: Hash Function & Bucket Array
 * ========================================================================= */
const BUCKET_COUNT = 6

type BucketEntry = {
  key: string
  val: string
  asciiSum: number
}

function computeHash(key: string, buckets: number): { asciiSum: number; index: number } {
  let sum = 0
  for (let i = 0; i < key.length; i++) {
    sum += key.charCodeAt(i)
  }
  return { asciiSum: sum, index: sum % buckets }
}

const PRESET_KEYS = ['apple', 'cat', 'banana', 'dog', 'tree', 'code', 'act']

function UnderTheHoodSection() {
  const [buckets, setBuckets] = useState<BucketEntry[][]>(() => [
    [{ key: 'apple', val: '🍎', asciiSum: 530 }],
    [],
    [{ key: 'cat', val: '🐱', asciiSum: 312 }],
    [],
    [{ key: 'banana', val: '🍌', asciiSum: 609 }],
    [],
  ])
  const [inputKey, setInputKey] = useState('')
  const [inputVal, setInputVal] = useState('')
  const [lastAction, setLastAction] = useState<string | null>(
    'Initial items loaded. Try inserting a new word or clicking a preset below.',
  )

  const handleInsert = (key: string, val: string) => {
    const cleanKey = key.trim()
    if (!cleanKey) return
    const value = val.trim() || '⭐️'
    const { asciiSum, index } = computeHash(cleanKey, BUCKET_COUNT)

    setBuckets((prev) => {
      const copy = prev.map((b) => [...b])
      const existingIdx = copy[index].findIndex((e) => e.key === cleanKey)
      if (existingIdx !== -1) {
        copy[index][existingIdx] = { key: cleanKey, val: value, asciiSum }
      } else {
        copy[index].push({ key: cleanKey, val: value, asciiSum })
      }
      return copy
    })

    setLastAction(
      `hash("${cleanKey}") = ASCII Sum ${asciiSum} % ${BUCKET_COUNT} = Bucket [${index}]. Stored in array at index ${index}!`,
    )
    setInputKey('')
    setInputVal('')
  }

  const handleReset = () => {
    setBuckets([[], [], [], [], [], []])
    setLastAction('Hash Table cleared.')
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-panel p-4 text-xs space-y-2 text-muted">
        <p className="text-sm font-semibold text-ink flex items-center gap-1.5">
          <Sparkles className="size-4 text-gold" /> How a Hash Table uses an Array internally
        </p>
        <p>
          A Hash Table is simply a <strong>fixed-size array of buckets</strong>. When you insert a key, a mathematical{' '}
          <strong className="text-ink">Hash Function</strong> calculates the ASCII sum of the characters, takes{' '}
          <code className="text-gold">sum % array_length</code>, and jumps directly to that index in <strong>O(1)</strong>!
        </p>
      </div>

      {/* Insert Tool */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-xl border border-line bg-panel p-3.5">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <input
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Key (e.g. 'orange')"
            className="w-32 rounded-lg border border-line bg-panel-2 px-2.5 py-1.5 font-mono text-sm text-ink outline-none focus:border-gold"
          />
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Value (e.g. '🍊')"
            className="w-28 rounded-lg border border-line bg-panel-2 px-2.5 py-1.5 font-mono text-sm text-ink outline-none focus:border-gold"
          />
          <button
            type="button"
            onClick={() => handleInsert(inputKey, inputVal)}
            disabled={!inputKey.trim()}
            className="rounded-lg bg-gold px-3.5 py-1.5 text-xs font-semibold text-canvas transition hover:opacity-90 disabled:opacity-40 cursor-pointer"
          >
            Insert Key
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-muted">Quick presets:</span>
          {PRESET_KEYS.slice(0, 4).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => handleInsert(k, '🔹')}
              className="rounded-md border border-line bg-panel-2 px-2 py-1 text-[10px] font-mono text-ink/80 hover:border-gold cursor-pointer"
            >
              +{k}
            </button>
          ))}
          <button
            type="button"
            onClick={handleReset}
            className="text-[11px] text-muted hover:text-hard underline ml-1 cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Live Bucket Array */}
      <div className="space-y-2">
        <p className="text-[11px] uppercase tracking-wider font-semibold text-muted">
          Underlying Bucket Array (Length = {BUCKET_COUNT})
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {buckets.map((bucket, bucketIdx) => (
            <div key={bucketIdx} className="rounded-xl border border-line bg-panel p-3 space-y-2">
              <div className="flex items-center justify-between border-b border-line pb-1.5">
                <span className="font-mono text-xs font-bold text-gold">Array Index [{bucketIdx}]</span>
                <span className="text-[10px] text-muted">{bucket.length} item(s)</span>
              </div>

              {bucket.length === 0 ? (
                <p className="text-xs text-muted/50 italic py-2">Empty bucket</p>
              ) : (
                <div className="space-y-1.5">
                  {bucket.map((entry, entryIdx) => (
                    <div
                      key={entry.key}
                      className="flex items-center justify-between rounded-lg border border-line bg-panel-2 px-2.5 py-1.5 text-xs font-mono"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-ink">{entry.key}</span>
                        <span className="text-[10px] text-muted">({entry.val})</span>
                      </div>
                      {entryIdx > 0 ? (
                        <span className="text-[9px] font-semibold text-hard bg-hard/10 px-1.5 py-0.5 rounded">
                          Chained (Collision)
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Log Box */}
      {lastAction ? (
        <div className="rounded-xl border border-gold/30 bg-gold-dim px-4 py-3 text-xs text-ink">
          <strong className="text-gold">Hashing Step: </strong>
          {lastAction}
        </div>
      ) : null}
    </div>
  )
}

/* =========================================================================
 * Tab 3: Array Search vs Hash Set Benchmark Demo
 * ========================================================================= */
const DEMO_ITEMS = [14, 52, 29, 83, 41, 95, 67, 12]

function ArrayVsHashSetSection() {
  const [selectedNum, setSelectedNum] = useState<number>(95)
  const [scanningIdx, setScanningIdx] = useState<number | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [arraySteps, setArraySteps] = useState<number | null>(null)
  const [setSteps, setSetSteps] = useState<number | null>(null)

  const handleRunSearch = (target: number) => {
    setSelectedNum(target)
    setIsSearching(true)
    setScanningIdx(0)
    setArraySteps(null)
    setSetSteps(null)

    // Simulate stepping through array
    let curr = 0
    const interval = setInterval(() => {
      if (curr < DEMO_ITEMS.length) {
        setScanningIdx(curr)
        if (DEMO_ITEMS[curr] === target) {
          clearInterval(interval)
          setArraySteps(curr + 1)
          setSetSteps(1)
          setIsSearching(false)
        } else {
          curr++
        }
      } else {
        clearInterval(interval)
        setArraySteps(DEMO_ITEMS.length)
        setSetSteps(1)
        setIsSearching(false)
      }
    }, 300)
  }

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-panel p-4 text-xs space-y-1.5 text-muted">
        <p className="text-sm font-semibold text-ink flex items-center gap-1.5">
          <Layers className="size-4 text-gold" /> Why Hashing beats Linear Array Search
        </p>
        <p>
          Pick a number to search for. Watch how an <strong>Array</strong> must check each element sequentially from left to right (<strong>O(n)</strong>), whereas a <strong>Hash Set</strong> computes the hash and finds it in <strong>1 single step (O(1))</strong>!
        </p>
      </div>

      {/* Target selector */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-line bg-panel p-3">
        <span className="text-xs font-semibold text-muted">Select number to search:</span>
        <div className="flex flex-wrap gap-1.5">
          {DEMO_ITEMS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => handleRunSearch(n)}
              disabled={isSearching}
              className={`rounded-lg border px-3 py-1 font-mono text-xs font-semibold transition cursor-pointer ${
                selectedNum === n ? 'border-gold bg-gold-dim text-gold' : 'border-line bg-panel-2 text-ink hover:border-gold'
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Array Linear Scan */}
        <div className="rounded-xl border border-line bg-panel p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-line pb-2">
            <div>
              <p className="text-xs font-bold text-ink">Array (Linear Search)</p>
              <p className="text-[10px] text-muted">Time Complexity: O(n)</p>
            </div>
            {arraySteps !== null && (
              <span className="rounded-full bg-hard/10 border border-hard/30 px-2 py-0.5 text-xs font-mono font-bold text-hard">
                {arraySteps} checks taken
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DEMO_ITEMS.map((n, i) => {
              const isCurrentlyChecked = scanningIdx === i
              const isFound = arraySteps !== null && n === selectedNum && scanningIdx === i
              return (
                <div
                  key={i}
                  className={[
                    'flex size-10 items-center justify-center rounded-lg border font-mono text-xs transition-all duration-150',
                    isFound
                      ? 'border-easy bg-easy/20 text-easy font-bold scale-105'
                      : isCurrentlyChecked
                        ? 'border-hard bg-hard/20 text-hard font-bold scale-105 ring-2 ring-hard/40'
                        : 'border-line bg-panel-2 text-muted',
                  ].join(' ')}
                >
                  {n}
                </div>
              )
            })}
          </div>

          <p className="text-[11px] text-muted">
            {isSearching
              ? `Checking index [${scanningIdx}]: ${DEMO_ITEMS[scanningIdx ?? 0]} === ${selectedNum}?`
              : arraySteps !== null
                ? `Done! Checked ${arraySteps} elements one by one before finding ${selectedNum}.`
                : 'Click a number above to start the search comparison.'}
          </p>
        </div>

        {/* Hash Set Instant Lookup */}
        <div className="rounded-xl border border-gold/30 bg-gold-dim/30 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-gold/20 pb-2">
            <div>
              <p className="text-xs font-bold text-gold">Hash Set (Direct Lookup)</p>
              <p className="text-[10px] text-muted">Time Complexity: O(1)</p>
            </div>
            {setSteps !== null && (
              <span className="rounded-full bg-easy/10 border border-easy/30 px-2 py-0.5 text-xs font-mono font-bold text-easy">
                1 check taken (Instant!)
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {DEMO_ITEMS.map((n, i) => {
              const isTarget = n === selectedNum && setSteps !== null
              return (
                <div
                  key={i}
                  className={[
                    'flex size-10 items-center justify-center rounded-lg border font-mono text-xs transition-all',
                    isTarget
                      ? 'border-easy bg-easy/20 text-easy font-bold scale-105 ring-2 ring-easy/40'
                      : 'border-line bg-panel text-ink/70',
                  ].join(' ')}
                >
                  {n}
                </div>
              )
            })}
          </div>

          <p className="text-[11px] text-ink/80">
            {setSteps !== null ? (
              <span className="flex items-center gap-1 text-easy font-medium">
                <CheckCircle2 className="size-3.5" />
                <span>hash({selectedNum}) gives the exact bucket immediately in 1 step!</span>
              </span>
            ) : (
              'Computes hash(key) in O(1) time without scanning unrelated elements.'
            )}
          </p>
        </div>
      </div>
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
      className="flex size-8 items-center justify-center rounded-lg border border-line bg-panel text-muted transition hover:border-gold/40 hover:text-gold disabled:cursor-not-allowed disabled:opacity-30 cursor-pointer"
    >
      {children}
    </button>
  )
}
