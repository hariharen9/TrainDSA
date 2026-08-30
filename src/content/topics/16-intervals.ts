import type { TopicContent } from '../types'

export const intervalsTopic: TopicContent = {
  id: 'intervals',
  title: 'Intervals',
  order_index: 16,
  visualizer_id: null,
  summary: 'Master 1D coordinate ranges, interval merging, earliest-deadline scheduling, and concurrent room tracking with Min-Heaps.',
  eliExplain: {
    hook: 'Interval problems deal with chunks of time or ranges on a timeline (e.g. meetings from 9:00 to 10:30). The goal is usually to merge overlapping blocks, insert a new appointment, or count how many meeting rooms are needed at peak time.',
    analogy: 'Think of booking conference rooms on a shared calendar. If Meeting A is 1pm–3pm and Meeting B is 2pm–4pm, they overlap from 2pm–3pm and merge into one big blocked window (1pm–4pm), or require 2 simultaneous conference rooms.',
    keyIdeas: [
      'Golden Rule #1: ALWAYS sort intervals by start time (or sometimes end time) before doing anything else.',
      'Overlap condition: Two intervals `[s1, e1]` and `[s2, e2]` overlap if and only if `s2 <= e1` (the next meeting starts before the current one finishes).',
      'Merge Intervals: If overlapping, the merged interval ends at `max(e1, e2)`. If not overlapping, save current and move to next.',
      'Meeting Rooms II: Use a Min-Heap of meeting end times to track which room frees up earliest. The peak heap size equals the number of conference rooms required.',
      'Non-overlapping / Earliest Deadline First: Greedily pick intervals that end earliest to leave the maximum room for subsequent events.',
    ],
    oneliner: 'Sort intervals by start time first. If `next.start <= prev.end`, they overlap → merge with `max(prev.end, next.end)`.',
  },
  intuition: `### 1. The Core Mental Model: 1D Timeline Overlaps

An **Interval** is a continuous range \`[start, end]\` representing a span of time, a meeting, or a geometric segment.

The golden rule for solving 99% of interval problems:
> **Always sort the intervals first.**

Once intervals are sorted along the timeline:
- You only ever need to compare the **current interval** with the **immediately preceding interval**.
- Two sorted intervals A and B (where \`A.start <= B.start\`) **overlap if and only if**:
  \`B.start <= A.end\`

When they overlap, their merged interval becomes:
\`\`\`
[ A.start, max(A.end, B.end) ]
\`\`\`

---

### 2. Comparison: Sorting by Start vs. Sorting by End vs. Line Sweep

| Strategy | When To Use | Key Invariant |
| :--- | :--- | :--- |
| **Sort by \`start\`** | Merging overlapping intervals (*Merge Intervals*, *Insert Interval*) | New intervals only extend or start a fresh cluster. |
| **Sort by \`end\`** | Minimizing removals / Maximizing non-overlapping meetings (*Erase Overlap Intervals*) | Greedily pick the meeting that **finishes earliest** to leave maximum room for future events. |
| **Min-Heap of \`end\` Times** | Tracking concurrent rooms / resources (*Meeting Rooms II*) | The root of the Min-Heap tells you the earliest a room becomes free. |
| **Chronological Line Sweep** | Counting simultaneous peaks across discrete start/end events | $+1$ on event start, $-1$ on event end, sorted along timeline. |`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: Linear Overlap Merging
- **Giveaway**: *"Merge all overlapping intervals"*, *"Insert new interval into sorted non-overlapping list"*.
- **Strategy**: Sort by \`start\`. Initialize \`merged = [intervals[0]]\`. For each interval: if \`curr.start <= merged[-1].end\`, merge by updating \`merged[-1].end = max(merged[-1].end, curr.end)\`; else append \`curr\`.
- **Top Problems**: *Merge Intervals*, *Insert Interval*.
- **Likely follow-up**: *"How to do Insert Interval in O(N) without re-sorting?"* — 3 sequential passes: (1) add all intervals ending before \`newInterval\`, (2) merge all overlapping intervals, (3) add all intervals starting after \`newInterval\`.

#### Pattern 2: Earliest Deadline First (Erase Overlap Intervals)
- **Giveaway**: *"Find minimum number of intervals to remove to make the rest non-overlapping"*.
- **Strategy**: Sort by **\`end\` time**. Keep the interval that ends earliest. If the next interval starts before the current one ends, it must be removed.
- **Top Problems**: *Non-overlapping Intervals*.
- **Likely follow-up**: *"Why sort by end time instead of start time?"* — finishing earlier leaves the maximum possible remaining timeline open for subsequent intervals.

#### Pattern 3: Concurrent Resource Tracking (Meeting Rooms II)
- **Giveaway**: *"Minimum number of conference rooms required"*.
- **Strategy**: Sort meetings by \`start\`. Maintain a **Min-Heap of end times**. For each meeting: if \`meeting.start >= heap[0]\` (a room has freed up), \`heappop(heap)\`. Push current \`meeting.end\`. The maximum size of the heap is the answer!
- **Top Problems**: *Meeting Rooms*, *Meeting Rooms II*.
- **Likely follow-up**: *"What is the Line Sweep alternative?"* — separate starts and ends into two sorted arrays; walk two pointers, incrementing rooms on start and decrementing on end.

#### Pattern 4: Sorted Query Sweep with Min-Heap
- **Giveaway**: *"Minimum interval to include each query"*.
- **Strategy**: Sort queries while preserving original indices. Process intervals in order of start time, pushing \`(size, end)\` to a Min-Heap. Discard expired intervals where \`end < query\` from the heap.
- **Top Problems**: *Minimum Interval to Include Each Query*.
- **Likely follow-up**: *"Why does this beat binary search per query?"* — sorting queries allows each interval to enter and exit the heap at most once ($O((N + Q) \log N)$).`,
  workedExample: {
    title: 'Meeting Rooms II (Min-Heap Active Room Allocation)',
    problem: `Given an array of meeting time intervals \`intervals\` where \`intervals[i] = [start, end]\`, return the **minimum number of conference rooms** required.

- **Strategy**: Sort meetings by start time. Use a Min-Heap to store the end times of active meetings.
- For each meeting, check if the earliest-ending meeting has finished (\`start >= min_heap[0]\`). If so, reuse that room (pop it). Then push the current meeting's end time.
- The heap size at the end represents the number of rooms needed.`,
    code: {
      language: 'python',
      snippet: `import heapq

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    if not intervals:
        return 0

    # 1. Sort meetings by start time
    intervals.sort(key=lambda x: x[0])

    # 2. Min-Heap of active meeting end times
    rooms = []  # stores end times

    for start, end in intervals:
        # If the earliest ending meeting finished before or when current meeting starts, reuse room
        if rooms and start >= rooms[0]:
            heapq.heappop(rooms)

        # Allocate room for current meeting
        heapq.heappush(rooms, end)

    return len(rooms)`,
    },
    explanation: `Trace with intervals = [[0, 30], [5, 10], [15, 20]]:
1. Sort by start: [[0, 30], [5, 10], [15, 20]].
2. [0, 30]: Heap = [30]. Rooms = 1.
3. [5, 10]: start 5 < min_end 30 -> cannot reuse. Push 10. Heap = [10, 30]. Rooms = 2.
4. [15, 20]: start 15 >= min_end 10 -> REUSE ROOM! Pop 10, push 20. Heap = [20, 30].
Final rooms = len(rooms) = 2.
Time: O(N log N), Space: O(N).`,
  },
  complexity: {
    time: 'O(N log N)',
    timeDetail: 'Sorting the N intervals dominates the runtime. The subsequent heap and sweep operations run in linear or O(N log N) time.',
    space: 'O(N)',
    spaceDetail: 'Storage for the sorted intervals, output lists, or priority queue of active end times.',
  },
  commonMistakes: `1. **Mutating Intervals Without Sorting First**:
   Assuming input intervals are given in chronological order. Always call \`intervals.sort(key=lambda x: x[0])\` first.

2. **Strict Inequality on Adjacent Endpoints**:
   If a meeting ends at 10 and another starts at 10 (\`[5, 10]\` and \`[10, 20]\`), they **do not conflict** in room scheduling (\`start >= rooms[0]\` is valid). For merging intervals, \`curr.start <= prev.end\` means they merge into \`[5, 20]\`. Do not mix up \`<=\` and \`<\`!

3. **Sorting by the Wrong Dimension in Erase Overlap**:
   In *Non-Overlapping Intervals*, sorting by \`start\` time can lead to picking a very long meeting that overlaps multiple short ones. You must sort by **\`end\` time** to greedily maximize remaining time.

4. **Forgetting to Push the Last Merged Interval**:
   When accumulating merged intervals in a separate variable instead of a running array \`merged\`, forgetting to append the final open interval after loop termination loses the last segment.`,
  gotchas: [
    'Merge Intervals: sort by start, check `curr[0] <= prev[1]`, merge with `prev[1] = max(prev[1], curr[1])`.',
    'Erase Overlap Intervals: sort by end time to greedily free up timeline earliest.',
    'Meeting Rooms II: Min-Heap of end times tracks concurrent rooms in O(N log N) time.',
    'Insert Interval: solve in O(N) by splitting into left (before), overlapping (merge), and right (after).',
  ],
  problems: [
    { id: 'meeting-rooms', title: 'Meeting Rooms', slug: 'meeting-rooms', difficulty: 'easy' },
    { id: 'insert-interval', title: 'Insert Interval', slug: 'insert-interval', difficulty: 'medium' },
    { id: 'merge-intervals', title: 'Merge Intervals', slug: 'merge-intervals', difficulty: 'medium' },
    { id: 'non-overlapping-intervals', title: 'Non-overlapping Intervals', slug: 'non-overlapping-intervals', difficulty: 'medium' },
    { id: 'meeting-rooms-ii', title: 'Meeting Rooms II', slug: 'meeting-rooms-ii', difficulty: 'medium' },
  ],
}
