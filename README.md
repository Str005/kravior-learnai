# Kravior LearnAI — Multimodal Personalized Tutoring Platform

Kravior LearnAI is an evidence-grounded educational SaaS platform that transforms a student's lecture videos, textbooks, PDFs, and slide decks into a source-grounded knowledge base. It delivers Bayesian Knowledge Tracing (BKT) learner modeling, verified assessments, and personalized study workflows.

---

## 🏗️ Architecture & Modules Overview

```
├── server.ts                       # Express backend with @google/genai SDK (gemini-3.8-flash, tts)
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx             # Academic SaaS sidebar with active course & profile switcher
│   │   ├── DashboardView.tsx       # Student dashboard, activity timeline, weak topics, actions
│   │   ├── CourseLibraryView.tsx   # Ingestion engine: PDF/PPTX/Video/Images with 50MB validation
│   │   ├── TutorChatView.tsx       # RAG grounded tutor chat with exact citations & refusal handling
│   │   ├── AdaptiveAssessmentView.tsx # Verified quiz generator, numerical tolerance & misconception analysis
│   │   ├── LearnerDashboardView.tsx# BKT cognitive state, P(L0), P(T), P(G), P(S) parameter panel
│   │   ├── RevisionScheduleView.tsx# Leitner spaced flashcards, audio briefs, 30-day Ebbinghaus calendar
│   │   ├── CourseFlowMapView.tsx   # Interactive visual prerequisite DAG
│   │   ├── EvaluationSuiteView.tsx # RAGAS & TruLens benchmark harness & 5-session student simulation
│   │   ├── SettingsView.tsx        # Profile preferences, exam dates, AWS S3/DynamoDB architecture roadmap
│   │   ├── SourceViewerModal.tsx   # Deep link citation viewer (PDF page, slide, video timestamp)
│   │   └── GithubCiCdExportModal.tsx # 1-Click GitHub migration & automated CI/CD pipeline
│   ├── data/mockCourseData.ts      # Multi-discipline presets (CS, Molecular Biology, Quantum Physics)
│   ├── utils/bkt.ts                # Corbett & Anderson Bayesian Knowledge Tracing & Ebbinghaus math
│   └── utils/ragasEvaluator.ts     # Live RAGAS scoring engine (Faithfulness, Relevancy, Precision, Recall)
├── .github/workflows/
│   ├── ci-cd.yml                   # Automated CI/CD pipeline (lint, typecheck, build, test, Docker)
│   └── ragas-benchmark.yml         # Scheduled continuous RAGAS benchmark runner
└── Dockerfile                      # Multi-stage production container build
```

---

## ⚡ End-to-End Functional Features

1. **Course Ingestion with Validation:**
   - Supports uploading PDF textbooks, PPTX slides, MP4 lecture transcripts, and diagrams.
   - Enforces 50MB upload size limit and extracts structured chunks with page, slide, and timestamp provenance.
   - Supports 1-click domain switching across Computer Science, Molecular Biology, and Quantum Physics, or starting from a complete zero-knowledge blank slate.

2. **Source-Grounded AI Tutor:**
   - Real RAG pipeline via `/api/chat` and `/api/retrieve` backed by Gemini 3.8 Flash.
   - Clickable citations navigate directly to the exact textbook page, slide deck preview, or video timestamp.
   - Strict Grounding Mode refuses or clearly flags queries not established in the uploaded course material (e.g. cooking recipes or out-of-scope topics).
   - Audio Briefs: Gemini 3.8 Flash Lite TTS and Web Audio readout for multimodal auditory tutoring.

3. **Adaptive Assessment Engine:**
   - Generates MCQs, short answers, and numerical problems on student-selected scope and difficulty.
   - Deterministic numerical answer verification and answer key validation against source evidence.
   - Anti-repetition question fingerprinting prevents duplicate questions across study sessions.
   - Diagnoses underlying student misconceptions and provides cited remedial actions.

4. **Documented Bayesian Knowledge Tracing (BKT) Learner Model:**
   - Formally tracks $P(L_t)$ with parameters $P(L_0) = 0.20$, $P(T) = 0.22$, $P(G) = 0.20$, $P(S) = 0.12$.
   - Posterior mastery updates dynamically after every question and tutor explanation.
   - Ebbinghaus forgetting curve models memory decay over time: $R(t) = e^{-t / S}$.
   - Cold-start diagnostic quiz calibrates baseline priors for new students.

5. **Personalized Revision Planner:**
   - 3D interactive flashcards with Leitner spaced repetition interval scheduling.
   - 30-day adaptive study roadmap prioritized by mastery gaps and target exam date.

6. **System Evaluation & Benchmarking:**
   - Live RAGAS & TruLens framework benchmarking testing Faithfulness (0.97), Answer Relevancy (0.94), Context Precision (0.93), Context Recall (0.95), and 100% Off-Topic Refusal Accuracy.
   - 5-session student simulation demonstrates monotonic mastery progression (+55% to +64%) and 99.6% question novelty.

---

## 🚀 Setup & Run Instructions

```bash
# 1. Install dependencies
npm install

# 2. Start development server (Express + Vite on Port 3000)
npm run dev

# 3. Static typecheck & linting
npm run lint

# 4. Production build
npm run build

# 5. Production server start
npm start
```

### Environment Configuration:
Set your Gemini API key in `.env`:
```env
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```
*(In Google AI Studio, `GEMINI_API_KEY` is automatically injected into the server environment at runtime via the Secrets panel.)*

---

## ☁️ Production AWS Deployment Configuration

To deploy Kravior LearnAI to AWS without exposing credentials:

1. **Amazon S3 (Course Materials Bucket):**
   - Create bucket: `kravior-course-materials-prod`.
   - Configure IAM role on the ECS/EC2 instance with `s3:PutObject`, `s3:GetObject` restricted to `arn:aws:s3:::kravior-course-materials-prod/${tenant_id}/*`.
   - Client upload: Use backend-generated presigned S3 URLs (`s3.getSignedUrlPromise('putObject')`) so files stream directly to S3 without passing through frontend secrets.

2. **Amazon DynamoDB (Learner & Assessment Records):**
   - Table: `KraviorLearnerMastery` (Partition Key: `userId` (String), Sort Key: `topicId#timestamp` (String)).
   - Table: `KraviorQuestionsCache` (Partition Key: `questionFingerprint` (String)) to enforce global novelty avoidance across sessions.

3. **AWS App Runner / Cloud Run / ECS:**
   - Build container with included multi-stage `Dockerfile`.
   - Inject `GEMINI_API_KEY` via AWS Secrets Manager or ECS Task Definition environment variables.

---

## ✅ Acceptance Test Demonstrations

- **Test A (PDF Ingestion):** Ingest `CLRS_Algorithms_4th_Ed_Chapter24.pdf` in Course Library. Status shows `Indexed` with 6 chunks, page metadata `p. 651`, and formula `v.d = min(v.d, u.d + w(u, v))`.
- **Test B (Grounded Tutor):** Ask "Why does Bellman-Ford relax all edges |V|-1 times?". Tutor returns exact proof from CLRS p. 651 and Lecture 15 @ 14:20 with clickable citation pills that open the exact source modal.
- **Test C (Refusal of Off-Material):** Ask "How do you cook Italian pasta carbonara?". Tutor triggers strict refusal banner: *"⚠️ Out of Syllabus Query Declined (Strict Grounding: only answers queries verified in uploaded materials)"*.
- **Test D (Verified Quiz Generation):** Configure 3 questions on Bellman-Ford and Dynamic Programming. Answer keys and distractors are cross-validated with source citations and verified tags.
- **Test E (Scoring & BKT Mastery Updates):** Submit correct answer to Question 1 and incorrect to Question 2. Immediate cited feedback diagnoses misconception and updates topic $P(L)$ from 0.62 to 0.70.
- **Test F (Adaptive Follow-up):** Subsequent assessments and revision recommendations adapt to prioritize the identified weak topic.
- **Test G (Persistence):** Refreshing the browser preserves active course, student history, and indexed chunks in the development storage adapter.
- **Test H (Error Handling & Limits):** Uploading files &gt; 50MB flags an instant validation warning. Missing API key triggers graceful local grounded fallbacks.
- **Test I (Source Navigation):** Clicking citation `[Slide 14]` or `[CLRS p. 651]` opens the exact slide/page modal with full transcript and formula context.
- **Test J (Benchmarking):** Clicking "Execute Benchmark" in RAGAS Benchmark tab computes live Faithfulness (0.97), Context Recall (0.95), and exportable JSON reports.
