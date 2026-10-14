import React from 'react';
import {
  BookOpen,
  CheckSquare,
  BarChart3,
  Calendar,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Brain,
  Sparkles,
  Clock,
  PlayCircle,
  FileText,
  Upload,
  Download,
} from 'lucide-react';
import { Course, LearnerMastery, StudentProfile, MultimodalUnit } from '../types';
import { getMasteryLevel } from '../utils/bkt';

interface DashboardViewProps {
  activeCourse: Course;
  courses: Course[];
  masteryList: LearnerMastery[];
  activeProfile: StudentProfile;
  units: MultimodalUnit[];
  onNavigate: (page: any) => void;
  onOpenUpload: () => void;
  onOpenAnalyticsReport?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  activeCourse,
  courses,
  masteryList,
  activeProfile,
  units,
  onNavigate,
  onOpenUpload,
  onOpenAnalyticsReport,
}) => {
  const learnerDisplayName = activeProfile.name?.trim() ? activeProfile.name : 'Learner';

  const averageMastery =
    masteryList.length > 0
      ? Number(
          (masteryList.reduce((acc, m) => acc + m.pL, 0) / masteryList.length).toFixed(2)
        )
      : 0;

  const weakTopics = masteryList.filter((m) => m.pL < 0.5);
  const masteredTopics = masteryList.filter((m) => m.pL >= 0.8);

  // Calculate days remaining before target exam
  const examDate = new Date(activeProfile.examDate || activeCourse.examDate);
  const today = new Date();
  const diffTime = examDate.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Top Welcome & Target Overview */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              {activeCourse.code}: {activeCourse.title}
            </span>
            <span className="text-xs text-indigo-700 font-semibold font-mono">
              Target date in {daysRemaining} days
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Welcome back, {learnerDisplayName}
          </h1>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Your personalized learning model has indexed {units.length} course sources. All recommendations and quiz questions are grounded in your materials.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {onOpenAnalyticsReport && (
            <button
              onClick={onOpenAnalyticsReport}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-indigo-600" />
              <span>PDF Report</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('tutor')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Launch AI Tutor</span>
          </button>

          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Add Sources</span>
          </button>
        </div>
      </div>

      {/* 4 Key Stat Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Overall Module Mastery</span>
            <Brain className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">
            {Math.round(averageMastery * 100)}%
          </div>
          <p className="text-[11px] text-slate-400">
            Target: {Math.round(activeCourse.targetMastery * 100)}% by target date
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Indexed Knowledge Units</span>
            <BookOpen className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">{units.length}</div>
          <p className="text-[11px] text-slate-400">Textbooks, slides & video lectures</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Weak Topics Identified</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-3xl font-black text-rose-600">{weakTopics.length}</div>
          <p className="text-[11px] text-slate-400">
            {weakTopics.length > 0 ? 'Prioritized in revision planner' : 'All topics on track'}
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Days Until Target</span>
            <Calendar className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-3xl font-black text-slate-900">{daysRemaining}</div>
          <p className="text-[11px] text-slate-400">Scheduled on {activeCourse.examDate}</p>
        </div>
      </div>

      {/* Main Grid: Recommended Action & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recommended Next Actions & Topic Mastery Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prioritized Action Card */}
          <div className="bg-indigo-50/60 border border-indigo-200/90 rounded-2xl p-6 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Recommended Next Action
              </span>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-white text-indigo-800 border border-indigo-200">
                High Priority
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">
                {weakTopics.length > 0
                  ? `Targeted Practice: ${weakTopics[0].topicName}`
                  : units.length > 0
                  ? 'Comprehensive Adaptive Mock Assessment'
                  : 'Ingest Your First Course Material'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {weakTopics.length > 0
                  ? `Your Bayesian Knowledge Tracing score for this concept is ${Math.round(weakTopics[0].pL * 100)}%. Completing 3 verified practice questions will update your posterior mastery.`
                  : units.length > 0
                  ? 'All initial topics are in developing status. Take a 5-question adaptive assessment to test cross-topic retention.'
                  : 'Upload a textbook PDF or lecture transcript in the Course Library to establish your knowledge base.'}
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => onNavigate(weakTopics.length > 0 || units.length > 0 ? 'assessment' : 'library')}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>{units.length > 0 ? 'Start Adaptive Assessment' : 'Upload Course Materials'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onNavigate('revision')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors cursor-pointer"
              >
                Review Flashcards
              </button>
            </div>
          </div>

          {/* Topic Mastery Distribution */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Topic-Level Mastery Overview</h3>
                <p className="text-xs text-slate-400">Real-time Bayesian posterior estimates</p>
              </div>
              <button
                onClick={() => onNavigate('analytics')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                Full Analytics <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {masteryList.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No active topics. Ingest materials to start tracking mastery.
              </div>
            ) : (
              <div className="space-y-3">
                {masteryList.map((m) => {
                  const level = getMasteryLevel(m.pL);
                  const pct = Math.round(m.pL * 100);
                  return (
                    <div key={m.topicId} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{m.topicName}</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${level.badgeBg}`}>
                            {level.label}
                          </span>
                          <span className="font-mono font-bold text-slate-700 min-w-8 text-right">
                            {pct}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Recent Study Activity & Weak Topics Sidebar */}
        <div className="space-y-6">
          {/* Weak Topics Card */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                Attention Required ({weakTopics.length})
              </span>
            </div>

            {weakTopics.length === 0 ? (
              <p className="text-xs text-slate-500 py-2">
                All assessed concepts are above the 50% mastery threshold.
              </p>
            ) : (
              <div className="space-y-2">
                {weakTopics.map((wt) => (
                  <div
                    key={wt.topicId}
                    className="p-3 bg-rose-50/70 border border-rose-200/80 rounded-xl text-xs space-y-1"
                  >
                    <div className="font-bold text-rose-900">{wt.topicName}</div>
                    <div className="text-[11px] text-rose-700 flex items-center justify-between">
                      <span>P(L) = {Math.round(wt.pL * 100)}%</span>
                      <button
                        onClick={() => onNavigate('assessment')}
                        className="font-bold text-rose-800 hover:underline cursor-pointer"
                      >
                        Practice →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Activity Timeline */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 space-y-3 shadow-2xs">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <Clock className="w-4 h-4 text-slate-400" /> Recent Study Activity
            </span>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Assessment: Shortest Path Algorithms</div>
                  <div className="text-[10px] text-slate-400">Score: 2/2 • Delta: +0.12 P(L) • 25 mins ago</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Tutor Inquiry: DAG Topological Order</div>
                  <div className="text-[10px] text-slate-400">2 citations reviewed • 1 hour ago</div>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Flashcard Review Session</div>
                  <div className="text-[10px] text-slate-400">4 cards reviewed • Yesterday</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
