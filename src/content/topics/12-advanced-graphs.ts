import type { TopicContent } from '../types'

export const advancedGraphsTopic: TopicContent = {
  id: 'advanced-graphs',
  title: 'Advanced Graphs',
  order_index: 12,
  visualizer_id: null,
  summary: 'Dijkstra shortest paths on weighted graphs, Union-Find (DSU) cycle detection, and Minimum Spanning Trees.',
  intuition: `### 1. The Core Mental Model: Weighted Graphs & Connectivity

When edges have **weights / costs**, plain BFS cannot find the shortest path because the path with the fewest edges might have a much higher total weight.

To solve weighted graph problems, master these three foundational tools:
1. **Dijkstra's Algorithm**: Finds the shortest path from a source to all vertices on graphs with **non-negative weights** using a **Min-Heap** in \`O((V + E) log V)\` time.
2. **Disjoint Set Union (DSU / Union-Find)**: Manages dynamic connectivity and detects cycles in undirected graphs in **near-\`O(1)\` amortized time** per query.
3. **Minimum Spanning Tree (MST)**: Connects all $V$ vertices using $V - 1$ edges with minimum total weight (via **Prim's** or **Kruskal's** algorithm).

---

### 2. Disjoint Set Union (DSU) In Plain English

DSU maintains a set of elements partitioned into non-overlapping groups. Each group has a designated "leader" or "representative".

- **\`find(x)\`**: Finds the root representative of the set containing \`x\`. With **Path Compression**, all visited nodes are re-linked directly to the root, making future lookups \`O(1)\`.
- **\`union(x, y)\`**: Combines the sets containing \`x\` and \`y\`. With **Union by Rank/Size**, the smaller tree is attached under the root of the larger tree to keep heights flat.
- **Cycle Detection**: If \`find(x) == find(y)\`, nodes \`x\` and \`y\` are *already in the same connected component*. Adding an edge between them **creates a cycle**!

---

### 3. Comparison: Shortest Path & Connectivity Algorithms

| Algorithm | Problem Solved | Weights Allowed | Time Complexity |
| :--- | :--- | :--- | :--- |
| **BFS** | Shortest path (unweighted) | Unweighted (all cost 1) | \`O(V + E)\` |
| **Dijkstra** | Single-source shortest path | Non-negative ($\ge 0$) only | \`O((V + E) log V)\` |
| **Bellman-Ford** | Single-source shortest path | Negative weights allowed | \`O(V × E)\` |
| **Union-Find (DSU)** | Dynamic connectivity / Cycle check | Undirected graphs | \`O(α(V)) ≈ O(1)\` |
| **Kruskal's MST** | Minimum Spanning Tree | Any weights | \`O(E log E)\` |`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: Non-Negative Weighted Shortest Path (Dijkstra)
- **Giveaway**: *"Find minimum time / cost to travel between nodes on weighted network"*, *"Path with maximum probability"*.
- **Strategy**: Maintain \`min_heap\` of \`(cost_so_far, node)\` and a \`dist = {node: float('inf')}\` map. Pop minimum cost, skip if \`cost > dist[node]\`, relax neighbors by pushing \`(cost + weight, neighbor)\`.
- **Top Problems**: *Network Delay Time*, *Swim in Rising Water*, *Path with Maximum Probability*.
- **Likely follow-up**: *"Why can't Dijkstra handle negative weights?"* — Dijkstra greedily locks in a node's distance the moment it is popped from the heap. A negative edge encountered later could invalidate this, which requires Bellman-Ford.

#### Pattern 2: DSU Cycle Detection & Redundant Edge Removal
- **Giveaway**: *"Find redundant connection in tree"*, *"Graph valid tree"*, *"Number of connected components"*.
- **Strategy**: Initialize DSU for $N$ nodes. Iterate through edges: if \`union(u, v)\` returns \`False\` (meaning \`find(u) == find(v)\`), you found the cycle / redundant edge!
- **Top Problems**: *Redundant Connection*, *Graph Valid Tree*, *Number of Connected Components in an Undirected Graph*.
- **Likely follow-up**: *"What is the time complexity of DSU?"* — $O(\alpha(V))$ per operation, where $\alpha$ is the inverse Ackermann function ($\alpha(N) < 5$ for all realistic $N$).

#### Pattern 3: Minimum Spanning Tree (Kruskal's vs. Prim's)
- **Giveaway**: *"Min cost to connect all points"*, *"Connect cities with minimum cost"*.
- **Strategy**:
  - **Kruskal**: Compute all edge distances, sort edges ascending, use DSU to add edges that do not form cycles until $V - 1$ edges are picked.
  - **Prim**: Start at node 0, maintain Min-Heap of edges leaving current visited set.
- **Top Problems**: *Min Cost to Connect All Points*.
- **Likely follow-up**: *"Which MST algorithm is better for dense graphs?"* — Prim's with adjacency matrix/heap ($O(V^2)$) is better on dense graphs where $E \approx V^2$; Kruskal is preferred on edge lists.

#### Pattern 4: State-Expanded Dijkstra / Bounded Hops
- **Giveaway**: *"Cheapest flights within K stops"*.
- **Strategy**: Expand the state tracked in the queue to \`(cost, node, stops_used)\`, or use Bellman-Ford run for $K + 1$ relaxations.
- **Top Problems**: *Cheapest Flights Within K Stops*.
- **Likely follow-up**: *"Why does plain Dijkstra fail with K stops?"* — a cheaper path might use too many stops, so we cannot discard paths with higher cost but fewer stops.`,
  workedExample: {
    title: 'Network Delay Time (Dijkstra\'s Algorithm)',
    problem: `You are given a network of \`n\` nodes labeled \`1\` to \`n\` and a list of travel times \`times[i] = (u, v, w)\` where \`w\` is the travel time from \`u\` to \`v\`.
We send a signal from node \`k\`. Return the **minimum time** required for all \`n\` nodes to receive the signal. If it is impossible, return \`-1\`.`,
    code: {
      language: 'python',
      snippet: `from collections import defaultdict
import heapq

def network_delay_time(times: list[list[int]], n: int, k: int) -> int:
    adj = defaultdict(list)
    for u, v, w in times:
        adj[u].append((v, w))

    # Min-Heap of (distance_from_source, node)
    min_heap = [(0, k)]
    visited = {}

    while min_heap:
        d, u = heapq.heappop(min_heap)

        if u in visited:
            continue
        visited[u] = d

        for v, weight in adj[u]:
            if v not in visited:
                heapq.heappush(min_heap, (d + weight, v))

    # If all n nodes received the signal, return the max arrival time
    return max(visited.values()) if len(visited) == n else -1`,
    },
    explanation: `Trace on times = [[2,1,1],[2,3,1],[3,4,1]], n = 4, k = 2:
1. Heap starts with [(0, 2)].
2. Pop (0, 2): visited[2] = 0. Push neighbors (1, 1) and (1, 3).
3. Pop (1, 1): visited[1] = 1.
4. Pop (1, 3): visited[3] = 1. Push neighbor (2, 4).
5. Pop (2, 4): visited[4] = 2.
Visited = {2: 0, 1: 1, 3: 1, 4: 2}. len(visited) == 4. Max time = 2.
Time: O(E log V), Space: O(V + E).`,
  },
  complexity: {
    time: 'O((V + E) log V)',
    timeDetail: 'Every vertex is pushed to and popped from the Min-Heap at most once, and all edges are relaxed in logarithmic time.',
    space: 'O(V + E)',
    spaceDetail: 'Storage for the adjacency list graph, visited distances dictionary, and priority queue.',
  },
  commonMistakes: `1. **Forgetting to Skip Stale Heap Entries in Dijkstra**:
   Because elements are added to the heap whenever a shorter path is found, older, longer paths remain in the heap. If you forget \`if u in visited: continue\` (or \`if d > dist[u]: continue\`), you will re-evaluate vertices multiple times and degrade performance.

2. **Omitting Path Compression in DSU**:
   Writing \`def find(x): return x if parent[x] == x else find(parent[x])\` without reassigning \`parent[x] = find(parent[x])\` degrades tree lookup from $\approx O(1)$ to $O(V)$, causing Time Limit Exceeded on skewed inputs.

3. **Running Dijkstra on Negative Weights**:
   Dijkstra assumes distances to popped nodes are permanent. A negative weight can shorten a previously finalized distance, producing incorrect results or infinite loops.

4. **1-Indexed vs. 0-Indexed Vertex Offsets**:
   Many graph problems label nodes from $1$ to $N$ rather than $0$ to $N-1$. Failing to size DSU arrays as \`N + 1\` causes \`IndexError\`.`,
  gotchas: [
    'Dijkstra uses Min-Heap of (distance, node) to greedily expand the closest unvisited node.',
    'DSU template: find with path compression (`parent[x] = find(parent[x])`) + union by rank.',
    'Redundant Connection: the first edge where `find(u) == find(v)` is the cycle-causing edge.',
    'Min Cost to Connect All Points: complete graph with N(N-1)/2 Manhattan distances is solved with Prim or Kruskal.',
  ],
  problems: [
    { id: 'network-delay-time', title: 'Network Delay Time', slug: 'network-delay-time', difficulty: 'medium' },
    { id: 'path-with-maximum-probability', title: 'Path with Maximum Probability', slug: 'path-with-maximum-probability', difficulty: 'medium' },
    { id: 'min-cost-to-connect-all-points', title: 'Min Cost to Connect All Points', slug: 'min-cost-to-connect-all-points', difficulty: 'medium' },
    { id: 'redundant-connection', title: 'Redundant Connection', slug: 'redundant-connection', difficulty: 'medium' },
    { id: 'graph-valid-tree', title: 'Graph Valid Tree', slug: 'graph-valid-tree', difficulty: 'medium' },
    { id: 'number-of-connected-components-in-an-undirected-graph', title: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'medium' },
    { id: 'cheapest-flights-within-k-stops', title: 'Cheapest Flights Within K Stops', slug: 'cheapest-flights-within-k-stops', difficulty: 'medium' },
    { id: 'swim-in-rising-water', title: 'Swim in Rising Water', slug: 'swim-in-rising-water', difficulty: 'hard' },
    { id: 'alien-dictionary', title: 'Alien Dictionary', slug: 'alien-dictionary', difficulty: 'hard' },
    { id: 'reconstruct-itinerary', title: 'Reconstruct Itinerary', slug: 'reconstruct-itinerary', difficulty: 'hard' },
  ],
}
