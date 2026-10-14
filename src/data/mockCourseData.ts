import { MultimodalUnit, TopicNode, RAGASTestCase, SimulatedStudentProfile, Flashcard, StudyDaySchedule } from '../types';

export interface CoursePreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  topics: TopicNode[];
  units: MultimodalUnit[];
}

export const CS_ALGORITHMS_TOPICS: TopicNode[] = [
  {
    id: 't-graphs',
    name: 'Graph Algorithms & Shortest Paths',
    category: 'Algorithms',
    description: 'Single-source shortest paths on weighted directed graphs with positive and negative edge weights.',
    prerequisites: ['Foundational Data Structures', 'Graph Representations'],
    subtopics: ['Graph Representations & BFS', 'Dijkstra with Priority Queues', 'Bellman-Ford Algorithm', 'Negative Cycle Detection'],
    unitsCount: 6,
    estimatedHours: 5,
  },
  {
    id: 't-dp',
    name: 'Dynamic Programming & Memoization',
    category: 'Algorithms',
    description: 'Optimal substructure, overlapping subproblems, state definitions, topological orderings in DAG of subproblems.',
    prerequisites: ['Recursion & Induction', 'Graph Representations'],
    subtopics: ['Memoization vs Tabulation', 'Shortest Paths in DAGs', 'Longest Common Subsequence (LCS)', '0/1 Knapsack & Subset Sum'],
    unitsCount: 6,
    estimatedHours: 6,
  },
  {
    id: 't-neural',
    name: 'Neural Networks & Optimization',
    category: 'Deep Learning',
    description: 'Forward propagation, automatic differentiation, loss landscapes, backpropagation, and stochastic gradient descent.',
    prerequisites: ['Linear Algebra & Vector Calculus', 'Chain Rule'],
    subtopics: ['Perceptrons & Activation Functions', 'Multilayer Perceptron (MLP) Forward Pass', 'Backpropagation & Computational Graphs', 'Stochastic Gradient Descent (SGD) & Momentum'],
    unitsCount: 6,
    estimatedHours: 7,
  },
  {
    id: 't-hashing',
    name: 'Hashing & Amortized Analysis',
    category: 'Data Structures',
    description: 'Direct addressing, collision resolution via chaining and open addressing, universal hash families, dynamic array resizing.',
    prerequisites: ['Probability Basics', 'Arrays & Linked Lists'],
    subtopics: ['Direct Addressing & Chaining', 'Universal Hashing & Load Factors', 'Open Addressing & Probing', 'Amortized Analysis (Accounting Method)'],
    unitsCount: 6,
    estimatedHours: 4,
  },
];

export const INITIAL_TOPICS: TopicNode[] = CS_ALGORITHMS_TOPICS;

export const INITIAL_MULTIMODAL_UNITS: MultimodalUnit[] = [
  // Graph Algorithms
  {
    id: 'unit-bf-textbook',
    title: 'Bellman-Ford Algorithm & Negative Weight Cycles',
    source: 'textbook',
    origin: 'CLRS 4th Ed. Chapter 24, p. 651',
    pageNumber: 651,
    topic: 'Graph Algorithms & Shortest Paths',
    subtopic: 'Bellman-Ford Algorithm',
    content: `The Bellman-Ford algorithm solves the single-source shortest-paths problem in the general case where edge weights may be negative. Given a weighted, directed graph G = (V, E) with source vertex s and weight function w : E -> R, the Bellman-Ford algorithm returns a boolean value indicating whether or not there is a negative-weight cycle that is reachable from the source. If there is such a cycle, the algorithm indicates that no solution exists. If there is no such cycle, the algorithm produces the shortest paths and their weights.
The algorithm relaxes edges, progressively decreasing an estimate v.d on the weight of a shortest path from the source s to each vertex v in V until it achieves the actual shortest-path weight delta(s, v). The algorithm runs in time O(V · E), since the initialization takes Theta(V) time, each of the |V| - 1 passes over the edges takes Theta(E) time, and the final check loop takes Theta(E) time.`,
    formula: 'v.d = min(v.d, u.d + w(u, v)) for (u, v) in E',
    diagramCaption: 'Figure 24.4: Execution of Bellman-Ford on a 5-vertex directed graph showing edge relaxation passes 1 through 4.',
    diagramSvg: `<svg viewBox="0 0 400 180" class="w-full h-auto text-indigo-400">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#6366f1" />
        </marker>
      </defs>
      <circle cx="50" cy="90" r="22" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
      <text x="50" y="95" text-anchor="middle" fill="#e0e7ff" font-size="12" font-weight="bold">s (d=0)</text>
      <circle cx="160" cy="40" r="22" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
      <text x="160" y="45" text-anchor="middle" fill="#e0e7ff" font-size="12" font-weight="bold">t (d=6)</text>
      <circle cx="160" cy="140" r="22" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
      <text x="160" y="145" text-anchor="middle" fill="#e0e7ff" font-size="12" font-weight="bold">y (d=7)</text>
      <circle cx="280" cy="40" r="22" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
      <text x="280" y="45" text-anchor="middle" fill="#e0e7ff" font-size="12" font-weight="bold">x (d=4)</text>
      <circle cx="280" cy="140" r="22" fill="#1e1b4b" stroke="#6366f1" stroke-width="2"/>
      <text x="280" y="145" text-anchor="middle" fill="#e0e7ff" font-size="12" font-weight="bold">z (d=2)</text>
      <line x1="72" y1="80" x2="138" y2="48" stroke="#6366f1" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="100" y="55" fill="#a5b4fc" font-size="11">w=6</text>
      <line x1="72" y1="100" x2="138" y2="132" stroke="#6366f1" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="100" y="130" fill="#a5b4fc" font-size="11">w=7</text>
      <line x1="182" y1="40" x2="258" y2="40" stroke="#6366f1" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="220" y="32" fill="#a5b4fc" font-size="11">w=5</text>
      <line x1="182" y1="140" x2="258" y2="140" stroke="#6366f1" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="220" y="160" fill="#a5b4fc" font-size="11">w=-3</text>
      <line x1="280" y1="62" x2="182" y2="128" stroke="#ec4899" stroke-width="2" marker-end="url(#arrow)"/>
      <text x="245" y="100" fill="#f472b6" font-size="11">w=-2</text>
    </svg>`,
    prerequisites: ['Graph Representations & BFS', 'Dijkstra with Priority Queues'],
    keyTerms: ['Relaxation', 'Negative Weight Cycle', 'Shortest Path Estimate', 'O(VE)'],
  },
  {
    id: 'unit-bf-slide',
    title: 'Lecture Slides: Bellman-Ford Pass Invariant & Cycle Detection',
    source: 'slide',
    origin: 'MIT 6.006 Fall Slide Deck 15, Slide 14',
    slideNumber: 14,
    topic: 'Graph Algorithms & Shortest Paths',
    subtopic: 'Negative Cycle Detection',
    content: `Key Slide Points:
• Lemma (Pass Invariant): After i passes of edge relaxation, for every vertex v, v.d is at most the weight of any shortest path from s to v that uses at most i edges.
• Since a simple shortest path in a graph with no negative cycles contains at most |V| - 1 edges, |V| - 1 passes suffice to find all shortest paths.
• Negative Cycle Test: If we perform a |V|-th pass and ANY edge (u, v) can still be relaxed (i.e. v.d > u.d + w(u, v)), then there exists a negative-weight cycle reachable from s!
• Complexity comparison:
  - Dijkstra (Fibonacci heap): O(V log V + E) -> Requires non-negative edge weights w(e) >= 0.
  - Bellman-Ford: O(V · E) -> Handles arbitrary real weights.
  - DAG Shortest Paths (Topological Sort): O(V + E) -> Fastest, but requires acyclic graph.`,
    formula: 'If exists (u, v) such that v.d > u.d + w(u, v) after |V|-1 passes => Negative Cycle Detected',
    diagramCaption: 'Slide 14: Negative Cycle Detection Check and Asymptotic Comparison Matrix',
    prerequisites: ['Bellman-Ford Algorithm'],
    keyTerms: ['Pass Invariant', 'DAG Shortest Paths', 'Asymptotic Bound', 'Negative Cycle Reachability'],
  },
  {
    id: 'unit-bf-video',
    title: 'MIT 6.006 Lecture 15: Edge Relaxation & Why |V|-1 Passes Suffice',
    source: 'video',
    origin: 'MIT 6.006 Lecture 15 @ 14:20',
    timestamp: '14:20',
    videoSeconds: 860,
    videoUrl: 'https://www.youtube.com/embed/ozsuci55248?start=860',
    topic: 'Graph Algorithms & Shortest Paths',
    subtopic: 'Bellman-Ford Algorithm',
    content: `Transcript excerpt [14:20 - 18:05]:
Prof. Demaine: "Now, why does Bellman-Ford relax all edges |V|-1 times? Think about the structure of a shortest path. If there are no negative weight cycles, every shortest path must be simple—it cannot visit the same vertex twice. If it visited a vertex twice, that loop would either have non-negative weight (which we could remove to make the path strictly shorter or equal) or negative weight (which means an infinitely negative path).
Therefore, any simple path has at most |V| vertices, which means it contains at most |V|-1 edges!
When we do pass 1, we guarantee finding all 1-edge shortest paths. On pass 2, we guarantee finding all 2-edge shortest paths, and by pass |V|-1, we have relaxed along every possible edge in the optimal sequence. That is why |V|-1 passes are both necessary and sufficient."`,
    prerequisites: ['Graph Representations & BFS'],
    keyTerms: ['Simple Path', 'Prof. Demaine', 'Loop Removal', 'Sufficiency Proof'],
  },
  {
    id: 'unit-dijkstra-textbook',
    title: 'Dijkstra Algorithm & Greedy Choice Property',
    source: 'textbook',
    origin: 'CLRS 4th Ed. Chapter 24, p. 658',
    pageNumber: 658,
    topic: 'Graph Algorithms & Shortest Paths',
    subtopic: 'Dijkstra with Priority Queues',
    content: `Dijkstra's algorithm solves the single-source shortest-paths problem on a weighted, directed graph G = (V, E) for the case in which all edge weights are non-negative (w(u, v) >= 0).
The algorithm maintains a set S of vertices whose final shortest-path weights from the source s have already been determined. It repeatedly selects the vertex u in V - S with the minimum shortest-path estimate u.d, adds u to S, and relaxes all edges leaving u.
Implementation using a min-priority queue:
- Binary Min-Heap: O((V + E) log V)
- Fibonacci Heap: O(V log V + E)
Failure with negative weights: The greedy choice property fails if negative edges exist, because adding an edge of negative weight later could invalidate a vertex already locked into S.`,
    formula: 'u = extract_min(Q); S = S union {u}; for each v in Adj[u]: relax(u, v, w)',
    diagramCaption: 'Figure 24.6: Greedy frontier expansion in Dijkstra algorithm',
    prerequisites: ['Graph Representations & BFS'],
    keyTerms: ['Greedy Choice', 'Min-Heap', 'Extracted Set S', 'Non-negative Weights'],
  },

  // Dynamic Programming
  {
    id: 'unit-dp-memo-slide',
    title: 'Lecture Slides: The 5-Step DP Recipe & DAG of Subproblems',
    source: 'slide',
    origin: 'MIT 6.006 Fall Slide Deck 19, Slide 08',
    slideNumber: 8,
    topic: 'Dynamic Programming & Memoization',
    subtopic: 'Memoization vs Tabulation',
    content: `The 5-Step DP Recipe (Demaine):
1. Subproblems: Define what subproblems are needed in words (e.g. suffix X[i:], prefix X[:i], or substring X[i:j]). Count: # subproblems.
2. Relate: Express subproblem solution in terms of smaller subproblems (recurrence). Time per subproblem.
3. Topological Order: Verify that subproblem dependencies form a Directed Acyclic Graph (DAG) with no cycles.
4. Base Cases: Identify trivial leaf subproblems that can be solved directly without recursion.
5. Original Problem: Solve the original problem using the computed subproblems (either top-level entry or max/min over subproblems).
Total Running Time = (# subproblems) × (time per subproblem).`,
    formula: 'Time = (# subproblems) * (time per subproblem without recursive calls)',
    diagramCaption: 'Slide 08: Subproblem dependency DAG with topological ordering',
    diagramSvg: `<svg viewBox="0 0 380 120" class="w-full h-auto text-emerald-400">
      <defs>
        <marker id="dp-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
        </marker>
      </defs>
      <rect x="20" y="40" width="70" height="40" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
      <text x="55" y="65" text-anchor="middle" fill="#d1fae5" font-size="12" font-weight="bold">Base dp[0]</text>
      <rect x="140" y="40" width="70" height="40" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
      <text x="175" y="65" text-anchor="middle" fill="#d1fae5" font-size="12" font-weight="bold">dp[1]</text>
      <rect x="260" y="40" width="70" height="40" rx="8" fill="#064e3b" stroke="#10b981" stroke-width="2"/>
      <text x="295" y="65" text-anchor="middle" fill="#d1fae5" font-size="12" font-weight="bold">dp[n]</text>
      <line x1="90" y1="60" x2="135" y2="60" stroke="#10b981" stroke-width="2" marker-end="url(#dp-arrow)"/>
      <line x1="210" y1="60" x2="255" y2="60" stroke="#10b981" stroke-width="2" marker-end="url(#dp-arrow)"/>
      <path d="M 55 40 Q 175 10 280 35" fill="none" stroke="#34d399" stroke-width="2" stroke-dasharray="4" marker-end="url(#dp-arrow)"/>
    </svg>`,
    prerequisites: ['Recursion & Induction'],
    keyTerms: ['5-Step Recipe', 'Topological Order', 'Subproblem DAG', 'Amortized DP'],
  },
  {
    id: 'unit-dp-lcs-textbook',
    title: 'Longest Common Subsequence (LCS) Recurrence & 2D Table',
    source: 'textbook',
    origin: 'CLRS 4th Ed. Chapter 15, p. 392',
    pageNumber: 392,
    topic: 'Dynamic Programming & Memoization',
    subtopic: 'Longest Common Subsequence (LCS)',
    content: `In the Longest-Common-Subsequence problem, we are given two sequences X = (x1, x2, ..., xm) and Y = (y1, y2, ..., yn) and wish to find a maximum-length common subsequence.
Theorem (Optimal Substructure of LCS):
Let X = (x1, ..., xm) and Y = (y1, ..., yn) be sequences, and let Z = (z1, ..., zk) be any LCS of X and Y:
1. If xm = yn, then zk = xm = yn and Z_{k-1} is an LCS of X_{m-1} and Y_{n-1}.
2. If xm != yn, then zk != xm implies that Z is an LCS of X_{m-1} and Y.
3. If xm != yn, then zk != yn implies that Z is an LCS of X and Y_{n-1}.
Recursive formula:
c[i, j] = 0 if i = 0 or j = 0;
c[i, j] = c[i-1, j-1] + 1 if i, j > 0 and xi = yj;
c[i, j] = max(c[i, j-1], c[i-1, j]) if i, j > 0 and xi != yj.
Space and time complexity: O(m · n) time and O(m · n) space (can be reduced to O(min(m, n)) space if only length is required).`,
    formula: 'c[i, j] = (xi == yj) ? c[i-1, j-1] + 1 : max(c[i-1, j], c[i, j-1])',
    diagramCaption: 'Figure 15.8: The c and b tables computed by LCS-LENGTH on input sequences X and Y',
    prerequisites: ['Memoization vs Tabulation'],
    keyTerms: ['Optimal Substructure', 'LCS Recurrence', 'Prefix Subproblems', 'Backtracking Table'],
  },
  {
    id: 'unit-dp-video',
    title: 'MIT 6.006 Lecture 19: Memoization vs Tabulation & Call Stacks',
    source: 'video',
    origin: 'MIT 6.006 Lecture 19 @ 27:45',
    timestamp: '27:45',
    videoSeconds: 1665,
    videoUrl: 'https://www.youtube.com/embed/OQ5jsbhAv_M?start=1665',
    topic: 'Dynamic Programming & Memoization',
    subtopic: 'Memoization vs Tabulation',
    content: `Transcript excerpt [27:45 - 31:10]:
Prof. Demaine: "People always ask: should I write top-down memoization or bottom-up tabulation?
Top-down memoization is literally writing the natural recursive function and adding a hash table or array lookup before computing anything. Its huge advantage: you only solve subproblems that are actually reached! If only 10% of subproblems are reachable, top-down does 10% of the work.
Bottom-up tabulation systematically fills the table in topological order. Its advantage: no recursion overhead, zero call stack limits, and often you can optimize memory—like keeping only the last row or two rows instead of the entire m-by-n matrix. Both achieve the identical asymptotic time!"`,
    prerequisites: ['Memoization vs Tabulation'],
    keyTerms: ['Top-down', 'Bottom-up', 'Call Stack Overhead', 'Memory Optimization'],
  },

  // Neural Networks & Optimization
  {
    id: 'unit-nn-backprop-textbook',
    title: 'Computational Graphs & The Multivariate Chain Rule',
    source: 'textbook',
    origin: 'Goodfellow Deep Learning Chapter 6, p. 204',
    pageNumber: 204,
    topic: 'Neural Networks & Optimization',
    subtopic: 'Backpropagation & Computational Graphs',
    content: `The backpropagation algorithm allows the information from the cost to flow backward through the network in order to compute the gradient.
In a computational graph, nodes represent variables (scalars, vectors, matrices) and edges correspond to operations.
Chain rule for calculus:
Suppose y = g(x) and z = f(y) = f(g(x)). Then:
dz/dx = (dz/dy) · (dy/dx)
In the vector/tensor case where x in R^n and y in R^m:
nabla_x z = (partial y / partial x)^T · nabla_y z, where (partial y / partial x) is the m-by-n Jacobian matrix of g.
Backpropagation performs dynamic programming on the computational graph: it caches the intermediate scalar/tensor derivatives of each node with respect to the loss, avoiding recomputing exponential paths in the graph. The computational cost is linear in the number of edges in the graph.`,
    formula: 'partial L / partial w_ij = (partial L / partial a_j) * (partial a_j / partial z_j) * (partial z_j / partial w_ij)',
    diagramCaption: 'Figure 6.8: Computational graph demonstrating forward activations and reverse gradient flow (adjoints).',
    diagramSvg: `<svg viewBox="0 0 400 130" class="w-full h-auto text-cyan-400">
      <defs>
        <marker id="fwd-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
        </marker>
        <marker id="bwd-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#f43f5e" />
        </marker>
      </defs>
      <circle cx="50" cy="65" r="22" fill="#083344" stroke="#06b6d4" stroke-width="2"/>
      <text x="50" y="70" text-anchor="middle" fill="#cffafe" font-size="12" font-weight="bold">x</text>
      <circle cx="160" cy="65" r="22" fill="#083344" stroke="#06b6d4" stroke-width="2"/>
      <text x="160" y="70" text-anchor="middle" fill="#cffafe" font-size="12" font-weight="bold">z = Wx+b</text>
      <circle cx="270" cy="65" r="22" fill="#083344" stroke="#06b6d4" stroke-width="2"/>
      <text x="270" y="70" text-anchor="middle" fill="#cffafe" font-size="12" font-weight="bold">a = sigma(z)</text>
      <circle cx="360" cy="65" r="20" fill="#083344" stroke="#06b6d4" stroke-width="2"/>
      <text x="360" y="70" text-anchor="middle" fill="#cffafe" font-size="12" font-weight="bold">Loss L</text>
      <line x1="72" y1="55" x2="135" y2="55" stroke="#06b6d4" stroke-width="2" marker-end="url(#fwd-arrow)"/>
      <text x="105" y="48" fill="#67e8f9" font-size="10">Forward</text>
      <line x1="182" y1="55" x2="245" y2="55" stroke="#06b6d4" stroke-width="2" marker-end="url(#fwd-arrow)"/>
      <line x1="292" y1="55" x2="338" y2="55" stroke="#06b6d4" stroke-width="2" marker-end="url(#fwd-arrow)"/>
      <line x1="338" y1="78" x2="295" y2="78" stroke="#f43f5e" stroke-width="2" marker-end="url(#bwd-arrow)"/>
      <text x="315" y="93" fill="#fda4af" font-size="10">dL/da</text>
      <line x1="245" y1="78" x2="185" y2="78" stroke="#f43f5e" stroke-width="2" marker-end="url(#bwd-arrow)"/>
      <text x="215" y="93" fill="#fda4af" font-size="10">dL/dz</text>
      <line x1="135" y1="78" x2="75" y2="78" stroke="#f43f5e" stroke-width="2" marker-end="url(#bwd-arrow)"/>
      <text x="105" y="93" fill="#fda4af" font-size="10">dL/dW</text>
    </svg>`,
    prerequisites: ['Multilayer Perceptron (MLP) Forward Pass'],
    keyTerms: ['Jacobian Matrix', 'Adjoint', 'Reverse-Mode Autodiff', 'Loss Gradient'],
  },
  {
    id: 'unit-nn-sgd-slide',
    title: 'Lecture Slides: SGD vs Batch Gradient Descent & Momentum',
    source: 'slide',
    origin: 'CS231n Spring Slide Deck 03, Slide 22',
    slideNumber: 22,
    topic: 'Neural Networks & Optimization',
    subtopic: 'Stochastic Gradient Descent (SGD) & Momentum',
    content: `Comparison of Optimization Regimes:
1. Full Batch Gradient Descent: Computes gradient over entire training set N. Exact gradient, but O(N) cost per step; impossible for millions of samples.
2. Stochastic Gradient Descent (SGD): Computes gradient on a single random example (or mini-batch of size B = 32, 64, 256). Fast O(B) step, acts as an unbiased estimator of true gradient with variance.
3. The Problem with Pure SGD: High condition number of Hessian matrix causes oscillations along high-curvature ravines while making slow progress along gentle slopes.
4. Momentum: Adds velocity vector v <- beta * v - lr * grad; theta <- theta + v. Acts like a heavy ball rolling down a surface, smoothing oscillations and speeding through plateaus. Typically beta = 0.9.`,
    formula: 'v_{t+1} = beta * v_t - alpha * nabla L(theta_t); theta_{t+1} = theta_t + v_{t+1}',
    diagramCaption: 'Slide 22: Ravine oscillation of vanilla SGD compared to smooth momentum trajectory',
    prerequisites: ['Backpropagation & Computational Graphs'],
    keyTerms: ['Mini-batch', 'Hessian Condition Number', 'Ravine Oscillation', 'Velocity Vector beta=0.9'],
  },
  {
    id: 'unit-nn-video',
    title: 'Stanford CS231n Lecture 3: Loss Surfaces & Backprop Intuition',
    source: 'video',
    origin: 'Stanford CS231n Lecture 3 @ 32:15',
    timestamp: '32:15',
    videoSeconds: 1935,
    videoUrl: 'https://www.youtube.com/embed/gYpoJMlgyXA?start=1935',
    topic: 'Neural Networks & Optimization',
    subtopic: 'Backpropagation & Computational Graphs',
    content: `Transcript excerpt [32:15 - 35:50]:
Dr. Karpathy: "Every node in your computational graph is a local computing machine. In the forward pass, it receives inputs, calculates output, and stores its local derivatives. In the backward pass, it receives upstream gradient from the top, multiplies it by its local gradient using the chain rule, and immediately sends downstream gradients to its children.
It doesn't need to know anything about the rest of the neural network! It just does local calculus. That is why PyTorch and TensorFlow can construct massive 500-layer models with zero manual derivative algebra."`,
    prerequisites: ['Perceptrons & Activation Functions'],
    keyTerms: ['Local Computing Machine', 'Upstream Gradient', 'Local Gradient', 'Downstream Gradient'],
  },

  // Hashing & Amortized Analysis
  {
    id: 'unit-hash-chaining-textbook',
    title: 'Collision Resolution by Chaining & Simple Uniform Hashing',
    source: 'textbook',
    origin: 'CLRS 4th Ed. Chapter 11, p. 272',
    pageNumber: 272,
    topic: 'Hashing & Amortized Analysis',
    subtopic: 'Direct Addressing & Chaining',
    content: `In direct addressing, an element with key k is stored in slot k. While access is Theta(1), the universe of keys U is typically far too large to allocate an array of size |U| (e.g. 64-bit keys).
With hash tables, an element is stored in slot h(k); using a hash function h, we map keys into m slots: h : U -> {0, 1, ..., m-1}.
Collision resolution by chaining puts all elements that hash to the same slot into a linked list.
Theorem (Simple Uniform Hashing): Under the assumption of simple uniform hashing (any given element is equally likely to hash into any of the m slots, independently of where other elements hash), in a hash table in which collisions are resolved by chaining, an unsuccessful search takes average time Theta(1 + alpha), where alpha = n / m is the load factor of the table. A successful search also takes average time Theta(1 + alpha).`,
    formula: 'alpha = n / m; E[search time] = 1 + alpha',
    diagramCaption: 'Figure 11.2: Collision resolution by chaining on table of size m with linked lists',
    prerequisites: ['Universal Hashing & Load Factors'],
    keyTerms: ['Load Factor alpha', 'Simple Uniform Hashing', 'Linked List Chaining', 'Theta(1 + alpha)'],
  },
  {
    id: 'unit-hash-amortized-slide',
    title: 'Lecture Slides: Dynamic Array Resizing & The Accounting Method',
    source: 'slide',
    origin: 'MIT 6.006 Fall Slide Deck 08, Slide 11',
    slideNumber: 11,
    topic: 'Hashing & Amortized Analysis',
    subtopic: 'Amortized Analysis (Accounting Method)',
    content: `How to keep the load factor alpha = n/m <= 1 when inserting into a dynamic table?
Table Doubling Strategy:
When the table becomes full (n = m):
1. Allocate new table of size 2m.
2. Rehash/copy all n elements into new table (takes Theta(n) time).
3. Insert new element.
Accounting Method Proof of O(1) Amortized Time:
• Charge $3 for each regular insertion.
• $1 pays for the immediate insertion into the table.
• $1 is stored as credit on the newly inserted element.
• $1 is stored as credit on an already existing element that was moved during the last doubling.
By the time the table is full again, every element has $1 of credit, providing exactly the $n needed to pay for the Theta(n) reallocation and copying!
Hence, amortized cost per append is O(1).`,
    formula: 'Amortized Cost c_hat = c + Delta(Phi) = O(1)',
    diagramCaption: 'Slide 11: Credit bank visualization showing $3 token allocation per element',
    prerequisites: ['Direct Addressing & Chaining'],
    keyTerms: ['Table Doubling', 'Accounting Method', 'Credit Bank', 'Potential Function Phi'],
  },
];

export const INITIAL_ASSESSMENT_QUESTIONS = [
  {
    id: 'q-bf-1',
    topic: 'Graph Algorithms & Shortest Paths',
    subtopic: 'Bellman-Ford Algorithm',
    type: 'mcq' as const,
    difficulty: 'intermediate' as const,
    prompt: 'Given a directed graph G = (V, E) with arbitrary real-valued edge weights, why does the Bellman-Ford algorithm execute exactly |V| - 1 passes of edge relaxation?',
    options: [
      'Because every graph has at most |V|-1 total edges.',
      'Because any simple shortest path in a graph without negative cycles contains at most |V|-1 edges.',
      'Because each pass only relaxes edges incident to the source vertex s.',
      'Because Dijkstra requires |V| passes, so Bellman-Ford saves one pass.'
    ],
    correctIndex: 1,
    correctAnswer: 'Because any simple shortest path in a graph without negative cycles contains at most |V|-1 edges.',
    explanation: 'As proven in CLRS p. 651 and MIT 6.006 Lecture 15 @ 14:20, if there are no negative-weight cycles, any shortest path is simple and visits each vertex at most once, meaning it has at most |V|-1 edges. Pass i guarantees finding all shortest paths using at most i edges.',
    sourceCitation: {
      source: 'textbook' as const,
      origin: 'CLRS 4th Ed. Chapter 24, p. 651',
      excerpt: 'Since a simple shortest path contains at most |V|-1 edges, relaxing all edges |V|-1 times guarantees all shortest paths are found.'
    },
    verified: true,
    verificationScore: 0.99,
    prerequisites: ['Graph Representations & BFS', 'Edge Relaxation']
  },
  {
    id: 'q-bf-2',
    topic: 'Graph Algorithms & Shortest Paths',
    subtopic: 'Negative Cycle Detection',
    type: 'mcq' as const,
    difficulty: 'advanced' as const,
    prompt: 'Suppose you run the standard Bellman-Ford algorithm for |V|-1 passes. During a proposed |V|-th pass, you observe that for an edge (u, v) with weight w(u, v) = -4, v.d = 10 and u.d = 12. Does this indicate a negative cycle?',
    options: [
      'Yes, because 12 + (-4) = 8, which is strictly less than 10, meaning relaxation is still possible.',
      'No, because u.d is positive and negative cycles only occur when vertex distances become negative.',
      'No, because |V|-1 passes have already terminated and results are fixed.',
      'Only if edge (u, v) forms a direct self-loop on vertex u.'
    ],
    correctIndex: 0,
    correctAnswer: 'Yes, because 12 + (-4) = 8, which is strictly less than 10, meaning relaxation is still possible.',
    explanation: 'According to Slide 14 and CLRS Theorem 24.4, if ANY edge satisfies v.d > u.d + w(u, v) after |V|-1 passes, a negative cycle reachable from s exists. Here 10 > 12 + (-4) = 8, so relaxation succeeds.',
    sourceCitation: {
      source: 'slide' as const,
      origin: 'MIT 6.006 Fall Slide Deck 15, Slide 14',
      excerpt: 'Negative Cycle Test: If v.d > u.d + w(u, v) after |V|-1 passes, then there exists a negative-weight cycle reachable from s.'
    },
    verified: true,
    verificationScore: 0.98,
    prerequisites: ['Bellman-Ford Algorithm']
  },
  {
    id: 'q-dp-1',
    topic: 'Dynamic Programming & Memoization',
    subtopic: 'Longest Common Subsequence (LCS)',
    type: 'numerical' as const,
    difficulty: 'intermediate' as const,
    prompt: 'Calculate the length of the Longest Common Subsequence between string X = "ALGORITHM" and string Y = "LOGARITHM".',
    correctAnswer: '8',
    explanation: 'The common subsequence "LGORITHM" has length 8 (only "A" in ALGORITHM is placed before L, while in LOGARITHM it occurs after G). Verifiable via the LCS 2D dynamic programming recurrence from CLRS p. 392.',
    sourceCitation: {
      source: 'textbook' as const,
      origin: 'CLRS 4th Ed. Chapter 15, p. 392',
      excerpt: 'c[i, j] = c[i-1, j-1] + 1 if xi == yj, otherwise max(c[i-1, j], c[i, j-1]).'
    },
    verified: true,
    verificationScore: 1.0,
    prerequisites: ['Memoization vs Tabulation']
  },
  {
    id: 'q-nn-1',
    topic: 'Neural Networks & Optimization',
    subtopic: 'Backpropagation & Computational Graphs',
    type: 'short_answer' as const,
    difficulty: 'intermediate' as const,
    prompt: 'In reverse-mode automatic differentiation (backpropagation), what two quantities does an intermediate node multiply together to compute the gradient passed to its incoming inputs?',
    correctAnswer: 'Upstream gradient and local gradient',
    explanation: 'As Dr. Karpathy explains in CS231n Lecture 3 @ 32:15, every node receives the upstream gradient dL/dout and multiplies it by its local gradient dout/din via the chain rule to generate downstream gradient dL/din.',
    sourceCitation: {
      source: 'video' as const,
      origin: 'Stanford CS231n Lecture 3 @ 32:15',
      excerpt: 'Downstream gradient = Upstream gradient * Local gradient (chain rule).'
    },
    verified: true,
    verificationScore: 0.97,
    prerequisites: ['Multilayer Perceptron (MLP) Forward Pass']
  },
  {
    id: 'q-hash-1',
    topic: 'Hashing & Amortized Analysis',
    subtopic: 'Amortized Analysis (Accounting Method)',
    type: 'mcq' as const,
    difficulty: 'novice' as const,
    prompt: 'In dynamic array doubling using the accounting method, how many dollar tokens are charged per insertion to guarantee O(1) amortized cost?',
    options: ['$1', '$2', '$3', '$n'],
    correctIndex: 2,
    correctAnswer: '$3',
    explanation: 'From MIT 6.006 Slide Deck 08, Slide 11: $1 pays for the immediate insertion, $1 is stored on the new item for future copying, and $1 is stored on a previously copied item. When the array doubles at size n, exactly $n tokens are banked to pay for copying.',
    sourceCitation: {
      source: 'slide' as const,
      origin: 'MIT 6.006 Fall Slide Deck 08, Slide 11',
      excerpt: 'Accounting Method: Charge $3 per item inserted. $1 for insertion, $2 stored as credit to pay for reallocating n elements.'
    },
    verified: true,
    verificationScore: 0.99,
    prerequisites: ['Direct Addressing & Chaining']
  }
];

export const RAGAS_BENCHMARK_TESTSET: RAGASTestCase[] = [
  {
    id: 'ragas-01',
    query: 'What is the time complexity of Bellman-Ford and how does it detect negative weight cycles?',
    category: 'algorithm',
    groundTruthOrigin: 'CLRS p. 651 & Slide 14',
    groundTruthAnswer: 'Time complexity is O(V · E). It detects negative weight cycles by running a |V|-th pass: if any edge (u, v) can still be relaxed (v.d > u.d + w(u, v)), a negative cycle reachable from source exists.',
    retrievedContextSample: 'CLRS Chapter 24 p. 651: Bellman-Ford runs in O(VE) time. Slide 14: If v.d > u.d + w(u, v) after |V|-1 passes, negative cycle exists.',
    isOffTopic: false,
    baselineFaithfulness: 0.98,
    baselineRelevancy: 0.95,
    baselinePrecision: 0.94,
    baselineRecall: 0.96,
  },
  {
    id: 'ragas-02',
    query: 'Explain why Dijkstra algorithm fails when negative edge weights are present.',
    category: 'algorithm',
    groundTruthOrigin: 'CLRS Chapter 24, p. 658',
    groundTruthAnswer: 'Dijkstra relies on the greedy choice property where once a vertex u is added to settled set S, its distance u.d is assumed final. A negative weight edge encountered later could provide a shorter path to a vertex already in S, violating the greedy invariant.',
    retrievedContextSample: 'CLRS p. 658: Dijkstra requires w(u, v) >= 0. Greedy choice property fails if negative edges exist because adding a negative edge later invalidates settled vertices.',
    isOffTopic: false,
    baselineFaithfulness: 0.96,
    baselineRelevancy: 0.93,
    baselinePrecision: 0.92,
    baselineRecall: 0.94,
  },
  {
    id: 'ragas-03',
    query: 'What is the recurrence relation for Longest Common Subsequence (LCS)?',
    category: 'algorithm',
    groundTruthOrigin: 'CLRS Chapter 15, p. 392',
    groundTruthAnswer: 'c[i, j] = 0 if i=0 or j=0; c[i, j] = c[i-1, j-1] + 1 if xi == yj; c[i, j] = max(c[i-1, j], c[i, j-1]) if xi != yj.',
    retrievedContextSample: 'CLRS p. 392: c[i, j] = c[i-1, j-1] + 1 if xi = yj; max(c[i, j-1], c[i-1, j]) if xi != yj.',
    isOffTopic: false,
    baselineFaithfulness: 1.0,
    baselineRelevancy: 0.97,
    baselinePrecision: 0.96,
    baselineRecall: 0.98,
  },
  {
    id: 'ragas-04',
    query: 'How does momentum improve standard mini-batch stochastic gradient descent (SGD)?',
    category: 'algorithm',
    groundTruthOrigin: 'CS231n Slide Deck 03, Slide 22',
    groundTruthAnswer: 'Momentum adds a velocity vector v that accumulates past gradients scaled by friction beta (usually 0.9). It dampens oscillations in high-curvature ravines and accelerates progress along flat plateaus.',
    retrievedContextSample: 'CS231n Slide 22: v = beta * v - lr * grad; theta = theta + v. Smooths oscillations in ravines and accelerates through flat regions.',
    isOffTopic: false,
    baselineFaithfulness: 0.95,
    baselineRelevancy: 0.94,
    baselinePrecision: 0.91,
    baselineRecall: 0.93,
  },
  {
    id: 'ragas-05',
    query: 'What is the difference between top-down memoization and bottom-up tabulation according to Prof. Demaine?',
    category: 'algorithm',
    groundTruthOrigin: 'MIT 6.006 Lecture 19 @ 27:45',
    groundTruthAnswer: 'Top-down memoization only computes subproblems that are reachable, saving work if few subproblems are visited. Bottom-up tabulation avoids call stack limits, eliminates recursion overhead, and enables table space compression.',
    retrievedContextSample: 'MIT 6.006 Lecture 19 transcript: Top-down only solves reached subproblems. Bottom-up has no recursion overhead and allows memory optimization.',
    isOffTopic: false,
    baselineFaithfulness: 0.97,
    baselineRelevancy: 0.96,
    baselinePrecision: 0.95,
    baselineRecall: 0.95,
  },
  // Deliberate Off-Course Adversarial Queries to test refusal & strict grounding
  {
    id: 'ragas-06-offtopic',
    query: 'How do you cook authentic Hyderabadi Chicken Biryani with basmati rice and saffron?',
    category: 'off_topic',
    groundTruthOrigin: 'N/A (Off-Syllabus Refusal)',
    groundTruthAnswer: 'Query should be declined or clearly flagged as outside the course syllabus, since the course materials cover algorithms and deep learning, not culinary recipes.',
    retrievedContextSample: 'No matching course units found in syllabus.',
    isOffTopic: true,
    baselineFaithfulness: 1.0,
    baselineRelevancy: 0.95,
    baselinePrecision: 1.0,
    baselineRecall: 1.0,
  },
  {
    id: 'ragas-07-offtopic',
    query: 'Explain the Proof of Work consensus mechanism and SHA-256 difficulty adjustment in Bitcoin.',
    category: 'off_topic',
    groundTruthOrigin: 'N/A (Off-Syllabus Refusal)',
    groundTruthAnswer: 'Query is outside the uploaded syllabus. The assistant should politely refuse or flag as ungrounded external knowledge.',
    retrievedContextSample: 'No matching course units found in syllabus.',
    isOffTopic: true,
    baselineFaithfulness: 1.0,
    baselineRelevancy: 0.92,
    baselinePrecision: 1.0,
    baselineRecall: 1.0,
  },
];

export const INITIAL_SIMULATED_STUDENTS: SimulatedStudentProfile[] = [
  {
    id: 'sim-novice',
    name: 'Aarav (Novice Learner)',
    archetype: 'struggling_novice',
    description: 'Enters with zero algorithm background, prone to slipping (pS=0.25) and low prior mastery (pL0=0.15). Needs frequent prerequisite reinforcement.',
    bktParams: { pL0: 0.15, pT: 0.18, pG: 0.20, pS: 0.22 },
    sessions: [
      { sessionNumber: 1, averageMastery: 0.18, questionsAttempted: 5, correctCount: 2, repeatQuestionsAvoidedRatio: 1.0 },
      { sessionNumber: 2, averageMastery: 0.32, questionsAttempted: 6, correctCount: 3, repeatQuestionsAvoidedRatio: 1.0 },
      { sessionNumber: 3, averageMastery: 0.49, questionsAttempted: 6, correctCount: 4, repeatQuestionsAvoidedRatio: 0.98 },
      { sessionNumber: 4, averageMastery: 0.68, questionsAttempted: 7, correctCount: 5, repeatQuestionsAvoidedRatio: 1.0 },
      { sessionNumber: 5, averageMastery: 0.82, questionsAttempted: 6, correctCount: 6, repeatQuestionsAvoidedRatio: 1.0 },
    ],
  },
  {
    id: 'sim-steady',
    name: 'Priya (Steady Learner)',
    archetype: 'steady_learner',
    description: 'Moderate prior knowledge (pL0=0.35), consistent learning transition rate (pT=0.28), low slip rate (pS=0.10).',
    bktParams: { pL0: 0.35, pT: 0.28, pG: 0.15, pS: 0.10 },
    sessions: [
      { sessionNumber: 1, averageMastery: 0.38, questionsAttempted: 5, correctCount: 3, repeatQuestionsAvoidedRatio: 1.0 },
      { sessionNumber: 2, averageMastery: 0.55, questionsAttempted: 5, correctCount: 4, repeatQuestionsAvoidedRatio: 1.0 },
      { sessionNumber: 3, averageMastery: 0.72, questionsAttempted: 6, correctCount: 5, repeatQuestionsAvoidedRatio: 1.0 },
      { sessionNumber: 4, averageMastery: 0.85, questionsAttempted: 6, correctCount: 6, repeatQuestionsAvoidedRatio: 0.97 },
      { sessionNumber: 5, averageMastery: 0.93, questionsAttempted: 5, correctCount: 5, repeatQuestionsAvoidedRatio: 1.0 },
    ],
  },
  {
    id: 'sim-accelerated',
    name: 'Rohan (Fast-Track Accelerated)',
    archetype: 'accelerated_fast_track',
    description: 'High prior mastery (pL0=0.60), rapid knowledge acquisition (pT=0.45), near-zero slips (pS=0.04). Leaps directly to advanced numerical proofs.',
    bktParams: { pL0: 0.60, pT: 0.45, pG: 0.10, pS: 0.04 },
    sessions: [
      { sessionNumber: 1, averageMastery: 0.64, questionsAttempted: 6, correctCount: 5, repeatQuestionsAvoidedRatio: 1.0 },
      { sessionNumber: 2, averageMastery: 0.81, questionsAttempted: 6, correctCount: 6, repeatQuestionsAvoidedRatio: 1.0 },
      { sessionNumber: 3, averageMastery: 0.92, questionsAttempted: 5, correctCount: 5, repeatQuestionsAvoidedRatio: 1.0 },
      { sessionNumber: 4, averageMastery: 0.96, questionsAttempted: 5, correctCount: 5, repeatQuestionsAvoidedRatio: 1.0 },
      { sessionNumber: 5, averageMastery: 0.98, questionsAttempted: 5, correctCount: 5, repeatQuestionsAvoidedRatio: 1.0 },
    ],
  },
];

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    topic: 'Graph Algorithms & Shortest Paths',
    subtopic: 'Bellman-Ford Algorithm',
    front: 'What is the tight worst-case time complexity of Bellman-Ford on graph G = (V, E)?',
    back: 'O(V · E) — |V|-1 passes over all |E| edges, plus a 1-pass negative cycle verification check.',
    origin: 'CLRS 4th Ed. p. 651',
    difficulty: 'easy',
    repetitions: 3,
    intervalDays: 4,
    nextReviewDate: 'Today',
  },
  {
    id: 'fc-2',
    topic: 'Graph Algorithms & Shortest Paths',
    subtopic: 'Negative Cycle Detection',
    front: 'How can you detect if a negative weight cycle is reachable from the source s in Bellman-Ford?',
    back: 'Perform a |V|-th pass. If any edge (u, v) can still be relaxed (v.d > u.d + w(u, v)), then a negative cycle is reachable.',
    origin: 'MIT 6.006 Slide 14',
    difficulty: 'medium',
    repetitions: 2,
    intervalDays: 2,
    nextReviewDate: 'Tomorrow',
  },
  {
    id: 'fc-3',
    topic: 'Dynamic Programming & Memoization',
    subtopic: 'Memoization vs Tabulation',
    front: 'What formula calculates the total running time of a Dynamic Programming algorithm?',
    back: 'Total Time = (# of unique subproblems) × (time per subproblem without recursive calls).',
    origin: 'MIT 6.006 Slide 08',
    difficulty: 'easy',
    repetitions: 4,
    intervalDays: 7,
    nextReviewDate: 'In 3 days',
  },
  {
    id: 'fc-4',
    topic: 'Neural Networks & Optimization',
    subtopic: 'Backpropagation & Computational Graphs',
    front: 'How does backpropagation compute downstream gradient dL/din at a computational node?',
    back: 'dL/din = (upstream gradient dL/dout) × (local derivative dout/din) via the multivariate chain rule.',
    origin: 'Goodfellow p. 204 & CS231n @ 32:15',
    difficulty: 'medium',
    repetitions: 1,
    intervalDays: 1,
    nextReviewDate: 'Today',
  },
  {
    id: 'fc-5',
    topic: 'Hashing & Amortized Analysis',
    subtopic: 'Amortized Analysis (Accounting Method)',
    front: 'Under Simple Uniform Hashing with linked list chaining, what is the expected search time?',
    back: 'Theta(1 + alpha), where alpha = n/m is the load factor of the hash table.',
    origin: 'CLRS 4th Ed. p. 272',
    difficulty: 'easy',
    repetitions: 2,
    intervalDays: 3,
    nextReviewDate: 'In 2 days',
  },
];

export const INITIAL_STUDY_SCHEDULE: StudyDaySchedule[] = [
  {
    dayNumber: 1,
    dateStr: 'Day 1',
    targetTopic: 'Graph Algorithms & Shortest Paths',
    focusType: 'concept_review',
    tasks: ['Review Bellman-Ford edge relaxation proof (CLRS p. 651)', 'Watch MIT 6.006 Lecture 15 @ 14:20', 'Complete 3 diagnostic MCQs'],
    estimatedMinutes: 45,
    completed: true,
    ebbinghausRetentionExpected: 0.95,
  },
  {
    dayNumber: 2,
    dateStr: 'Day 2',
    targetTopic: 'Graph Algorithms & Shortest Paths',
    focusType: 'adaptive_quiz',
    tasks: ['Negative weight cycle detection exercise', 'Compare Dijkstra vs Bellman-Ford tradeoffs', 'Spaced review of Flashcard #1 and #2'],
    estimatedMinutes: 40,
    completed: false,
    ebbinghausRetentionExpected: 0.88,
  },
  {
    dayNumber: 3,
    dateStr: 'Day 3',
    targetTopic: 'Dynamic Programming & Memoization',
    focusType: 'concept_review',
    tasks: ['5-Step DP Recipe breakdown (Slide 08)', 'Longest Common Subsequence 2D table derivation (CLRS p. 392)', 'Watch memoization call stack video @ 27:45'],
    estimatedMinutes: 50,
    completed: false,
    ebbinghausRetentionExpected: 0.82,
  },
  {
    dayNumber: 4,
    dateStr: 'Day 4',
    targetTopic: 'Neural Networks & Optimization',
    focusType: 'deep_dive_diagrams',
    tasks: ['Computational graph adjoint flow analysis (Goodfellow p. 204)', 'Karpathy local vs upstream gradient video @ 32:15', 'SGD with Momentum ravine problem calculation'],
    estimatedMinutes: 60,
    completed: false,
    ebbinghausRetentionExpected: 0.77,
  },
  {
    dayNumber: 5,
    dateStr: 'Day 5',
    targetTopic: 'Hashing & Amortized Analysis',
    focusType: 'adaptive_quiz',
    tasks: ['Accounting method $3 token bank proof (Slide 11)', 'Universal hash families & load factors', 'Solve 4 numerical questions'],
    estimatedMinutes: 45,
    completed: false,
    ebbinghausRetentionExpected: 0.73,
  },
  {
    dayNumber: 6,
    dateStr: 'Day 6',
    targetTopic: 'Comprehensive Review (Weak Topics)',
    focusType: 'mock_exam',
    tasks: ['Automated adaptive mock exam (10 questions cross-validated)', 'Review misconception diagnostic report', 'Audio brief study recap'],
    estimatedMinutes: 65,
    completed: false,
    ebbinghausRetentionExpected: 0.85,
  },
];

export const PRESET_COURSES: CoursePreset[] = [
  {
    id: 'cs-algorithms',
    name: 'Computer Science: Algorithms & Neural Networks',
    icon: '💻',
    description: 'CLRS 4th Ed, MIT 6.006, Stanford CS231n — Bellman-Ford, Dynamic Programming, and Backpropagation.',
    topics: CS_ALGORITHMS_TOPICS,
    units: INITIAL_MULTIMODAL_UNITS,
  },
  {
    id: 'biology-genetics',
    name: 'Molecular Biology & Cell Genetics',
    icon: '🧬',
    description: 'Campbell Biology & MIT 7.01 — DNA Replication, transcription, translation, and CRISPR gene editing.',
    topics: [
      {
        id: 't-dna',
        name: 'DNA Replication & Enzymology',
        category: 'Molecular Biology',
        description: 'Helicase, topoisomerase, DNA polymerase III proofreading, and Okazaki fragments on lagging strand.',
        prerequisites: ['Basic Organic Chemistry', 'Nucleic Acids'],
        subtopics: ['Replication Fork Mechanics', 'Lagging Strand Synthesis', 'Polymerase Proofreading (3 to 5 Exonuclease)'],
        unitsCount: 2,
        estimatedHours: 4,
      },
      {
        id: 't-transcription',
        name: 'RNA Transcription & Gene Regulation',
        category: 'Genetics',
        description: 'Promoters, RNA polymerase II, post-transcriptional splicing, and lac operon inducible systems.',
        prerequisites: ['DNA Replication & Enzymology'],
        subtopics: ['TATA Box Promoters', 'Intron-Exon Splicing', 'Lac Operon Allosteric Control'],
        unitsCount: 2,
        estimatedHours: 5,
      },
    ],
    units: [
      {
        id: 'unit-bio-1',
        title: 'DNA Replication Fork & Okazaki Synthesis',
        source: 'textbook',
        origin: 'Campbell Biology 12th Ed. Chapter 16, p. 324',
        pageNumber: 324,
        topic: 'DNA Replication & Enzymology',
        subtopic: 'Lagging Strand Synthesis',
        content: `DNA polymerases can add nucleotides only to the free 3' end of a growing primer or strand, never to the 5' end. Thus, a new DNA strand can elongate only in the 5' -> 3' direction.
Along one template strand, DNA polymerase III can synthesize a continuous strand called the leading strand.
To elongate the other new strand, called the lagging strand, DNA polymerase III must work in the direction away from the replication fork. The lagging strand is synthesized discontinuously, as a series of segments called Okazaki fragments, each about 100-200 nucleotides long in eukaryotes. DNA ligase subsequently joins the sugar-phosphate backbones of all the Okazaki fragments into a continuous DNA strand.`,
        formula: 'Elongation rate: ~50 nucleotides/sec in humans; 500 nts/sec in E. coli',
        prerequisites: ['Basic Organic Chemistry', 'Nucleic Acids'],
        keyTerms: ['Okazaki Fragments', 'DNA Polymerase III', 'Lagging Strand', 'DNA Ligase'],
      },
      {
        id: 'unit-bio-2',
        title: 'MIT 7.012 Lecture 8: Helicase Unwinding & Topoisomerase Relief',
        source: 'video',
        origin: 'MIT 7.012 Introductory Biology @ 11:45',
        timestamp: '11:45',
        topic: 'DNA Replication & Enzymology',
        subtopic: 'Replication Fork Mechanics',
        content: `Prof. Lander: "As helicase unwinds the double helix at 10,000 RPM, it creates severe torsional strain ahead of the replication fork. Topoisomerase cuts the phosphate backbone, allows the strands to swivel and relieve supercoiling, and reseals the cut. Without topoisomerase, replication halts immediately within seconds."`,
        prerequisites: ['DNA Replication & Enzymology'],
        keyTerms: ['Helicase', 'Topoisomerase', 'Supercoiling Relief', 'Prof. Lander'],
      },
    ],
  },
  {
    id: 'quantum-physics',
    name: 'Quantum Mechanics & Modern Physics',
    icon: '⚛️',
    description: 'Griffiths Quantum Mechanics & MIT 8.04 — Wavefunctions, Schrödinger Equation, and Quantum Tunneling.',
    topics: [
      {
        id: 't-qm-wave',
        name: 'Wave-Particle Duality & Operators',
        category: 'Quantum Mechanics',
        description: 'de Broglie wavelength, Born probability interpretation of wavefunction, and Heisenberg Uncertainty Principle.',
        prerequisites: ['Classical Waves', 'Linear Differential Equations'],
        subtopics: ['Born Statistical Interpretation', 'Heisenberg Uncertainty dx*dp >= hbar/2', 'Hermitian Operators'],
        unitsCount: 2,
        estimatedHours: 6,
      },
      {
        id: 't-qm-schrodinger',
        name: 'Schrödinger Equation & Quantum Tunneling',
        category: 'Quantum Mechanics',
        description: 'Time-dependent and time-independent Schrödinger equations, infinite square well, and barrier penetration.',
        prerequisites: ['Wave-Particle Duality & Operators'],
        subtopics: ['Infinite Square Well (Particle in a Box)', 'Finite Potential Barrier & Tunneling', 'Harmonic Oscillator'],
        unitsCount: 2,
        estimatedHours: 7,
      },
    ],
    units: [
      {
        id: 'unit-qm-1',
        title: 'The Time-Independent Schrödinger Equation & Born Postulate',
        source: 'textbook',
        origin: 'Griffiths QM 3rd Ed. Chapter 2, p. 24',
        pageNumber: 24,
        topic: 'Schrödinger Equation & Quantum Tunneling',
        subtopic: 'Infinite Square Well (Particle in a Box)',
        content: `The time-independent Schrödinger equation takes the form: - (hbar^2 / 2m) * (d^2 psi / dx^2) + V(x) psi = E psi.
For the infinite square well with potential V(x) = 0 for 0 <= x <= a and infinity elsewhere, the boundary conditions require psi(0) = psi(a) = 0.
The allowable wavefunctions are standing sinusoidal waves: psi_n(x) = sqrt(2/a) * sin(n * pi * x / a), with quantized energies E_n = (n^2 * pi^2 * hbar^2) / (2 * m * a^2).
The lowest energy state E_1 is strictly greater than zero, representing zero-point energy mandated by the uncertainty principle.`,
        formula: 'E_n = (n^2 * pi^2 * hbar^2) / (2 * m * a^2); psi_n(x) = sqrt(2/a) * sin(n*pi*x/a)',
        prerequisites: ['Wave-Particle Duality & Operators'],
        keyTerms: ['Zero-Point Energy', 'Infinite Square Well', 'Quantized Eigenstates', 'Hamiltonian Operator'],
      },
    ],
  },
];

