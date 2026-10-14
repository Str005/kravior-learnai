# SynapseAI - Technical Architecture & Methodology Documentation
**Multimodal AI Hackathon 2026 — Track D: Personalized Tutoring & Adaptive Learning**

---

## 1. System Overview & Architecture

SynapseAI is a full-stack, multimodal AI study companion designed to unify lecture videos, textbooks, and slide decks into a unified, source-cited knowledge base. It delivers adaptive assessments, Bayesian Knowledge Tracing (BKT) learner modeling, and verifiable source grounding.

```
+-----------------------------------------------------------------------------------+
|                              Client (React 19 + Vite)                             |
|  [Knowledge Base] [Grounded Tutor] [Adaptive Quiz] [BKT Model] [Course Flow DAG]  |
|         [RAGAS Evaluation] [Flashcards & Spaced Schedule] [CI/CD & GitHub]        |
+-----------------------------------------------------------------------------------+
                                       |
                       HTTP / JSON REST API / Audio Streams
                                       v
+-----------------------------------------------------------------------------------+
|                        Server-Side Engine (Express + Node 22)                     |
|  • Ingestion & Concept Extraction Parser                                          |
|  • Strict Grounding & Citation Verifier                                           |
|  • Adaptive Assessment Generator & Cross-Model Verification                       |
|  • Bayesian Knowledge Tracing Engine (Corbett & Anderson BKT)                     |
|  • RAGAS Benchmark Scoring Harness (Faithfulness, Relevancy, Precision, Recall)   |
+-----------------------------------------------------------------------------------+
                                       |
                   Google GenAI SDK (User-Agent: aistudio-build)
                                       v
+-----------------------------------------------------------------------------------+
|                       Gemini Models (API Key via Secrets)                         |
|  • gemini-3.8-flash: Grounded tutoring, question generation & verification, RAGAS |
|  • gemini-3.8-flash-lite-tts: Speech generation for audio study briefs            |
+-----------------------------------------------------------------------------------+
```

---

## 2. Multimodal Knowledge Base & Ingestion Pipeline

### A. Ingestion Workflow
- Ingests **Lecture Videos** (with timestamp indexing `MM:SS`, YouTube embed anchors, and prof transcript segments).
- Ingests **Textbooks** (chapter, section, and page numbering with verbatim excerpt preservation).
- Ingests **Slide Decks** (slide numbers, bulleted concept breakdowns, and mathematical formulas).
- Extracts visual figures and diagrams (stored as vector SVGs and descriptive captions) to ground visual-spatial reasoning.

### B. Prerequisite Graph Construction (DAG)
Every content unit is tagged with:
1. `topic` and `subtopic`
2. `origin` (e.g. `CLRS p. 651`, `Slide 14`, `Lecture 15 @ 14:20`)
3. `prerequisites` (e.g. `Edge Relaxation` -> `Bellman-Ford Algorithm` -> `Negative Cycle Detection`)

---

## 3. Grounding & Strictness Mechanism

### A. Verifiable Citations
Every assistant response generates structured citation tags that link directly to:
- A slide preview
- A textbook page viewer with excerpt highlighting
- A video lecture player pre-seeked to the exact second

### B. Refusal of Unsupported Queries
When **Strict Grounding Mode** is enabled, the model evaluates whether user queries fall within the uploaded course syllabus.
- In-Scope queries: answered with verbatim cited excerpts.
- Off-Scope queries (e.g., recipes, external topics): explicitly declined or flagged with a refusal warning, strictly isolating external knowledge from syllabus truth.

---

## 4. Learner Model: Bayesian Knowledge Tracing (BKT)

The learner model tracks student mastery $P(L)$ across all course topics using the classic Bayesian Knowledge Tracing algorithm:

### Equations:
1. **Observation Update:**
   - On Correct Answer:
     $$P(L_t \mid \text{Correct}) = \frac{P(L_t)(1 - P(S))}{P(L_t)(1 - P(S)) + (1 - P(L_t))P(G)}$$
   - On Incorrect Answer:
     $$P(L_t \mid \text{Incorrect}) = \frac{P(L_t)P(S)}{P(L_t)P(S) + (1 - P(L_t))(1 - P(G))}$$

2. **Transition (Learning Rate):**
   $$P(L_{t+1}) = P(L_t \mid \text{Obs}) + (1 - P(L_t \mid \text{Obs})) \times P(T)$$

Where:
- $P(L_0) = 0.20$ (Prior knowledge)
- $P(T) = 0.22$ (Transition probability / learning step)
- $P(G) = 0.20$ (Guess probability)
- $P(S) = 0.12$ (Slip probability)

### Ebbinghaus Spaced Repetition Retention:
$$R(t) = e^{-t / S}$$
Retention decays over elapsed days $t$, but stability $S$ expands geometrically with each successful repetition.

---

## 5. Automated CI/CD Pipelines

Included in `.github/workflows/`:
1. `ci-cd.yml`: Linting, TypeScript validation, production build, Docker containerization, and Cloud Run / Container deploy.
2. `ragas-benchmark.yml`: Continuous benchmarking checking Faithfulness, Answer Relevancy, and Question Repetition Rate on schedule.
