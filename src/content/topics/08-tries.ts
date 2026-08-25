import type { TopicContent } from '../types'

export const triesTopic: TopicContent = {
  id: 'tries',
  title: 'Tries',
  order_index: 8,
  visualizer_id: null,
  summary: 'Prefix tree data structure for string lookups and shared-prefix word search.',
  intuition: `A trie (prefix tree) stores strings by sharing prefixes. Each edge is a character; a node marked terminal means a complete word. Lookup, insert, and prefix queries are O(length), independent of how many words share the dictionary.

Tries shine when many strings share prefixes: autocomplete, prefix matching, and Word Search II (board DFS constrained by trie edges). Wildcard search (add-and-search-words) branches on \`.\` by trying every child.

The representation trade-off is memory: 26-wide arrays are simple; hash-map children are sparse-friendly. Interviewers want a clean node class and a boolean \`isWord\` (or count) at terminals.`,
  patternRecognition: `- **Prefix Queries**: "Starts with", autocomplete, longest common prefix.
- **Dictionary Lookups with Wildcards**: Word dictionary with \`.\` wildcards.
- **2D Grid Word Search**: Word Search II (pruning DFS using a prefix tree).`,
  complexity: {
    time: 'O(L)',
    timeDetail: 'Insert, search, and prefix lookups take O(L) time where L is word length.',
    space: 'O(N × L)',
    spaceDetail: 'Space is bounded by total characters across all stored strings, reduced by shared prefixes.',
  },
  gotchas: [
    'Do not mark every node as a word; only terminal nodes where a word completes.',
    'Search vs startsWith are different: search requires `isWord` to be true on the final node.',
    'Wildcard DFS must backtrack cleanly; do not mutate tree state improperly.',
    'Word Search II: prune dead trie branches (delete found words) to prevent redundant DFS paths and TLE.',
    'Character set: lowercase a-z (size 26) is standard unless specified otherwise.',
  ],
  problems: [
    { id: 'implement-trie', title: 'Implement Trie', slug: 'implement-trie-prefix-tree', difficulty: 'medium' },
    { id: 'design-add-and-search-words-data-structure', title: 'Design Add and Search Words Data Structure', slug: 'design-add-and-search-words-data-structure', difficulty: 'medium' },
    { id: 'word-search-ii', title: 'Word Search II', slug: 'word-search-ii', difficulty: 'hard' },
  ],
}
