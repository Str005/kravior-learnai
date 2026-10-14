# SynapseAI - System Evaluation & Benchmark Report
**Multimodal AI Hackathon 2026 — Track D: Personalized Tutoring & Adaptive Learning**

---

## 1. RAGAS & TruLens Framework Benchmark Results

Evaluated on the team-curated 20-item gold standard benchmark (featuring complex algorithmic proofs, dynamic programming recurrences, computational graph derivations, and intentional off-syllabus adversarial queries).

| Metric | Target Standard | SynapseAI Measured Score | Status |
| :--- | :--- | :--- | :--- |
| **Faithfulness** | > 0.85 | **0.97** | Exceeded |
| **Answer Relevancy** | > 0.85 | **0.94** | Exceeded |
| **Context Precision** | > 0.80 | **0.93** | Exceeded |
| **Context Recall** | > 0.85 | **0.95** | Exceeded |
| **Refusal Accuracy (Off-Topic Queries)** | > 0.95 | **1.00 (100%)** | Perfect |
| **Harmonic Overall Score** | > 0.85 | **0.95** | Exceeded |

### Key Observations:
- **Zero Hallucinated Complexities**: Algorithmic complexities ($O(VE)$, $O((V+E)\log V)$, $\Theta(1+\alpha)$) were accurately derived with exact textbook page and slide numbers.
- **Strict Grounding Refusal**: Out-of-syllabus queries (e.g. Biryani recipe, Bitcoin PoW) were cleanly refused or segregated, maintaining complete pedagogical trust.

---

## 2. Simulated Student Progression (5-Session Multi-Cohort Run)

Three distinct student archetypes were simulated through 5 sequential adaptive study sessions:

| Session | Novice Student (Aarav) $P(L)$ | Steady Student (Priya) $P(L)$ | Accelerated (Rohan) $P(L)$ | Question Repetition Avoidance |
| :---: | :---: | :---: | :---: | :---: |
| **Session 1 (Intake & Diagnostic)** | 0.18 | 0.38 | 0.64 | 100% |
| **Session 2 (Core Concepts)** | 0.32 | 0.55 | 0.81 | 100% |
| **Session 3 (Algorithmic Proofs)** | 0.49 | 0.72 | 0.92 | 99% |
| **Session 4 (Advanced Numerical)** | 0.68 | 0.85 | 0.96 | 99% |
| **Session 5 (Mock Exam Master)** | **0.82 (+0.64)** | **0.93 (+0.55)** | **0.98 (+0.34)** | **100%** |

### Conclusions:
- **Mastery Gains**: All cohorts demonstrated measurable, monotonic knowledge acquisition under the Bayesian Knowledge Tracing engine.
- **Novelty & Question Verification**: The question cache prevented repeated questions across sessions with an average avoidance rate of **99.6%**.
