export type SDTrack = 'HLD' | 'LLD'
export type SDStatus = 'not_started' | 'reading' | 'comfortable'

export type SDClassicProblem = {
  title: string
  keyConcepts: string[]
}

export type SDTopic = {
  id: string
  track: SDTrack
  order: number
  title: string
  icon: string
  summary: string
  keyPoints: string[]
  interviewPatterns: string[]
  classicProblems: SDClassicProblem[]
}

export const SYSTEM_DESIGN_TOPICS: SDTopic[] = [
  // ─── HLD Topics ──────────────────────────────────────────────────────────
  {
    id: 'sd-01',
    track: 'HLD',
    order: 1,
    title: 'Scalability & Load Balancing',
    icon: '⚖️',
    summary: 'Distributing traffic across multiple servers to prevent overload and enable horizontal scaling. The entry point to almost every system design interview.',
    keyPoints: [
      'Horizontal scaling (add servers) vs. vertical scaling (bigger server)',
      'Load balancer types: Round robin, Least connections, IP hash, Weighted',
      'Layer 4 (TCP) vs. Layer 7 (HTTP) load balancers',
      'Health checks and automatic failover',
      'Sticky sessions and their trade-offs',
      'DNS load balancing for geo-distribution',
    ],
    interviewPatterns: [
      'Always mention horizontal scaling + load balancer early',
      'Quantify: "1M req/s? We need multiple app servers behind an LB"',
      'Discuss stateless services (enables easy horizontal scaling)',
      'Mention auto-scaling groups (AWS ASG, GKE HPA)',
    ],
    classicProblems: [
      { title: 'Design TinyURL', keyConcepts: ['Load balancing', 'Stateless servers', 'Database sharding'] },
      { title: 'Design Twitter Feed', keyConcepts: ['Load balancing', 'Read replicas', 'CDN'] },
    ],
  },
  {
    id: 'sd-02',
    track: 'HLD',
    order: 2,
    title: 'Caching',
    icon: '⚡',
    summary: 'Storing frequently accessed data in fast memory to reduce latency and database load. One of the most impactful optimizations in any system.',
    keyPoints: [
      'Cache-aside (lazy loading) vs. write-through vs. write-behind',
      'Eviction policies: LRU, LFU, FIFO',
      'Cache invalidation — the hardest problem in CS',
      'Local cache (in-process) vs. distributed cache (Redis, Memcached)',
      'Cache stampede / thundering herd and solutions (mutex, probabilistic early expiry)',
      'TTL-based vs. event-based invalidation',
    ],
    interviewPatterns: [
      'Mention caching for any read-heavy system',
      'Always discuss cache invalidation strategy — don\'t just say "add Redis"',
      'Differentiate L1 (app-level), L2 (Redis), L3 (CDN) caches',
      'Estimate cache hit rate and its impact on latency',
    ],
    classicProblems: [
      { title: 'Design a Rate Limiter', keyConcepts: ['Redis', 'Token bucket', 'Sliding window'] },
      { title: 'Design a Search Autocomplete', keyConcepts: ['Cache hot queries', 'Trie in cache'] },
    ],
  },
  {
    id: 'sd-03',
    track: 'HLD',
    order: 3,
    title: 'Databases: SQL vs. NoSQL',
    icon: '🗄️',
    summary: 'Choosing the right database for your use case. SQL gives ACID guarantees; NoSQL trades some consistency for scale, flexibility, or speed.',
    keyPoints: [
      'ACID properties: Atomicity, Consistency, Isolation, Durability',
      'CAP theorem: choose 2 of Consistency, Availability, Partition Tolerance',
      'SQL: strong consistency, joins, ACID — ideal for financial/transactional data',
      'NoSQL types: Document (MongoDB), Key-Value (DynamoDB), Column (Cassandra), Graph (Neo4j)',
      'Eventual consistency and its use cases',
      'Indexing, query optimization, and the N+1 problem',
    ],
    interviewPatterns: [
      'Always justify your DB choice with requirements ("this needs ACID → SQL")',
      'Mention read replicas for read-heavy workloads',
      'Discuss sharding for very high write throughput',
      'Know when NoSQL is a red herring (most systems can use Postgres)',
    ],
    classicProblems: [
      { title: 'Design Uber', keyConcepts: ['Geospatial DB', 'SQL for trips', 'NoSQL for location updates'] },
      { title: 'Design a Leaderboard', keyConcepts: ['Redis Sorted Sets', 'SQL aggregation'] },
    ],
  },
  {
    id: 'sd-04',
    track: 'HLD',
    order: 4,
    title: 'Database Sharding & Replication',
    icon: '🔀',
    summary: 'Splitting data across multiple DB nodes (sharding) and maintaining copies for fault tolerance and read performance (replication).',
    keyPoints: [
      'Horizontal partitioning (sharding) strategies: range, hash, directory-based',
      'Hot shard problem and consistent hashing solution',
      'Leader-follower (master-slave) replication',
      'Multi-leader replication: conflict resolution challenges',
      'Leaderless replication: quorum reads/writes',
      'Resharding complexity and online schema changes',
    ],
    interviewPatterns: [
      'Bring up sharding when data exceeds single-node capacity',
      'Use consistent hashing to avoid resharding chaos',
      'Mention replication lag for async replication',
      'Read replicas can serve analytics without hitting primary',
    ],
    classicProblems: [
      { title: 'Design Instagram', keyConcepts: ['Sharding by user_id', 'Replication for reads'] },
      { title: 'Design a Key-Value Store', keyConcepts: ['Consistent hashing', 'Replication factor'] },
    ],
  },
  {
    id: 'sd-05',
    track: 'HLD',
    order: 5,
    title: 'Message Queues & Event Streaming',
    icon: '📨',
    summary: 'Decoupling services via async messaging. Message queues (RabbitMQ) for task distribution; event streams (Kafka) for durable, replayable event logs.',
    keyPoints: [
      'Message queue vs. event stream: ephemeral vs. persistent',
      'Producer-consumer, pub-sub patterns',
      'Kafka: topics, partitions, consumer groups, offsets',
      'At-most-once, at-least-once, exactly-once semantics',
      'Dead letter queues for failed messages',
      'Backpressure handling when consumers are slow',
    ],
    interviewPatterns: [
      'Use queues to decouple synchronous bottlenecks (e.g., email sending, image processing)',
      'Kafka for event sourcing, audit logs, real-time analytics pipelines',
      'Mention idempotency when at-least-once delivery is used',
      'Consumer group enables parallel processing of partitions',
    ],
    classicProblems: [
      { title: 'Design a Notification System', keyConcepts: ['Pub-sub', 'Kafka', 'Dead letter queues'] },
      { title: 'Design a Ride-Sharing App', keyConcepts: ['Event streaming', 'Location updates', 'Driver matching'] },
    ],
  },
  {
    id: 'sd-06',
    track: 'HLD',
    order: 6,
    title: 'CDN & Blob Storage',
    icon: '🌐',
    summary: 'Serving static assets (images, videos, JS) from servers near the user (CDN) and storing large unstructured data reliably (S3, GCS).',
    keyPoints: [
      'CDN: edge nodes cache content close to users — reduces latency & origin load',
      'Push vs. pull CDN caching strategies',
      'Cache-Control headers and TTL for CDN',
      'Object storage (S3): flat namespace, durability via replication, cheap at scale',
      'Pre-signed URLs for secure temporary access',
      'Multipart upload for large files',
    ],
    interviewPatterns: [
      'Any system with media → mention CDN + object storage immediately',
      'Separate static asset serving from API servers entirely',
      'Discuss CDN invalidation when content updates',
      'Pre-signed URLs for secure user-generated content uploads',
    ],
    classicProblems: [
      { title: 'Design YouTube / Netflix', keyConcepts: ['CDN for video', 'Object storage', 'Adaptive bitrate'] },
      { title: 'Design Dropbox', keyConcepts: ['Blob storage', 'Delta sync', 'Chunking'] },
    ],
  },
  {
    id: 'sd-07',
    track: 'HLD',
    order: 7,
    title: 'API Design & REST vs. GraphQL',
    icon: '🔌',
    summary: 'Designing clean, scalable APIs. REST is the standard for most systems; GraphQL solves over/under-fetching for complex client needs.',
    keyPoints: [
      'REST principles: stateless, resource-based, HTTP verbs, status codes',
      'REST versioning strategies: URL path, header, query param',
      'GraphQL: schema-first, single endpoint, type system, N+1 problem and DataLoader',
      'Idempotency keys for safe retries',
      'API rate limiting: token bucket, sliding window counter',
      'Pagination: offset vs. cursor-based (cursor preferred for consistency)',
    ],
    interviewPatterns: [
      'Design APIs with pagination from the start',
      'Mention idempotency keys for payment/mutation APIs',
      'Rate limiting protects both clients and servers',
      'Use cursor pagination for feeds (not offset — data shifts)',
    ],
    classicProblems: [
      { title: 'Design a Payment API', keyConcepts: ['Idempotency', 'Webhooks', 'Rate limiting'] },
      { title: 'Design a Social Graph API', keyConcepts: ['GraphQL', 'DataLoader', 'Pagination'] },
    ],
  },
  {
    id: 'sd-08',
    track: 'HLD',
    order: 8,
    title: 'Consistency, Availability & CAP',
    icon: '⚖️',
    summary: 'CAP theorem: distributed systems can guarantee at most 2 of Consistency, Availability, and Partition Tolerance. Understanding this drives all distributed design choices.',
    keyPoints: [
      'CAP theorem: during a network partition, choose C or A',
      'CP systems: consistent but may reject requests (HBase, ZooKeeper)',
      'AP systems: available but may return stale data (Cassandra, DynamoDB)',
      'PACELC: extends CAP to latency/consistency trade-offs in normal operation',
      'Strong vs. eventual vs. causal consistency',
      'Two-phase commit (2PC) for distributed transactions',
    ],
    interviewPatterns: [
      'Explicitly state your consistency requirement early in the interview',
      'Financial systems → strong consistency (CP)',
      'Social feeds / DNS → eventual consistency is fine (AP)',
      'Know that "partition tolerance" is not optional in real distributed systems',
    ],
    classicProblems: [
      { title: 'Design a Distributed Key-Value Store', keyConcepts: ['CAP trade-offs', 'Quorum', 'Vector clocks'] },
      { title: 'Design a Banking System', keyConcepts: ['Strong consistency', '2PC', 'ACID'] },
    ],
  },
  {
    id: 'sd-09',
    track: 'HLD',
    order: 9,
    title: 'Rate Limiting & Throttling',
    icon: '🚦',
    summary: 'Protecting your APIs from abuse, enforcing fair usage, and preventing cascading failures from traffic spikes.',
    keyPoints: [
      'Token bucket: smooth bursts, allows burst up to bucket size',
      'Leaky bucket: strict rate, smooths output, drops excess',
      'Fixed window counter: simple but boundary burst vulnerability',
      'Sliding window log: accurate but memory-heavy',
      'Sliding window counter: best trade-off for most cases',
      'Distributed rate limiting with Redis (atomic INCR + TTL)',
    ],
    interviewPatterns: [
      'Rate limit by user, IP, API key, or endpoint',
      'Return 429 Too Many Requests with Retry-After header',
      'Client-side retry with exponential backoff + jitter',
      'Redis single-instance is fine for most rate limiting needs',
    ],
    classicProblems: [
      { title: 'Design a Rate Limiter', keyConcepts: ['Sliding window', 'Redis', 'Distributed rate limiting'] },
      { title: 'Design an API Gateway', keyConcepts: ['Rate limiting', 'Auth', 'Routing'] },
    ],
  },
  {
    id: 'sd-10',
    track: 'HLD',
    order: 10,
    title: 'Search & Indexing',
    icon: '🔍',
    summary: 'Full-text search with inverted indexes (Elasticsearch), geospatial search, and autocomplete — powering search bars and discovery features.',
    keyPoints: [
      'Inverted index: maps terms → document list (the core of search)',
      'TF-IDF and BM25 for relevance scoring',
      'Elasticsearch: distributed, sharded, near-realtime indexing',
      'Geospatial indexing: Geohash, QuadTree, R-tree',
      'Autocomplete: Trie data structure, prefix search',
      'Synchronizing primary DB → search index (CDC via Kafka/Debezium)',
    ],
    interviewPatterns: [
      'Do not use SQL LIKE for full-text search at scale → Elasticsearch',
      'Use Geohash to translate lat/long into proximity search',
      'Trie in memory for autocomplete; cache top-K completions per prefix',
      'CDC (Change Data Capture) to keep search index in sync',
    ],
    classicProblems: [
      { title: 'Design a Search Autocomplete', keyConcepts: ['Trie', 'Top-K caching', 'Prefix search'] },
      { title: 'Design Yelp / Nearby Places', keyConcepts: ['Geohash', 'Geospatial index', 'Elasticsearch'] },
    ],
  },
  {
    id: 'sd-11',
    track: 'HLD',
    order: 11,
    title: 'Distributed Transactions & Sagas',
    icon: '🔗',
    summary: 'Maintaining data consistency across multiple services and databases without a global transaction manager. The Saga pattern orchestrates compensating transactions.',
    keyPoints: [
      'Two-phase commit (2PC): coordinator + participants, blocking protocol',
      'Saga pattern: sequence of local transactions with compensating rollbacks',
      'Choreography Saga: event-driven, services react to events',
      'Orchestration Saga: central orchestrator drives the flow',
      'Idempotency to handle duplicate message delivery',
      'Outbox pattern: atomically write to DB + publish event',
    ],
    interviewPatterns: [
      'E-commerce checkout: payment + inventory + order as a Saga',
      'Prefer Sagas over 2PC for microservices (2PC is a distributed lock)',
      'Outbox pattern prevents dual-write inconsistency',
      'Compensating transactions must be idempotent',
    ],
    classicProblems: [
      { title: 'Design an E-Commerce Checkout', keyConcepts: ['Saga', 'Outbox pattern', 'Idempotency'] },
      { title: 'Design a Flight Booking System', keyConcepts: ['Distributed transactions', 'Saga orchestration'] },
    ],
  },
  {
    id: 'sd-12',
    track: 'HLD',
    order: 12,
    title: 'Real-Time Systems & WebSockets',
    icon: '⚡',
    summary: 'Push-based communication for chat, notifications, collaborative editing, and live dashboards. WebSockets for persistent bidirectional connections; SSE for server-to-client streaming.',
    keyPoints: [
      'HTTP polling (inefficient) vs. long polling vs. WebSocket vs. SSE',
      'WebSocket: bidirectional, persistent TCP connection, low overhead after handshake',
      'SSE (Server-Sent Events): unidirectional server push, works over HTTP, auto-reconnect',
      'Connection management: heartbeats, reconnection with backoff',
      'Presence systems: who is online (Redis pub-sub for cross-instance)',
      'Horizontal scaling WebSocket servers: sticky sessions or shared pub-sub',
    ],
    interviewPatterns: [
      'Chat apps: WebSocket for real-time delivery',
      'Live feed / notifications: SSE if unidirectional is enough',
      'Scaling WebSockets: Redis pub-sub so any server can deliver to any connection',
      'Offline message storage + delivery upon reconnect',
    ],
    classicProblems: [
      { title: 'Design a Chat Application', keyConcepts: ['WebSocket', 'Redis pub-sub', 'Message persistence'] },
      { title: 'Design a Live Sports Scoreboard', keyConcepts: ['SSE', 'Fan-out', 'Edge caching'] },
    ],
  },

  // ─── LLD Topics ──────────────────────────────────────────────────────────
  {
    id: 'sd-13',
    track: 'LLD',
    order: 1,
    title: 'SOLID Principles',
    icon: '🏗️',
    summary: 'The 5 foundational principles of object-oriented design that lead to maintainable, extensible, and testable code.',
    keyPoints: [
      'S — Single Responsibility: a class should have one reason to change',
      'O — Open/Closed: open for extension, closed for modification (use interfaces)',
      'L — Liskov Substitution: subtypes must be substitutable for base types',
      'I — Interface Segregation: many specific interfaces better than one fat interface',
      'D — Dependency Inversion: depend on abstractions, not concretions (DI, IoC)',
    ],
    interviewPatterns: [
      'Name which principle you are applying while designing a class',
      'LLD interviews often test O and D most heavily',
      'Use "how would you add a new payment method?" to test OCP',
      'DI makes code testable — mention it proactively',
    ],
    classicProblems: [
      { title: 'Design a Logger System', keyConcepts: ['SRP', 'OCP via strategy pattern'] },
      { title: 'Design a Notification Service', keyConcepts: ['OCP', 'ISP', 'DIP'] },
    ],
  },
  {
    id: 'sd-14',
    track: 'LLD',
    order: 2,
    title: 'Design Patterns',
    icon: '🧩',
    summary: 'Reusable solutions to common software design problems. Categorized as Creational, Structural, and Behavioral patterns.',
    keyPoints: [
      'Creational: Singleton (thread-safe), Factory, Abstract Factory, Builder',
      'Structural: Adapter (incompatible interfaces), Decorator (add behavior), Facade (simplify complex subsystem), Composite',
      'Behavioral: Observer (event system), Strategy (interchangeable algorithms), Command (undo/redo), Template Method',
      'Know when NOT to use patterns (over-engineering)',
    ],
    interviewPatterns: [
      'Observer pattern for event/notification systems',
      'Strategy for pluggable behaviors (payment processors, sorting algorithms)',
      'Builder for objects with many optional params',
      'Factory to abstract object creation from usage',
    ],
    classicProblems: [
      { title: 'Design a Parking Lot', keyConcepts: ['Factory for vehicle types', 'Strategy for fee calculation'] },
      { title: 'Design an ATM Machine', keyConcepts: ['State pattern', 'Command pattern'] },
    ],
  },
  {
    id: 'sd-15',
    track: 'LLD',
    order: 3,
    title: 'Object-Oriented Design: Class Diagrams',
    icon: '📐',
    summary: 'Translating a problem domain into classes, relationships, and responsibilities. The core skill in LLD interviews.',
    keyPoints: [
      'Classes and their attributes / methods',
      'Relationships: Association, Aggregation (has-a), Composition (owns-a), Inheritance (is-a)',
      'Abstract classes vs. interfaces: when to use each',
      'Encapsulation: hiding internal state, exposing behavior',
      'Polymorphism: same interface, different implementations',
      'UML class diagram notation (interviewers rarely enforce strict UML — clarity matters)',
    ],
    interviewPatterns: [
      'Start with entities (nouns) from the requirements',
      'Identify relationships and cardinality (1:1, 1:N, M:N)',
      'Separate stable abstractions (interfaces) from concrete implementations',
      'Draw the diagram on the whiteboard before coding',
    ],
    classicProblems: [
      { title: 'Design a Library Management System', keyConcepts: ['Aggregation', 'Inheritance', 'Polymorphism'] },
      { title: 'Design an Online Shopping Cart', keyConcepts: ['Composition', 'Strategy', 'Observer'] },
    ],
  },
  {
    id: 'sd-16',
    track: 'LLD',
    order: 4,
    title: 'Concurrency & Thread Safety',
    icon: '🧵',
    summary: 'Writing correct multi-threaded code. Understanding race conditions, locks, and thread-safe patterns is essential for backend system design.',
    keyPoints: [
      'Race condition: unpredictable outcome when threads access shared state concurrently',
      'Mutex / Lock: mutual exclusion for critical sections',
      'Deadlock: two threads each waiting for the other — prevention via lock ordering',
      'Semaphore: counts available resources, limits concurrency',
      'Monitor / synchronized: Java built-in mutex + condition variable',
      'Thread-safe Singleton: double-checked locking, or Bill Pugh (holder class)',
    ],
    interviewPatterns: [
      'Producer-consumer problem: solved with bounded buffer + semaphores',
      'Reader-writer lock: many readers OK, writers need exclusive access',
      'Immutable objects are inherently thread-safe',
      'Prefer higher-level abstractions (concurrent collections, ExecutorService)',
    ],
    classicProblems: [
      { title: 'Design a Thread-Safe LRU Cache', keyConcepts: ['ReadWriteLock', 'LinkedHashMap'] },
      { title: 'Implement a Blocking Queue', keyConcepts: ['Semaphore', 'Condition variables'] },
    ],
  },
  {
    id: 'sd-17',
    track: 'LLD',
    order: 5,
    title: 'Clean Code & API Design',
    icon: '✨',
    summary: 'Writing readable, maintainable code and designing clean APIs that are easy to use correctly and hard to use incorrectly.',
    keyPoints: [
      'Meaningful names: reveal intent, avoid noise words',
      'Functions: do one thing, stay small, command-query separation',
      'Error handling: use exceptions for exceptional cases, fail fast',
      'Comments: explain WHY not WHAT; self-documenting code is the goal',
      'API design: minimal surface area, consistent conventions, sensible defaults',
      'Fluent interfaces / Builder pattern for complex construction',
    ],
    interviewPatterns: [
      'Naming: say what you mean. Reviewers test this explicitly.',
      'Keep functions under ~20 lines in interviews',
      'Always validate inputs at public API boundaries',
      'Return early to avoid deep nesting (guard clauses)',
    ],
    classicProblems: [
      { title: 'Design a Vending Machine', keyConcepts: ['State machine', 'Clean API', 'Error handling'] },
      { title: 'Design a Chess Game', keyConcepts: ['Class hierarchy', 'Command pattern', 'Polymorphism'] },
    ],
  },
  {
    id: 'sd-18',
    track: 'LLD',
    order: 6,
    title: 'Testing & Testable Design',
    icon: '🧪',
    summary: 'Writing code that is easy to test — using dependency injection, mocking, and the testing pyramid to ensure software correctness.',
    keyPoints: [
      'Testing pyramid: unit (fast, isolated) > integration > E2E (slow, broad)',
      'Unit test: tests a single class/function in isolation',
      'Mock / Stub / Fake: test doubles for isolating dependencies',
      'Dependency Injection enables replacing real dependencies with mocks',
      'TDD: write failing test → make it pass → refactor',
      'Code coverage is a tool, not a goal — test behavior not implementation',
    ],
    interviewPatterns: [
      'Mention DI upfront to show testable design thinking',
      'In LLD, name which tests you would write (unit, integration)',
      'Discuss what to mock: external APIs, DBs, time-dependent code',
      'Happy path + edge cases + failure cases = complete test suite',
    ],
    classicProblems: [
      { title: 'Design a Testable Payment Processor', keyConcepts: ['DI', 'Mock gateway', 'Unit tests'] },
      { title: 'Design a File Parser', keyConcepts: ['Strategy pattern', 'DI', 'TDD'] },
    ],
  },
]

export const HLD_TOPICS = SYSTEM_DESIGN_TOPICS.filter((t) => t.track === 'HLD')
export const LLD_TOPICS = SYSTEM_DESIGN_TOPICS.filter((t) => t.track === 'LLD')
