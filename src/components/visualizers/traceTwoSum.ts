export type TwoSumStep = {
  index: number
  num: number
  complement: number
  /** map snapshot BEFORE this index's own entry is added */
  seen: Map<number, number>
  kind: 'check' | 'found' | 'add' | 'exhausted'
  matchIndex?: number
  note: string
}

/**
 * Re-runs the exact algorithm from the concept's worked example, one primitive
 * operation at a time:
 *
 *   seen = {}
 *   for i, num in enumerate(nums):
 *       complement = target - num
 *       if complement in seen:
 *           return [seen[complement], i]
 *       seen[num] = i
 */
export function traceTwoSum(nums: number[], target: number): TwoSumStep[] {
  const steps: TwoSumStep[] = []
  const seen = new Map<number, number>()

  for (let i = 0; i < nums.length; i++) {
    const num = nums[i]
    const complement = target - num

    steps.push({
      index: i,
      num,
      complement,
      seen: new Map(seen),
      kind: 'check',
      note: `Looking for complement ${complement} (= ${target} - ${num}) in the map so far.`,
    })

    if (seen.has(complement)) {
      const matchIndex = seen.get(complement)!
      steps.push({
        index: i,
        num,
        complement,
        seen: new Map(seen),
        kind: 'found',
        matchIndex,
        note: `Found it! Index ${matchIndex} holds ${complement}. Returning [${matchIndex}, ${i}].`,
      })
      return steps
    }

    seen.set(num, i)
    steps.push({
      index: i,
      num,
      complement,
      seen: new Map(seen),
      kind: 'add',
      note: `No match yet — remembering ${num} → index ${i}.`,
    })
  }

  steps.push({
    index: nums.length - 1,
    num: nums[nums.length - 1] ?? 0,
    complement: target,
    seen: new Map(seen),
    kind: 'exhausted',
    note: 'No pair adds up to the target.',
  })

  return steps
}
