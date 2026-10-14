export type MediumSource = 'textbook' | 'slide' | 'video' | 'image' | 'notes';

export interface Course {
  id: string;
  title: string;
  code: string;
  description: string;
  category: string;
  examDate: string; // ISO date string e.g. 2026-11-20
  targetMastery: number; // e.g. 0.85
  createdAt: string;
}

export interface IngestedResource {
  id: string;
  courseId: string;
  filename: string;
  fileType: 'pdf' | 'pptx' | 'video' | 'image' | 'text';
  fileSizeMb: number;
  status: 'processing' | 'indexed' | 'failed';
  errorMessage?: string;
  pageCount?: number;
  slideCount?: number;
  durationSeconds?: number;
  chunksCount: number;
  detectedTopics: string[];
  uploadedAt: string;
}

export interface MultimodalUnit {
  id: string;
  courseId?: string;
  title: string;
  source: MediumSource;
  origin: string; // e.g. "CLRS Ch. 24, p. 651", "Slide 14", "Lecture 15 @ 14:20"
  filename?: string;
  pageNumber?: number;
  slideNumber?: number;
  timestamp?: string; // e.g. "14:20"
  videoSeconds?: number;
  videoUrl?: string;
  topic: string;
  subtopic: string;
  content: string;
  diagramSvg?: string;
  diagramCaption?: string;
  formula?: string;
  prerequisites: string[];
  keyTerms: string[];
  tokenCount?: number;
}

export interface TopicNode {
  id: string;
  courseId?: string;
  name: string;
  category: string;
  description: string;
  prerequisites: string[];
  subtopics: string[];
  unitsCount: number;
  estimatedHours: number;
}

export interface BKTParameters {
  pL0: number; // Prior probability of mastery [0.0 - 1.0]
  pT: number;  // Transition (learning) probability
  pG: number;  // Guess probability
  pS: number;  // Slip probability
}

export interface LearnerMastery {
  topicId: string;
  topicName: string;
  courseId?: string;
  pL: number; // Current posterior probability of mastery [0.0 - 1.0]
  totalAttempts: number;
  correctAttempts: number;
  lastPracticed: string;
  forgettingRetention: number;
  history: {
    timestamp: string;
    pL: number;
    delta: number;
    isCorrect: boolean;
    questionId: string;
  }[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: 'novice' | 'intermediate' | 'advanced';
  isDiagnosticCompleted: boolean;
  intakeNotes?: string;
  examDate: string;
  studyGoalHoursWeekly: number;
  preferredLanguage: 'en' | 'hi';
  activeCourseId: string;
}

export interface SourceCitation {
  source: MediumSource;
  origin: string;
  excerpt: string;
  unitId?: string;
  pageNumber?: number;
  slideNumber?: number;
  timestamp?: string;
  videoUrl?: string;
  topic?: string;
}

export interface AssessmentQuestion {
  id: string;
  fingerprint?: string; // Normalized string to avoid duplicate questions
  courseId?: string;
  topic: string;
  subtopic: string;
  type: 'mcq' | 'short_answer' | 'numerical';
  difficulty: 'novice' | 'intermediate' | 'advanced';
  prompt: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer: string;
  numericalTolerance?: number; // for numerical questions
  explanation: string;
  sourceCitation: SourceCitation;
  verified: boolean;
  verificationScore: number;
  verificationRationale?: string;
  prerequisites: string[];
}

export interface QuestionFeedback {
  questionId: string;
  studentAnswer: string | number;
  isCorrect: boolean;
  score: number;
  feedback: string;
  misconceptionDetected: string | null;
  citedExcerpt: string;
  sourceOrigin: string;
  remedialAction?: string;
}

export interface AssessmentReport {
  id: string;
  courseId?: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  difficulty: string;
  topicsCovered: string[];
  feedbacks: QuestionFeedback[];
  weakTopics: string[];
  identifiedMisconceptions: string[];
  suggestedPrerequisites: string[];
  bktDeltas: { topic: string; before: number; after: number }[];
  recommendedNextTask: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  citations?: SourceCitation[];
  isGrounded?: boolean;
  refusedOutsideScope?: boolean;
  suggestedPrerequisites?: string[];
  audioUrl?: string;
}

export interface RAGASTestCase {
  id: string;
  query: string;
  category: 'algorithm' | 'proof' | 'diagram' | 'off_topic' | 'numerical';
  groundTruthOrigin: string;
  groundTruthAnswer: string;
  retrievedContextSample: string;
  isOffTopic: boolean;
  baselineFaithfulness: number;
  baselineRelevancy: number;
  baselinePrecision: number;
  baselineRecall: number;
}

export interface RAGASEvalResult {
  testId: string;
  query: string;
  isOffTopic: boolean;
  faithfulness: number;
  answerRelevancy: number;
  contextPrecision: number;
  contextRecall: number;
  refusalAccuracy: number;
  overallScore: number;
  generatedAnswer: string;
  critique: string;
}

export interface SimulatedStudentProfile {
  id: string;
  name: string;
  archetype: 'struggling_novice' | 'steady_learner' | 'accelerated_fast_track';
  description: string;
  bktParams: BKTParameters;
  sessions: {
    sessionNumber: number;
    averageMastery: number;
    questionsAttempted: number;
    correctCount: number;
    repeatQuestionsAvoidedRatio: number;
  }[];
}

export interface Flashcard {
  id: string;
  courseId?: string;
  topic: string;
  subtopic: string;
  front: string;
  back: string;
  origin: string;
  difficulty: 'easy' | 'medium' | 'hard';
  repetitions: number;
  intervalDays: number;
  nextReviewDate: string;
}

export interface StudyDaySchedule {
  dayNumber: number;
  dateStr: string;
  targetTopic: string;
  focusType: 'concept_review' | 'adaptive_quiz' | 'deep_dive_diagrams' | 'mock_exam';
  tasks: string[];
  estimatedMinutes: number;
  completed: boolean;
  ebbinghausRetentionExpected: number;
  priorityScore?: number;
}
