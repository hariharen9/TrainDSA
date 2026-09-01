import type { TopicContent } from '../types'

export const graphsTopic: TopicContent = {
  id: 'graphs',
  title: 'Graphs',
  order_index: 11,
  visualizer_id: 'graphs',
  summary: 'Master Adjacency Lists, 2D Grid Flood Fills, BFS Shortest Paths, and Kahn\'s Topological Sorting.',
  eliExplain: {
    hook: 'A Graph is a network of nodes connected by links. Unlike trees, graphs can have loops (cycles) and any node can connect to any other node. You search graphs to find connections, shortest routes, or connected islands of data.',
    analogy: 'Think of social media or flight routes. Each person or airport is a node (vertex), and friendships or direct flights are lines (edges). To find if six degrees of separation connects you to someone, or the fewest flight layovers between cities, you traverse a graph.',
    keyIdeas: [
      'Representing graphs: Convert edge lists into an Adjacency List (a dictionary mapping each node to its list of neighbors) for instant O(1) neighbor lookups.',
      'Visited Set is mandatory: Because graphs have cycles, always track `visited` nodes to avoid infinite loops.',
      'BFS (Queue): Explores in concentric ripples. Guarantees the shortest path in unweighted graphs.',
      'DFS (Recursion / Stack): Explores deeply down one path to the end. Best for finding connected components, detecting cycles, or flood-filling 2D grids (like Island counting).',
      'Topological Sort (Kahn\'s Algorithm): Orders tasks with prerequisites (directed acyclic graphs / DAGs) from start to finish.',
    ],
    oneliner: 'Unweighted shortest path = BFS with a Queue. Connected regions / island counting / cycle checks = DFS with a Visited set.',
  },
  intuition: `### 1. The Core Mental Model: Vertices & Edges

A **Graph** $G = (V, E)$ represents a network of entities (Vertices) connected by relationships (Edges). 

In coding interviews, graphs appear in two primary formats:
1. **Explicit Graphs**: Given as edge lists (e.g. \`[[0, 1], [1, 2]]\`). Always convert these into an **Adjacency List** (\`collections.defaultdict(list)\`) for \`O(V + E)\` traversal.
2. **Implicit 2D Grids**: A matrix where every cell \`(r, c)\` is a vertex, and valid adjacent cells \`(r±1, c±1)\` are edges.

---

### 2. BFS vs. DFS: When to Use Which?

- **Breadth-First Search (BFS)**: Explores outward in concentric rings using a queue. **Guarantees the shortest path in unweighted graphs** (fewest edges or minutes elapsed).
- **Depth-First Search (DFS)**: Dives deeply along a single path using recursion or a stack. Best for **connected component counting**, **flood fills**, **exhaustive path finding**, and **cycle detection**.

---

### 3. Topological Sort (Dependency Resolution)

A **Directed Acyclic Graph (DAG)** represents tasks with prerequisites. A **Topological Sort** arranges vertices in a linear order such that for every directed edge $u \to v$, task $u$ comes before $v$.

**Kahn's Algorithm (BFS In-Degree)**:
1. Count the \`in_degree\` (incoming prerequisites) for every node.
2. Push all nodes with \`in_degree == 0\` into a queue.
3. Pop a node, append to ordering, and decrement the \`in_degree\` of all its neighbors.
4. If a neighbor's \`in_degree\` reaches \`0\`, push it into the queue.
5. If total processed nodes $< V$, **a cycle exists** (e.g. circular course requirements).`,
  patternRecognition: `### The 4 Essential Interview Patterns

#### Pattern 1: 2D Grid Flood Fill & Island Counting
- **Giveaway**: *"Number of islands"*, *"Max area of island"*, *"Pacific Atlantic water flow"*, *"Surrounded regions"*.
- **Strategy**: Iterate through every cell. When unvisited land is found, trigger DFS/BFS to visit and sink/mark all 4-directionally connected land cells.
- **Top Problems**: *Number of Islands*, *Max Area of Island*, *Pacific Atlantic Water Flow*.
- **Likely follow-up**: *"Can you do it without extra memory?"* — mutate visited land cells directly into water (\`grid[r][c] = '0'\`) to achieve $O(1)$ extra space beyond recursion stack.

#### Pattern 2: Multi-Source BFS for Shortest Time / Distance
- **Giveaway**: *"Rotting oranges"*, *"Walls and Gates"*, *"Word Ladder"*, *"Shortest path in binary matrix"*.
- **Strategy**: Initialize queue with **all initial sources simultaneously** (e.g. all rotten oranges at minute 0). Expand 1 level per step so the wavefront propagates uniformly.
- **Top Problems**: *Rotting Oranges*, *Walls and Gates*, *Word Ladder*.
- **Likely follow-up**: *"Why does regular DFS fail for shortest path?"* — DFS visits deep paths first, requiring checking all paths to find the minimum; BFS finds the minimum on its first arrival.

#### Pattern 3: Topological Sort on Dependency DAGs
- **Giveaway**: *"Course Schedule"*, *"Alien Dictionary"*, *"Minimum height trees"*, *"Sequence reconstruction"*.
- **Strategy**: Build adjacency list + \`in_degree\` map. Run Kahn's algorithm with a queue. If output length matches $V$, schedule is valid; otherwise cycle detected.
- **Top Problems**: *Course Schedule*, *Course Schedule II*, *Alien Dictionary*.
- **Likely follow-up**: *"What if there are multiple valid topological orders?"* — any valid topological order is acceptable unless asked for lexicographical order (use a Min-Heap instead of a queue).

#### Pattern 4: Clone Graph / Graph Transformation
- **Giveaway**: *"Clone an undirected graph with cycles"*.
- **Strategy**: Use DFS or BFS paired with a hash map \`{old_node: new_node}\` to clone vertices and prevent infinite cycles.
- **Top Problems**: *Clone Graph*.
- **Likely follow-up**: *"How to handle deep copies of cyclic references?"* — check map before cloning; if node already in map, return existing clone.`,
  workedExample: {
    title: 'Course Schedule (Kahn\'s BFS Topological Sort)',
    problem: `There are a total of \`numCourses\` courses to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [a, b]\` indicates that you must take course \`b\` first if you want to take course \`a\` (edge $b \to a$).
Return \`True\` if you can finish all courses, or \`False\` if there is a cycle.`,
    code: {
      language: 'python',
      snippet: `from collections import defaultdict, deque

def can_finish(numCourses: int, prerequisites: list[list[int]]) -> bool:
    adj = defaultdict(list)
    in_degree = [0] * numCourses

    # Build adjacency list: b -> a (must take b before a)
    for crs, prereq in prerequisites:
        adj[prereq].append(crs)
        in_degree[crs] += 1

    # Queue all courses that have 0 prerequisites
    queue = deque([i for i in range(numCourses) if in_degree[i] == 0])
    completed_count = 0

    while queue:
        node = queue.popleft()
        completed_count += 1

        for neighbor in adj[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)

    # If we completed all courses, no cycle exists
    return completed_count == numCourses`,
    },
    explanation: `Trace on numCourses = 4, prerequisites = [[1,0], [2,0], [3,1], [3,2]]:
1. In-degrees: [0:0, 1:1, 2:1, 3:2]. Adj: {0: [1, 2], 1: [3], 2: [3]}.
2. Queue starts with [0].
3. Pop 0 -> completed=1. Decrement in-degree of 1 and 2 to 0 -> queue = [1, 2].
4. Pop 1 -> completed=2. Decrement in-degree of 3 (becomes 1).
5. Pop 2 -> completed=3. Decrement in-degree of 3 (becomes 0) -> queue = [3].
6. Pop 3 -> completed=4.
completed_count (4) == numCourses (4) -> Returns True!
Time: O(V + E), Space: O(V + E).`,
  },
  complexity: {
    time: 'O(V + E)',
    timeDetail: 'V is the number of vertices and E is the number of edges. Every vertex and edge is processed at most once.',
    space: 'O(V + E)',
    spaceDetail: 'Storage for the adjacency list, in-degree arrays, visited sets, and BFS queues.',
  },
  commonMistakes: `1. **Marking Visited on Pop Instead of Push in BFS**:
   In BFS, if you mark a node as visited when *popping* it from the queue rather than when *pushing* it, neighboring nodes will push the same vertex dozens of times. This causes exponential queue bloat and Memory Limit Exceeded (MLE). **Always mark visited immediately upon pushing!**

2. **Reversing the Prerequisite Edge Direction**:
   In Course Schedule, \`[a, b]\` means $b$ is the prerequisite for $a$ ($b \to a$). Drawing the edge as $a \to b$ inverts the in-degrees and breaks the topological order.

3. **Missing Disconnected Components in Graphs**:
   Assuming a single DFS/BFS from node 0 visits the entire graph fails when the graph has multiple disconnected components or islands. You must loop through all vertices \`for i in range(numCourses):\` to launch searches on unvisited nodes.

4. **Grid Out-of-Bounds Checks in Wrong Order**:
   Writing \`if grid[r][c] == '1' and 0 <= r < rows:\` crashes with an \`IndexError\`. Always place coordinate bounds checks *before* accessing matrix indices.`,
  gotchas: [
    'BFS is the only algorithm that guarantees the shortest path in unweighted graphs.',
    'Always mark grid cells visited immediately upon enqueueing in BFS.',
    'Grid direction template: `DIRS = [(0, 1), (0, -1), (1, 0), (-1, 0)]`.',
    'Kahn\'s algorithm detects directed cycles if `processed_count < num_vertices`.',
    'Undirected cycle detection requires passing a `parent` node to avoid mistaking the inbound edge for a cycle.',
  ],
  problems: [
    { id: 'number-of-islands', title: 'Number of Islands', slug: 'number-of-islands', difficulty: 'medium' },
    { id: 'clone-graph', title: 'Clone Graph', slug: 'clone-graph', difficulty: 'medium' },
    { id: 'rotting-oranges', title: 'Rotting Oranges', slug: 'rotting-oranges', difficulty: 'medium' },
    { id: 'pacific-atlantic-water-flow', title: 'Pacific Atlantic Water Flow', slug: 'pacific-atlantic-water-flow', difficulty: 'medium' },
    { id: 'course-schedule', title: 'Course Schedule', slug: 'course-schedule', difficulty: 'medium' },
    { id: 'graph-valid-tree', title: 'Graph Valid Tree', slug: 'graph-valid-tree', difficulty: 'medium' },
    { id: 'number-of-connected-components-in-an-undirected-graph', title: 'Number of Connected Components in an Undirected Graph', slug: 'number-of-connected-components-in-an-undirected-graph', difficulty: 'medium' },
    { id: 'word-ladder', title: 'Word Ladder', slug: 'word-ladder', difficulty: 'hard' },
    { id: 'alien-dictionary', title: 'Alien Dictionary', slug: 'alien-dictionary', difficulty: 'hard' },
  ],
}
