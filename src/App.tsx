import React, { useState, useEffect } from 'react';
import { Sidebar, SaaSPage } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { CourseLibraryView } from './components/CourseLibraryView';
import { TutorChatView } from './components/TutorChatView';
import { AdaptiveAssessmentView } from './components/AdaptiveAssessmentView';
import { LearnerDashboardView } from './components/LearnerDashboardView';
import { CourseFlowMapView } from './components/CourseFlowMapView';
import { RevisionScheduleView } from './components/RevisionScheduleView';
import { SettingsView } from './components/SettingsView';
import { SourceViewerModal } from './components/SourceViewerModal';
import { GithubCiCdExportModal } from './components/GithubCiCdExportModal';
import { AnalyticsReport } from './components/AnalyticsReport';
import { ApiKeyModal } from './components/ApiKeyModal';

import {
  MultimodalUnit,
  LearnerMastery,
  StudentProfile,
  SourceCitation,
  TopicNode,
  Course,
  IngestedResource,
} from './types';
import {
  PRESET_COURSES,
  CoursePreset,
  INITIAL_MULTIMODAL_UNITS,
  CS_ALGORITHMS_TOPICS,
} from './data/mockCourseData';
import { updateBKT } from './utils/bkt';
import { Menu, Globe, ShieldCheck, Key } from 'lucide-react';

const INITIAL_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Foundational Algorithms & Computational Models',
    code: 'Track 01',
    description: 'Graph algorithms, Bellman-Ford, Dynamic Programming, and Computational Graph Backpropagation.',
    category: 'Computer Science',
    examDate: '2026-11-20',
    targetMastery: 0.85,
    createdAt: '2026-09-01',
  },
  {
    id: 'course-2',
    title: 'Molecular Biology & Genetic Regulation',
    code: 'Track 02',
    description: 'DNA Replication, Helicase, Okazaki synthesis, and Gene regulation mechanisms.',
    category: 'Biology',
    examDate: '2026-12-05',
    targetMastery: 0.80,
    createdAt: '2026-09-10',
  },
  {
    id: 'course-3',
    title: 'Wave Dynamics & Quantum States',
    code: 'Track 03',
    description: 'Schrödinger wave mechanics, infinite potential wells, and quantum barrier tunneling.',
    category: 'Physics',
    examDate: '2026-12-15',
    targetMastery: 0.90,
    createdAt: '2026-09-15',
  },
];

// Abstracted learner profile: No student name assumed until user provides one
const INITIAL_PROFILES: StudentProfile[] = [
  {
    id: 'prof-learner-1',
    name: '', // Starts empty as requested
    email: '',
    avatar: '👤',
    level: 'intermediate',
    isDiagnosticCompleted: false,
    examDate: '2026-11-20',
    studyGoalHoursWeekly: 8,
    preferredLanguage: 'en',
    activeCourseId: 'course-1',
  },
  {
    id: 'prof-learner-2',
    name: '',
    email: '',
    avatar: '👤',
    level: 'novice',
    isDiagnosticCompleted: false,
    examDate: '2026-11-20',
    studyGoalHoursWeekly: 6,
    preferredLanguage: 'en',
    activeCourseId: 'course-1',
  },
  {
    id: 'prof-learner-3',
    name: '',
    email: '',
    avatar: '👤',
    level: 'advanced',
    isDiagnosticCompleted: false,
    examDate: '2026-11-20',
    studyGoalHoursWeekly: 12,
    preferredLanguage: 'en',
    activeCourseId: 'course-1',
  },
];

const INITIAL_RESOURCES: IngestedResource[] = [
  {
    id: 'res-textbook-ch24',
    courseId: 'course-1',
    filename: 'Algorithms_Core_Principles_Chapter.pdf',
    fileType: 'pdf',
    fileSizeMb: 4.2,
    status: 'indexed',
    pageCount: 32,
    chunksCount: 6,
    detectedTopics: ['Bellman-Ford Algorithm', 'Negative Weight Cycles', 'Shortest Paths'],
    uploadedAt: 'Today at 09:15',
  },
  {
    id: 'res-lecture-slides',
    courseId: 'course-1',
    filename: 'Lecture_Unit_15_Slides.pptx',
    fileType: 'pptx',
    fileSizeMb: 12.8,
    status: 'indexed',
    slideCount: 28,
    chunksCount: 4,
    detectedTopics: ['Pass Invariant', 'Sufficiency Proof'],
    uploadedAt: 'Today at 09:18',
  },
  {
    id: 'res-lecture-transcript',
    courseId: 'course-1',
    filename: 'Lecture_Session_Transcript.txt',
    fileType: 'text',
    fileSizeMb: 0.8,
    status: 'indexed',
    durationSeconds: 3120,
    chunksCount: 3,
    detectedTopics: ['Edge Relaxation Proof', 'DAG Orderings'],
    uploadedAt: 'Today at 09:20',
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<SaaSPage>('dashboard');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [activeCourse, setActiveCourse] = useState<Course>(INITIAL_COURSES[0]);

  // Knowledge base state: starts pre-loaded or can be wiped / preset-switched
  const [multimodalUnits, setMultimodalUnits] = useState<MultimodalUnit[]>(INITIAL_MULTIMODAL_UNITS);
  const [resources, setResources] = useState<IngestedResource[]>(INITIAL_RESOURCES);
  const [topics, setTopics] = useState<TopicNode[]>(CS_ALGORITHMS_TOPICS);

  // Student Profiles
  const [profiles, setProfiles] = useState<StudentProfile[]>(INITIAL_PROFILES);
  const [activeProfile, setActiveProfile] = useState<StudentProfile>(INITIAL_PROFILES[0]);

  // Bayesian Knowledge Tracing initial state
  const [masteryList, setMasteryList] = useState<LearnerMastery[]>([
    {
      topicId: 't-graphs',
      topicName: 'Graph Algorithms & Shortest Paths',
      pL: 0.62,
      totalAttempts: 12,
      correctAttempts: 9,
      lastPracticed: 'Today',
      forgettingRetention: 0.92,
      history: [
        { timestamp: '10:00 AM', pL: 0.45, delta: 0.12, isCorrect: true, questionId: 'q-init-1' },
        { timestamp: '10:15 AM', pL: 0.54, delta: 0.09, isCorrect: true, questionId: 'q-init-2' },
        { timestamp: '10:30 AM', pL: 0.62, delta: 0.08, isCorrect: true, questionId: 'q-init-3' },
      ],
    },
    {
      topicId: 't-dp',
      topicName: 'Dynamic Programming & Memoization',
      pL: 0.44,
      totalAttempts: 8,
      correctAttempts: 4,
      lastPracticed: 'Yesterday',
      forgettingRetention: 0.84,
      history: [
        { timestamp: 'Yesterday', pL: 0.35, delta: 0.09, isCorrect: true, questionId: 'q-dp-init' },
        { timestamp: 'Yesterday', pL: 0.44, delta: -0.05, isCorrect: false, questionId: 'q-dp-init-2' },
      ],
    },
    {
      topicId: 't-neural',
      topicName: 'Neural Networks & Optimization',
      pL: 0.52,
      totalAttempts: 10,
      correctAttempts: 6,
      lastPracticed: '2 days ago',
      forgettingRetention: 0.78,
      history: [
        { timestamp: '2d ago', pL: 0.42, delta: 0.10, isCorrect: true, questionId: 'q-nn-init' },
      ],
    },
    {
      topicId: 't-hashing',
      topicName: 'Hashing & Amortized Analysis',
      pL: 0.82,
      totalAttempts: 15,
      correctAttempts: 13,
      lastPracticed: 'Today',
      forgettingRetention: 0.96,
      history: [
        { timestamp: 'Today', pL: 0.75, delta: 0.07, isCorrect: true, questionId: 'q-hash-init' },
      ],
    },
  ]);

  // Global Controls
  const [strictGrounding, setStrictGrounding] = useState<boolean>(true);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Gemini API Key management
  const [apiKey, setApiKey] = useState<string>(() => {
    return typeof localStorage !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '';
  });

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('gemini_api_key', newKey);
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('gemini_api_key');
    }
  };

  // Modals
  const [modalCitation, setModalCitation] = useState<SourceCitation | null>(null);
  const [modalUnit, setModalUnit] = useState<MultimodalUnit | null>(null);
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [isAnalyticsReportOpen, setIsAnalyticsReportOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Dynamic BKT Update
  const handleBktUpdate = (topicName: string, isCorrect: boolean, questionId: string) => {
    setMasteryList((prev) => {
      const existing = prev.find(
        (item) => item.topicName === topicName || topicName.includes(item.topicName.split(' ')[0])
      );
      if (existing) {
        return prev.map((item) => {
          if (item.topicId === existing.topicId) {
            const { newPL, delta } = updateBKT(item.pL, isCorrect);
            return {
              ...item,
              pL: newPL,
              totalAttempts: item.totalAttempts + 1,
              correctAttempts: item.correctAttempts + (isCorrect ? 1 : 0),
              lastPracticed: 'Just now',
              history: [
                ...item.history,
                {
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  pL: newPL,
                  delta,
                  isCorrect,
                  questionId,
                },
              ],
            };
          }
          return item;
        });
      }

      // If untracked, add with initial prior
      const initialPL = isCorrect ? 0.35 : 0.15;
      const newEntry: LearnerMastery = {
        topicId: `t-${Date.now()}`,
        topicName,
        pL: initialPL,
        totalAttempts: 1,
        correctAttempts: isCorrect ? 1 : 0,
        lastPracticed: 'Just now',
        forgettingRetention: 0.95,
        history: [
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            pL: initialPL,
            delta: isCorrect ? 0.15 : -0.05,
            isCorrect,
            questionId,
          },
        ],
      };
      return [...prev, newEntry];
    });
  };

  const handleAddUnit = (newUnit: MultimodalUnit) => {
    setMultimodalUnits((prev) => [newUnit, ...prev]);

    setTopics((prev) => {
      if (!prev.some((t) => t.name.toLowerCase() === newUnit.topic.toLowerCase())) {
        const newTopic: TopicNode = {
          id: `topic-${Date.now()}`,
          name: newUnit.topic,
          category: activeCourse.category,
          description: `Extracted from ${newUnit.origin}`,
          prerequisites: newUnit.prerequisites || [],
          subtopics: [newUnit.subtopic],
          unitsCount: 1,
          estimatedHours: 3,
        };
        return [...prev, newTopic];
      }
      return prev.map((t) => {
        if (t.name.toLowerCase() === newUnit.topic.toLowerCase()) {
          return {
            ...t,
            subtopics: Array.from(new Set([...t.subtopics, newUnit.subtopic])),
            unitsCount: t.unitsCount + 1,
          };
        }
        return t;
      });
    });

    setMasteryList((prev) => {
      if (!prev.some((m) => m.topicName.toLowerCase() === newUnit.topic.toLowerCase())) {
        return [
          ...prev,
          {
            topicId: `t-${Date.now()}`,
            topicName: newUnit.topic,
            pL: 0.25,
            totalAttempts: 0,
            correctAttempts: 0,
            lastPracticed: 'Just added',
            forgettingRetention: 1.0,
            history: [],
          },
        ];
      }
      return prev;
    });
  };

  const handleAddResource = (res: IngestedResource) => {
    setResources((prev) => [res, ...prev]);
  };

  const handleDeleteResource = (id: string) => {
    setResources((prev) => prev.filter((r) => r.id !== id));
  };

  const handleRetryResource = (id: string) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'indexed', errorMessage: undefined } : r))
    );
  };

  const handleLoadPreset = (preset: CoursePreset) => {
    setMultimodalUnits(preset.units);
    setTopics(preset.topics);
    setMasteryList(
      preset.topics.map((t, idx) => ({
        topicId: t.id,
        topicName: t.name,
        pL: idx === 0 ? 0.65 : 0.35,
        totalAttempts: idx === 0 ? 5 : 2,
        correctAttempts: idx === 0 ? 4 : 1,
        lastPracticed: 'Today',
        forgettingRetention: 0.92,
        history: [],
      }))
    );
  };

  const handleClearAllUnits = () => {
    setMultimodalUnits([]);
    setResources([]);
    setTopics([]);
    setMasteryList([]);
  };

  const handleResetLearnerData = () => {
    setMasteryList((prev) =>
      prev.map((m) => ({
        ...m,
        pL: 0.2,
        totalAttempts: 0,
        correctAttempts: 0,
        history: [],
      }))
    );
  };

  const handleOpenCitation = (citation: SourceCitation) => {
    const matched = multimodalUnits.find(
      (u) =>
        u.origin.toLowerCase() === citation.origin.toLowerCase() ||
        u.title.toLowerCase().includes(citation.origin.toLowerCase())
    );
    setModalCitation(citation);
    setModalUnit(matched || null);
  };

  const handleOpenUnit = (unit: MultimodalUnit) => {
    setModalUnit(unit);
    setModalCitation({
      source: unit.source,
      origin: unit.origin,
      excerpt: unit.content,
      unitId: unit.id,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* SaaS Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onSelectPage={setCurrentPage}
        activeProfile={activeProfile}
        profiles={profiles}
        onSelectProfile={setActiveProfile}
        activeCourse={activeCourse}
        courses={courses}
        onSelectCourse={setActiveCourse}
        unitsCount={multimodalUnits.length}
        onOpenGithubModal={() => setIsGithubModalOpen(true)}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        hasCustomApiKey={!!apiKey}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-14 bg-white/95 border-b border-slate-200/90 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden text-slate-600 hover:text-slate-900 p-1 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="text-xs font-semibold text-slate-500 flex items-center gap-2">
              <span className="font-bold text-slate-900">{activeCourse.code}</span>
              <span>/</span>
              <span className="capitalize">{currentPage}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Gemini API Key Trigger */}
            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                apiKey
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
              }`}
              title="Configure Gemini API Key"
            >
              <Key className={`w-3.5 h-3.5 ${apiKey ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span className="hidden sm:inline">
                {apiKey ? 'API Key Active' : 'Set API Key'}
              </span>
            </button>

            {/* Grounding Mode Indicator */}
            <button
              onClick={() => setStrictGrounding(!strictGrounding)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                strictGrounding
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>{strictGrounding ? 'Strict Grounding' : 'Open RAG'}</span>
            </button>

            {/* Language Switch */}
            <button
              onClick={() => setLanguage((l) => (l === 'en' ? 'hi' : 'en'))}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>{language === 'en' ? 'English' : 'Hinglish'}</span>
            </button>
          </div>
        </header>

        {/* Page Views */}
        <main className="flex-1 pb-16">
          {currentPage === 'dashboard' && (
            <DashboardView
              activeCourse={activeCourse}
              courses={courses}
              masteryList={masteryList}
              activeProfile={activeProfile}
              units={multimodalUnits}
              onNavigate={setCurrentPage}
              onOpenUpload={() => setCurrentPage('library')}
              onOpenAnalyticsReport={() => setIsAnalyticsReportOpen(true)}
            />
          )}

          {currentPage === 'library' && (
            <CourseLibraryView
              activeCourse={activeCourse}
              units={multimodalUnits}
              resources={resources}
              onOpenUnit={handleOpenUnit}
              onAddUnit={handleAddUnit}
              onAddResource={handleAddResource}
              onDeleteResource={handleDeleteResource}
              onRetryResource={handleRetryResource}
              onLoadPreset={handleLoadPreset}
              onClearAll={handleClearAllUnits}
            />
          )}

          {currentPage === 'tutor' && (
            <TutorChatView
              multimodalUnits={multimodalUnits}
              strictGrounding={strictGrounding}
              language={language}
              activeProfile={activeProfile}
              onOpenCitation={handleOpenCitation}
              onBktUpdateFromChat={(topic, success) => handleBktUpdate(topic, success, 'chat-turn')}
              onOpenUpload={() => setCurrentPage('library')}
              onAddUnit={handleAddUnit}
              onAddResource={handleAddResource}
            />
          )}

          {currentPage === 'assessment' && (
            <AdaptiveAssessmentView
              multimodalUnits={multimodalUnits}
              onBktUpdate={handleBktUpdate}
              onOpenCitation={handleOpenCitation}
              weakTopics={masteryList.filter((m) => m.pL < 0.5).map((m) => m.topicName)}
              onOpenUpload={() => setCurrentPage('library')}
            />
          )}

          {currentPage === 'analytics' && (
            <LearnerDashboardView
              masteryList={masteryList}
              activeProfile={activeProfile}
              onResetMastery={handleResetLearnerData}
              onStartDiagnostic={() => setCurrentPage('assessment')}
              onOpenAnalyticsReport={() => setIsAnalyticsReportOpen(true)}
            />
          )}

          {currentPage === 'revision' && <RevisionScheduleView />}

          {currentPage === 'flowmap' && (
            <CourseFlowMapView
              topics={topics}
              masteryList={masteryList}
              multimodalUnits={multimodalUnits}
              onSelectTopicForPractice={(topic) => setCurrentPage('assessment')}
              onOpenUnit={handleOpenUnit}
            />
          )}

          {currentPage === 'settings' && (
            <SettingsView
              activeProfile={activeProfile}
              onUpdateProfile={setActiveProfile}
              activeCourse={activeCourse}
              onUpdateCourse={setActiveCourse}
              onResetLearnerData={handleResetLearnerData}
              onClearAllUnits={handleClearAllUnits}
              apiKey={apiKey}
              onSaveApiKey={handleSaveApiKey}
              onClearApiKey={handleClearApiKey}
              onOpenGithubModal={() => setIsGithubModalOpen(true)}
            />
          )}
        </main>
      </div>

      {/* Citation Evidence Viewer Modal */}
      {(modalCitation || modalUnit) && (
        <SourceViewerModal
          citation={modalCitation}
          unit={modalUnit}
          onClose={() => {
            setModalCitation(null);
            setModalUnit(null);
          }}
          onAskTutor={(prompt) => {
            setCurrentPage('tutor');
          }}
        />
      )}

      {/* Analytics Mastery PDF Report Modal */}
      <AnalyticsReport
        isOpen={isAnalyticsReportOpen}
        onClose={() => setIsAnalyticsReportOpen(false)}
        masteryList={masteryList}
        activeProfile={activeProfile}
        activeCourse={activeCourse}
      />

      {/* Gemini API Key Modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
        onClearKey={handleClearApiKey}
      />

      {/* GitHub & CI/CD Deployment Modal */}
      <GithubCiCdExportModal
        isOpen={isGithubModalOpen}
        onClose={() => setIsGithubModalOpen(false)}
      />
    </div>
  );
}
