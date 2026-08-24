import { useState, type ReactNode } from 'react'
import { Copy, Check, BookOpen, Terminal, Code2, Zap, Layers, Binary } from 'lucide-react'

type Section = 'python' | 'cpp' | 'java' | 'templates' | 'complexity'

const PYTHON_SNIPPETS = {
  heap: `import heapq

# Min-heap by default
heap = []
heapq.heappush(heap, 5)
heapq.heappush(heap, 1)
smallest = heapq.heappop(heap) # 1

# Convert list in-place O(N)
nums = [4, 1, 7, 3, 8]
heapq.heapify(nums)

# Max-heap trick (invert values)
max_heap = []
heapq.heappush(max_heap, -val)
largest = -heapq.heappop(max_heap)

# Heap of Tuples (priority, data)
heapq.heappush(heap, (dist, node))`,

  collections: `from collections import defaultdict, Counter, deque

# 1. Frequency Map
count = Counter("banana")

# 2. Defaultdict (Graph adjacency list)
graph = defaultdict(list)
graph[u].append(v)
int_map = defaultdict(int) # defaults to 0

# 3. Double-ended Queue (O(1) push/pop both ends)
q = deque([1, 2, 3])
q.append(4)
first = q.popleft() # 1`,

  bisect: `import bisect

arr = [1, 2, 4, 4, 4, 7, 9]

# First index where element >= x (lower_bound)
idx_left = bisect.bisect_left(arr, 4) # 2

# First index where element > x (upper_bound)
idx_right = bisect.bisect_right(arr, 4) # 5

# Insert while maintaining sorted order
bisect.insort(arr, 5)`,

  matrix: `# Safe 2D Matrix Init (rows x cols)
matrix = [[0] * cols for _ in range(rows)]
# NOTE: Avoid [[0] * cols] * rows as it shares row references

# 4-Directional Grid Moves
DIRS = [(0, 1), (0, -1), (1, 0), (-1, 0)]
for dr, dc in DIRS:
    nr, nc = r + dr, c + dc
    if 0 <= nr < rows and 0 <= nc < cols:
        ...

# Custom Sorting (multi-key)
# Sort by ascending start, then descending end:
intervals.sort(key=lambda x: (x[0], -x[1]))`,
}

const CPP_SNIPPETS = {
  pq: `#include <queue>
#include <vector>

// 1. Max-heap (default)
std::priority_queue<int> max_pq;
max_pq.push(10);
int top = max_pq.top(); max_pq.pop();

// 2. Min-heap
std::priority_queue<int, std::vector<int>, std::greater<int>> min_pq;

// 3. Custom Comparator with Struct
struct Compare {
    bool operator()(const pair<int, int>& a, const pair<int, int>& b) {
        return a.second > b.second; // min-heap on second element
    }
};
std::priority_queue<pair<int, int>, vector<pair<int, int>>, Compare> pq;`,

  bs: `#include <algorithm>
#include <vector>

vector<int> arr = {1, 2, 4, 4, 4, 7, 9};

// lower_bound: first element >= 4
auto it1 = lower_bound(arr.begin(), arr.end(), 4);
int idx1 = it1 - arr.begin(); // 2

// upper_bound: first element > 4
auto it2 = upper_bound(arr.begin(), arr.end(), 4);
int idx2 = it2 - arr.begin(); // 5

// Check if element exists:
bool exists = binary_search(arr.begin(), arr.end(), 4);`,

  map: `#include <unordered_map>
#include <unordered_set>
#include <algorithm>

// Hash map & Set (O(1) average)
unordered_map<string, int> count;
count["apple"]++;
if (count.find("apple") != count.end()) { ... }

// Lambda custom sort
sort(intervals.begin(), intervals.end(), [](const auto& a, const auto& b) {
    if (a[0] != b[0]) return a[0] < b[0];
    return a[1] > b[1];
});`,

  io: `// Place in main() or constructor for competitive speed:
ios_base::sync_with_stdio(false);
cin.tie(NULL);

// Standard Constants
const int INF = 1e9;
const long long LINF = 1e18;
const int MOD = 1e9 + 7;`,
}

const JAVA_SNIPPETS = {
  pq: `import java.util.*;

// 1. Min-heap (default)
PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(5);
int smallest = minHeap.poll();

// 2. Max-heap
PriorityQueue<Integer> maxHeap = new PriorityQueue<>(Collections.reverseOrder());

// 3. Custom Comparator on Object/Array
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> Integer.compare(a[1], b[1]));`,

  ds: `// 1. Frequency Map with getOrDefault
Map<String, Integer> map = new HashMap<>();
map.put(key, map.getOrDefault(key, 0) + 1);

// 2. Stack & Queue with ArrayDeque (faster than Stack class)
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);
int top = stack.pop();

Deque<Integer> queue = new ArrayDeque<>();
queue.offer(1);
int front = queue.poll();

// 3. Sorting 2D Arrays
Arrays.sort(intervals, (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(b[1], a[1]));`,
}

const TEMPLATE_SNIPPETS = {
  bs: `def binary_search_predicate(lo, hi):
    """
    Finds the minimum value where is_valid(mid) == True.
    Search space invariant: [lo, hi]
    """
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if is_valid(mid):
            hi = mid       # mid could be the answer, keep in range
        else:
            lo = mid + 1   # mid is impossible, exclude
    return lo              # lo == hi is the boundary answer`,

  sw: `def sliding_window(nums, k):
    left = 0
    curr_state = ...
    best = 0

    for right in range(len(nums)):
        # 1. Expand right end into window
        curr_state += nums[right]

        # 2. Shrink left end while invalid
        while not is_valid(curr_state):
            curr_state -= nums[left]
            left += 1

        # 3. Update answer
        best = max(best, right - left + 1)

    return best`,

  dsu: `class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [1] * n
        self.components = n

    def find(self, i):
        # Path compression
        if self.parent[i] != i:
            self.parent[i] = self.find(self.parent[i])
        return self.parent[i]

    def union(self, i, j):
        root_i = self.find(i)
        root_j = self.find(j)
        if root_i == root_j:
            return False # already in same set (cycle detected)

        # Union by rank
        if self.rank[root_i] < self.rank[root_j]:
            self.parent[root_i] = root_j
        elif self.rank[root_i] > self.rank[root_j]:
            self.parent[root_j] = root_i
        else:
            self.parent[root_j] = root_i
            self.rank[root_i] += 1

        self.components -= 1
        return True`,

  topo: `from collections import deque, defaultdict

def topological_sort(num_nodes, edges):
    graph = defaultdict(list)
    in_degree = [0] * num_nodes

    for u, v in edges: # u -> v
        graph[u].append(v)
        in_degree[v] += 1

    queue = deque([i for i in range(num_nodes) if in_degree[i] == 0])
    topo_order = []

    while queue:
        node = queue.popleft()
        topo_order.append(node)

        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If topo_order contains all nodes, no cycle exists
    if len(topo_order) == num_nodes:
        return topo_order
    return [] # Cycle detected`,

  bt: `def backtrack(start_idx, current_path, res):
    # Base case / Goal reached
    if is_goal(current_path):
        res.append(list(current_path)) # Make a deep copy
        return

    for i in range(start_idx, len(candidates)):
        if should_prune(candidates[i]):
            continue

        # 1. Make choice
        current_path.append(candidates[i])

        # 2. Recurse
        backtrack(i + 1, current_path, res) # (or 'i' if element reuse allowed)

        # 3. Undo choice (Backtrack)
        current_path.pop()`,
}

export function CheatSheetPage() {
  const [activeTab, setActiveTab] = useState<Section>('python')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (key: string, text: string) => {
    void navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1800)
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-line bg-panel p-6 shadow-xs">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-semibold text-gold">
          <BookOpen className="size-4 text-gold" />
          <span>Quick Reference Cockpit</span>
        </div>
        <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">DSA Interview Cheat Sheet</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          High-yield syntax tricks, standard algorithm templates, and Big-O input size rules for Python, C++, and Java.
        </p>

        {/* Tab Navigation */}
        <div className="mt-6 flex flex-wrap gap-2 pt-2 border-t border-line/60">
          <TabButton
            active={activeTab === 'python'}
            onClick={() => setActiveTab('python')}
            icon={<Terminal className="size-4" />}
            label="Python 3"
          />
          <TabButton
            active={activeTab === 'cpp'}
            onClick={() => setActiveTab('cpp')}
            icon={<Code2 className="size-4" />}
            label="C++ STL"
          />
          <TabButton
            active={activeTab === 'java'}
            onClick={() => setActiveTab('java')}
            icon={<Code2 className="size-4" />}
            label="Java Collections"
          />
          <TabButton
            active={activeTab === 'templates'}
            onClick={() => setActiveTab('templates')}
            icon={<Layers className="size-4" />}
            label="Core Algorithm Templates"
          />
          <TabButton
            active={activeTab === 'complexity'}
            onClick={() => setActiveTab('complexity')}
            icon={<Zap className="size-4" />}
            label="Big-O & Constraints"
          />
        </div>
      </header>

      {/* PYTHON CHEATS */}
      {activeTab === 'python' && (
        <div className="grid gap-4 md:grid-cols-2">
          <SnippetCard
            title="Heap / Priority Queue (heapq)"
            code={PYTHON_SNIPPETS.heap}
            onCopy={(code) => copyToClipboard('py-heap', code)}
            isCopied={copiedKey === 'py-heap'}
          />

          <SnippetCard
            title="Collections (defaultdict, Counter, deque)"
            code={PYTHON_SNIPPETS.collections}
            onCopy={(code) => copyToClipboard('py-collections', code)}
            isCopied={copiedKey === 'py-collections'}
          />

          <SnippetCard
            title="Binary Search (bisect)"
            code={PYTHON_SNIPPETS.bisect}
            onCopy={(code) => copyToClipboard('py-bisect', code)}
            isCopied={copiedKey === 'py-bisect'}
          />

          <SnippetCard
            title="2D Matrix & Custom Sort"
            code={PYTHON_SNIPPETS.matrix}
            onCopy={(code) => copyToClipboard('py-matrix', code)}
            isCopied={copiedKey === 'py-matrix'}
          />
        </div>
      )}

      {/* C++ CHEATS */}
      {activeTab === 'cpp' && (
        <div className="grid gap-4 md:grid-cols-2">
          <SnippetCard
            title="C++ Priority Queue (Min & Max Heap)"
            code={CPP_SNIPPETS.pq}
            onCopy={(code) => copyToClipboard('cpp-pq', code)}
            isCopied={copiedKey === 'cpp-pq'}
          />

          <SnippetCard
            title="C++ Binary Search (lower_bound / upper_bound)"
            code={CPP_SNIPPETS.bs}
            onCopy={(code) => copyToClipboard('cpp-bs', code)}
            isCopied={copiedKey === 'cpp-bs'}
          />

          <SnippetCard
            title="C++ Unordered Map & Lambda Sort"
            code={CPP_SNIPPETS.map}
            onCopy={(code) => copyToClipboard('cpp-map', code)}
            isCopied={copiedKey === 'cpp-map'}
          />

          <SnippetCard
            title="C++ Fast I/O & Constants"
            code={CPP_SNIPPETS.io}
            onCopy={(code) => copyToClipboard('cpp-io', code)}
            isCopied={copiedKey === 'cpp-io'}
          />
        </div>
      )}

      {/* JAVA CHEATS */}
      {activeTab === 'java' && (
        <div className="grid gap-4 md:grid-cols-2">
          <SnippetCard
            title="Java PriorityQueue (Min & Max Heap)"
            code={JAVA_SNIPPETS.pq}
            onCopy={(code) => copyToClipboard('java-pq', code)}
            isCopied={copiedKey === 'java-pq'}
          />

          <SnippetCard
            title="Java Map, Deque & Array Sorting"
            code={JAVA_SNIPPETS.ds}
            onCopy={(code) => copyToClipboard('java-ds', code)}
            isCopied={copiedKey === 'java-ds'}
          />
        </div>
      )}

      {/* CORE ALGORITHM TEMPLATES */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <SnippetCard
            title="1. Binary Search — Answer-Range / Predicate Template"
            code={TEMPLATE_SNIPPETS.bs}
            onCopy={(code) => copyToClipboard('tmpl-bs', code)}
            isCopied={copiedKey === 'tmpl-bs'}
          />

          <SnippetCard
            title="2. Variable Sliding Window Template"
            code={TEMPLATE_SNIPPETS.sw}
            onCopy={(code) => copyToClipboard('tmpl-sw', code)}
            isCopied={copiedKey === 'tmpl-sw'}
          />

          <SnippetCard
            title="3. Union-Find (DSU with Path Compression & Rank)"
            code={TEMPLATE_SNIPPETS.dsu}
            onCopy={(code) => copyToClipboard('tmpl-dsu', code)}
            isCopied={copiedKey === 'tmpl-dsu'}
          />

          <SnippetCard
            title="4. Topological Sort (Kahn’s In-Degree Algorithm)"
            code={TEMPLATE_SNIPPETS.topo}
            onCopy={(code) => copyToClipboard('tmpl-topo', code)}
            isCopied={copiedKey === 'tmpl-topo'}
          />

          <SnippetCard
            title="5. Backtracking Skeleton"
            code={TEMPLATE_SNIPPETS.bt}
            onCopy={(code) => copyToClipboard('tmpl-bt', code)}
            isCopied={copiedKey === 'tmpl-bt'}
          />
        </div>
      )}

      {/* BIG-O & CONSTRAINTS */}
      {activeTab === 'complexity' && (
        <div className="space-y-5">
          <div className="rounded-3xl border border-line bg-panel p-6 shadow-xs">
            <h2 className="font-serif text-xl font-semibold text-ink">Interview Constraint Decoder</h2>
            <p className="text-xs text-muted mt-1">
              Look at the input constraints (N) in the problem description to immediately deduce the expected optimal time complexity!
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="border-b border-line text-muted uppercase tracking-wider">
                    <th className="py-2.5 px-3">Input Size (N)</th>
                    <th className="py-2.5 px-3">Target Time Complexity</th>
                    <th className="py-2.5 px-3">Likely Algorithm / Patterns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/60 text-ink">
                  <tr>
                    <td className="py-3 px-3 text-gold font-bold">N ≤ 10</td>
                    <td className="py-3 px-3 text-hard">O(N!) or O(N · N!)</td>
                    <td className="py-3 px-3 text-muted">Permutations, Travelling Salesperson (TSP)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-gold font-bold">N ≤ 20</td>
                    <td className="py-3 px-3 text-hard">O(2^N) or O(N · 2^N)</td>
                    <td className="py-3 px-3 text-muted">Subsets, Bitmask DP, Exponential Backtracking</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-gold font-bold">N ≤ 100</td>
                    <td className="py-3 px-3 text-medium">O(N^4) or O(N^3)</td>
                    <td className="py-3 px-3 text-muted">3-D DP, Floyd-Warshall All-Pairs Shortest Path</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-gold font-bold">N ≤ 1,000</td>
                    <td className="py-3 px-3 text-medium">O(N^2)</td>
                    <td className="py-3 px-3 text-muted">2-D DP (Edit Distance, LCS), Nested Loops, All Pairs</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-gold font-bold">N ≤ 100,000 … 10^6</td>
                    <td className="py-3 px-3 text-easy">O(N log N) or O(N)</td>
                    <td className="py-3 px-3 text-muted">Sorting, Binary Search, Sliding Window, Two Pointers, Monotonic Stack, Dijkstra</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-gold font-bold">N ≥ 10^9</td>
                    <td className="py-3 px-3 text-easy">O(log N) or O(1)</td>
                    <td className="py-3 px-3 text-muted">Binary Search on Answer, Math formulas, Bit Manipulation</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-line bg-panel p-6 shadow-xs">
            <h2 className="font-serif text-xl font-semibold text-ink flex items-center gap-2">
              <Binary className="size-5 text-gold" />
              <span>Bit Manipulation Quick Reference</span>
            </h2>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 text-xs font-mono">
              <div className="rounded-xl border border-line bg-panel-2 p-3 space-y-1">
                <span className="text-gold font-bold">n & (n - 1)</span>
                <p className="text-muted text-[11px]">Clears the lowest set bit (e.g. counting 1-bits in O(set bits)).</p>
              </div>

              <div className="rounded-xl border border-line bg-panel-2 p-3 space-y-1">
                <span className="text-gold font-bold">n & -n</span>
                <p className="text-muted text-[11px]">Extracts the lowest set bit (Binary Indexed Tree / Fenwick).</p>
              </div>

              <div className="rounded-xl border border-line bg-panel-2 p-3 space-y-1">
                <span className="text-gold font-bold">x ^ x = 0 & x ^ 0 = x</span>
                <p className="text-muted text-[11px]">XOR cancels matching pairs in O(N) time & O(1) space.</p>
              </div>

              <div className="rounded-xl border border-line bg-panel-2 p-3 space-y-1">
                <span className="text-gold font-bold">1 &lt;&lt; k</span>
                <p className="text-muted text-[11px]">Creates a mask with only the k-th bit set (2^k).</p>
              </div>
            </div>
          </div>
        </div>
      )}
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
  icon: ReactNode
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-medium transition cursor-pointer ${
        active
          ? 'bg-gold text-canvas font-semibold shadow-xs'
          : 'border border-line bg-panel-2 text-muted hover:text-ink hover:border-gold/30'
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  )
}

function SnippetCard({
  title,
  code,
  onCopy,
  isCopied,
}: {
  title: string
  code: string
  onCopy: (code: string) => void
  isCopied: boolean
}) {
  return (
    <div className="rounded-2xl border border-line bg-panel overflow-hidden shadow-xs">
      <div className="flex items-center justify-between border-b border-line px-4 py-2.5 bg-panel-2/60">
        <h3 className="text-xs font-semibold text-ink font-sans">{title}</h3>
        <button
          type="button"
          onClick={() => onCopy(code)}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted hover:text-gold transition cursor-pointer p-1"
          title="Copy to clipboard"
        >
          {isCopied ? (
            <>
              <Check className="size-3.5 text-easy" />
              <span className="text-easy">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-4 bg-canvas/60 overflow-x-auto">
        <pre className="text-xs font-mono text-ink/90 leading-relaxed">{code}</pre>
      </div>
    </div>
  )
}
