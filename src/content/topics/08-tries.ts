import type { TopicContent } from '../types'

export const triesTopic: TopicContent = {
  id: 'tries',
  title: 'Tries (Prefix Trees)',
  order_index: 8,
  visualizer_id: null,
  summary: 'Tree-based string index for instant O(L) prefix matching, auto-complete, and multi-word grid search pruning.',
  intuition: `### 1. The Core Mental Model: Character-by-Character Paths

A **Trie** (derived from re**trie**val, pronounced "try") is a multi-way search tree designed for strings.

Instead of storing entire words in separate buckets like a Hash Set, words that share common beginnings **share the exact same path of nodes**:

\`\`\`
          (root)
          /    \\
        'a'    'b'
        /        \\
      'p'        'a'
      /            \\
    'p' (is_end)   't' (is_end)
    /
  'l'
  /
'e' (is_end)
\`\`\`

- Path for \`"app"\`: \`root ➔ 'a' ➔ 'p' ➔ 'p'\` (marked \`is_end = True\`)
- Path for \`"apple"\`: continues down to \`'l' ➔ 'e'\` (marked \`is_end = True\`)

---

### 2. Why Use a Trie Over a Hash Set?

A Hash Set can check *"Does the exact word 'apple' exist?"* in \`O(L)\` time. However:
1. **Prefix Queries**: A Hash Set cannot answer *"Does any word begin with 'app'?"* without scanning all words. A Trie answers prefix queries in **\`O(L)\` time**, where $L$ is prefix length, completely independent of how many millions of words exist in the dictionary.
2. **Multi-Word Search Pruning**: When searching for words in a 2D Boggle grid (*Word Search II*), a Trie lets you abandon dead paths the instant a prefix has no matching child, avoiding exponential backtracking work.

---

### 3. Comparison: Hash Set vs. Trie

| Dimension | Hash Set (\`set[str]\`) | Trie (\`TrieNode\`) |
| :--- | :--- | :--- |
| **Exact Word Lookup** | \`O(L)\` average | \`O(L)\` guaranteed |
| **Prefix Matching (\`startsWith\`)** | \`O(N × L)\` (must scan all) | \`O(L)\` instant traversal |
| **Autocomplete / Common Prefix** | Slow & memory intensive | Natural tree traversal |
| **Memory Usage** | \`O(N × L)\` | \`O(alphabet × N × L)\` (shared prefixes reduce practical size) |`,
  patternRecognition: `### The 3 Essential Interview Patterns

#### Pattern 1: Standard Prefix Storage & Autocomplete
- **Giveaway**: *"Implement prefix tree"*, *"Check if any word starts with prefix"*, *"Autocomplete suggestions"*.
- **Strategy**: Define \`TrieNode\` with \`children = {}\` (or \`[None] * 26\`) and boolean \`is_end = False\`. Walk node-by-node.
- **Top Problems**: *Implement Trie (Prefix Tree)*, *Design Add and Search Words Data Structure*.
- **Likely follow-up**: *"How do you handle '.' wildcards (matches any character)?"* — when encountering \`'.'\`, branch across all active \`node.children.values()\` with DFS.

#### Pattern 2: Backtracking Grid Search with Trie Pruning (Word Search II)
- **Giveaway**: *"Find all words from dictionary present in a 2D board of letters"*.
- **Strategy**: Insert all dictionary words into a Trie. Run DFS from every grid cell. If current character is not in \`node.children\`, **prune the branch immediately**.
- **Top Problems**: *Word Search II*.
- **Likely follow-up**: *"How to avoid duplicate found words?"* — store \`node.word = word\` directly on the leaf node, and set \`node.word = None\` after recording it.

#### Pattern 3: Bitwise Binary Trie for Maximum XOR
- **Giveaway**: *"Find maximum XOR of any two numbers in an array"*.
- **Strategy**: Insert binary representations of numbers (32 bits) into a binary Trie (where children are only \`0\` and \`1\`). For each number, greedily choose the opposite bit (\`1 ^ bit\`) at each level to maximize XOR.
- **Top Problems**: *Maximum XOR of Two Numbers in an Array*.
- **Likely follow-up**: *"What is the time complexity?"* — strictly $O(32 \cdot N) = O(N)$ linear time.`,
  workedExample: {
    title: 'Implement Trie (Prefix Tree)',
    problem: `Design a data structure that supports adding words and searching for full words and prefixes in O(L) time.

Operations to implement:
- \`insert(word: str) -> None\`: Inserts word into the trie.
- \`search(word: str) -> bool\`: Returns True if word is in trie, False otherwise.
- \`startsWith(prefix: str) -> bool\`: Returns True if there is any word with the given prefix.`,
    code: {
      language: 'python',
      snippet: `class TrieNode:
    def __init__(self):
        self.children: dict[str, TrieNode] = {}
        self.is_end_of_word: bool = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_end_of_word = True

    def search(self, word: str) -> bool:
        curr = self.root
        for char in word:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return curr.is_end_of_word

    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for char in prefix:
            if char not in curr.children:
                return False
            curr = curr.children[char]
        return True`,
    },
    explanation: `Trace:
1. insert("apple"): Creates path root -> 'a' -> 'p' -> 'p' -> 'l' -> 'e', marks 'e' node with is_end_of_word = True.
2. search("app"): Traverses to 'p' node. 'p' node exists, but is_end_of_word is False. Returns False!
3. startsWith("app"): Traverses to 'p' node. 'p' node exists. Returns True!
4. insert("app"): Marks 'p' node with is_end_of_word = True.
5. search("app"): Now returns True!
Time Complexity: O(L) for all operations. Space: O(L) per inserted word.`,
  },
  complexity: {
    time: 'O(L)',
    timeDetail: 'L is the length of the string. Insert, Search, and StartsWith each examine exactly L characters.',
    space: 'O(N * L)',
    spaceDetail: 'In the worst case (no shared prefixes), memory scales with the total number of characters across all words.',
  },
  commonMistakes: `1. **Confusing \`search\` with \`startsWith\`**:
   A prefix is only a full word if \`curr.is_end_of_word == True\`. Returning \`True\` simply because traversal did not fall off the tree makes \`search("app")\` erroneously return \`True\` when only \`"apple"\` was inserted.

2. **Allocating New Nodes During \`search\`**:
   Accidentally using \`defaultdict\` for \`children\` in Python causes read operations to mutate the Trie by creating empty nodes for nonexistent characters. Use a plain \`dict\` with \`if char not in curr.children:\`.

3. **String Concatenation Overhead in Word Search II**:
   In *Word Search II*, building strings with \`path + board[r][c]\` creates $O(L^2)$ copying overhead. Instead, store the full \`word\` string directly inside the leaf TrieNode so you can record it in $O(1)$.

4. **Duplicate Results in Grid Tries**:
   In Word Search II, multiple grid paths can spell the same dictionary word. Once you find a word, append it to results and set \`node.word = None\` so subsequent paths ignore it.`,
  gotchas: [
    'Trie operations are O(L) where L is word length, completely independent of how many words N are stored.',
    'Word Search II: always prune Trie nodes and reset cell characters (backtrack) to restore grid state.',
    'Bitwise Trie: allows O(32 * N) = O(N) maximum XOR pair searches by greedily taking opposite bit branches.',
    'Memory optimization: use `dict` in Python for sparse child branches, or `[None] * 26` in C++/Java for cache locality.',
  ],
  problems: [
    { id: 'implement-trie-prefix-tree', title: 'Implement Trie (Prefix Tree)', slug: 'implement-trie-prefix-tree', difficulty: 'medium' },
    { id: 'design-add-and-search-words-data-structure', title: 'Design Add and Search Words Data Structure', slug: 'design-add-and-search-words-data-structure', difficulty: 'medium' },
    { id: 'maximum-xor-of-two-numbers-in-an-array', title: 'Maximum XOR of Two Numbers in an Array', slug: 'maximum-xor-of-two-numbers-in-an-array', difficulty: 'medium' },
    { id: 'word-search-ii', title: 'Word Search II', slug: 'word-search-ii', difficulty: 'hard' },
  ],
}
