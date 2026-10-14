import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Brain,
  Award,
  Clock,
  Zap,
  UserPlus,
  Info,
  CheckCircle2,
  FileText,
  Download,
} from 'lucide-react';
import { LearnerMastery, StudentProfile, BKTParameters } from '../types';
import { DEFAULT_BKT_PARAMS, getMasteryLevel, calculateRetention } from '../utils/bkt';

interface LearnerDashboardViewProps {
  masteryList: LearnerMastery[];
  activeProfile: StudentProfile;
  onResetMastery?: () => void;
  onStartDiagnostic?: () => void;
  onOpenAnalyticsReport?: () => void;
}

export const LearnerDashboardView: React.FC<LearnerDashboardViewProps> = ({
  masteryList,
  activeProfile,
  onResetMastery,
  onStartDiagnostic,
  onOpenAnalyticsReport,
}) => {
  const [showBktFormulaModal, setShowBktFormulaModal] = useState(false);
  const [bktParams] = useState<BKTParameters>(DEFAULT_BKT_PARAMS);

  const learnerName = activeProfile.name?.trim() ? activeProfile.name : 'Learner';

  const averageMastery =
    masteryList.length > 0
      ? Number(
          (masteryList.reduce((acc, m) => acc + m.pL, 0) / masteryList.length).toFixed(2)
        )
      : 0;

  const totalAttemptsAcrossCourse = masteryList.reduce((acc, m) => acc + m.totalAttempts, 0);
  const totalCorrectAcrossCourse = masteryList.reduce((acc, m) => acc + m.correctAttempts, 0);
  const accuracyRate =
    totalAttemptsAcrossCourse > 0
      ? Math.round((totalCorrectAcrossCourse / totalAttemptsAcrossCourse) * 100)
      : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header Banner */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Personalized Adaptive Model
            </span>
            <span className="text-xs text-slate-500 font-medium">Real-Time Knowledge Tracking</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Learning Progress & Topic Mastery
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Tracks your concept comprehension in real-time, dynamically updating your mastery estimates and study recommendations after every practice interaction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onOpenAnalyticsReport && (
            <button
              onClick={onOpenAnalyticsReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download PDF Summary</span>
            </button>
          )}

          <div className="flex items-center gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 shrink-0">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-bold text-base shadow-xs">
              {Math.round(averageMastery * 100)}%
            </div>
            <div>
              <div className="text-[11px] text-slate-500 font-medium">Active Profile:</div>
              <div className="text-sm font-bold text-slate-900">{learnerName}</div>
              <div className="text-[11px] text-indigo-600 capitalize font-medium">{activeProfile.level} Tier</div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metric Gauges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Brain className="w-4 h-4 text-indigo-600" /> Average Topic Mastery P(L)
          </span>
          <div className="text-2xl font-black text-slate-900">{averageMastery.toFixed(2)} / 1.00</div>
          <p className="text-[11px] text-slate-400">Latent mastery expectation</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Award className="w-4 h-4 text-emerald-600" /> Total Verified Questions
          </span>
          <div className="text-2xl font-black text-slate-900">{totalAttemptsAcrossCourse}</div>
          <p className="text-[11px] text-emerald-600 font-semibold">{accuracyRate}% Empirical Accuracy</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-amber-600" /> Forgetting Stability
          </span>
          <div className="text-2xl font-black text-amber-600">
            {Math.round(calculateRetention(2, 2) * 100)}%
          </div>
          <p className="text-[11px] text-slate-400">Retention decay expectation</p>
        </div>

        <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-1">
          <span className="text-xs text-slate-500 flex items-center gap-1.5 font-medium">
            <Zap className="w-4 h-4 text-cyan-600" /> Learning Velocity Rate
          </span>
          <div className="text-2xl font-black text-cyan-700">{bktParams.pT}</div>
          <p className="text-[11px] text-slate-400">Concept acquisition rate</p>
        </div>
      </div>

      {/* Per-Topic BKT Mastery Breakdown */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              Topic Knowledge State Estimates
            </h3>
            <p className="text-xs text-slate-500">
              Calibrated in real-time after every question and tutor explanation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {onOpenAnalyticsReport && (
              <button
                onClick={onOpenAnalyticsReport}
                className="text-xs px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 cursor-pointer font-semibold"
              >
                <FileText className="w-3.5 h-3.5" /> Export PDF Summary
              </button>
            )}
            <button
              onClick={() => setShowBktFormulaModal(true)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center gap-1.5 cursor-pointer font-medium"
            >
              <Brain className="w-3.5 h-3.5" /> View BKT Equations & Priors
            </button>
          </div>
        </div>

        {/* Topic Bars */}
        <div className="space-y-3">
          {masteryList.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">
              No topics in active knowledge base. Ingest course material to track topic mastery.
            </p>
          ) : (
            masteryList.map((item) => {
              const mastery = getMasteryLevel(item.pL);
              const percentage = Math.round(item.pL * 100);

              return (
                <div
                  key={item.topicId}
                  className="p-4 bg-slate-50/70 border border-slate-200 rounded-2xl space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.topicName}</h4>
                      <span className="text-[11px] text-slate-500">
                        {item.correctAttempts} / {item.totalAttempts} correct • Last practiced: {item.lastPracticed}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold border ${mastery.badgeBg}`}>
                        {mastery.label}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-900 min-w-10 text-right">
                        {percentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-indigo-500 to-indigo-600"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Cold Start / Diagnostic Intake CTA */}
      <div className="p-6 bg-indigo-50/60 border border-indigo-200 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <UserPlus className="w-4 h-4 text-indigo-700" />
            <h4 className="text-sm font-bold text-slate-900">Cold-Start Student Intake & Baseline Diagnostic</h4>
          </div>
          <p className="text-xs text-slate-600 max-w-xl">
            For students with zero prior history: calibrate initial prior mastery $P(L_0)$ using our 3-minute diagnostic assessment.
          </p>
        </div>

        {onStartDiagnostic && (
          <button
            onClick={onStartDiagnostic}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs cursor-pointer"
          >
            Run Diagnostic Intake
          </button>
        )}
      </div>

      {/* BKT Formula Modal */}
      {showBktFormulaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">BKT Mathematical Formulation</h3>
              <button
                onClick={() => setShowBktFormulaModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Bayesian Knowledge Tracing models cognition using 4 parameters:
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-indigo-700 font-bold font-mono">P(L₀) = {bktParams.pL0}</span> (Prior Knowledge):
                <p className="text-slate-500 text-[11px] mt-0.5">Initial probability of knowing a topic before any observation.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-cyan-700 font-bold font-mono">P(T) = {bktParams.pT}</span> (Learning Transition):
                <p className="text-slate-500 text-[11px] mt-0.5">Probability of learning the concept after a practice opportunity.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-amber-700 font-bold font-mono">P(G) = {bktParams.pG}</span> (Guess Probability):
                <p className="text-slate-500 text-[11px] mt-0.5">Probability of answering correctly despite not knowing.</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-rose-700 font-bold font-mono">P(S) = {bktParams.pS}</span> (Slip Probability):
                <p className="text-slate-500 text-[11px] mt-0.5">Probability of making an error despite possessing mastery.</p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowBktFormulaModal(false)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
