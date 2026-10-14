import React from 'react';
import {
  MessageSquare,
  BookOpen,
  CheckSquare,
  BarChart3,
  Network,
  Activity,
  CalendarDays,
  Github,
  Globe,
  UserCheck,
  Sparkles,
  ShieldCheck,
  Upload,
} from 'lucide-react';
import { StudentProfile } from '../types';

export type AppTab =
  | 'tutor'
  | 'knowledge'
  | 'assessment'
  | 'learner'
  | 'flowmap'
  | 'evaluation'
  | 'revision';

interface NavbarProps {
  currentTab: AppTab;
  onSelectTab: (tab: AppTab) => void;
  activeProfile: StudentProfile;
  profiles: StudentProfile[];
  onSelectProfile: (profile: StudentProfile) => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  onOpenGithubModal: () => void;
  strictGrounding: boolean;
  onToggleStrictGrounding: () => void;
  unitsCount: number;
  onOpenUpload: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeProfile,
  profiles,
  onSelectProfile,
  language,
  onToggleLanguage,
  onOpenGithubModal,
  strictGrounding,
  onToggleStrictGrounding,
  unitsCount,
  onOpenUpload,
}) => {
  const tabs = [
    { id: 'tutor' as AppTab, label: 'Adaptive Tutor', icon: MessageSquare },
    { id: 'knowledge' as AppTab, label: 'Knowledge Base', icon: BookOpen, badge: unitsCount },
    { id: 'assessment' as AppTab, label: 'Assessments', icon: CheckSquare },
    { id: 'learner' as AppTab, label: 'Learner Model (BKT)', icon: BarChart3 },
    { id: 'flowmap' as AppTab, label: 'Prerequisite Graph', icon: Network },
    { id: 'evaluation' as AppTab, label: 'RAGAS Benchmark', icon: Activity },
    { id: 'revision' as AppTab, label: 'Revision & Schedule', icon: CalendarDays },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-2.5 border-b border-slate-100 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-slate-900 text-sm">SynapseAI</span>
              <span className="ml-2 text-[11px] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                Personalized Learning System
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 ml-4 pl-4 border-l border-slate-200 text-slate-500 text-xs">
            <span className={`inline-block w-2 h-2 rounded-full ${unitsCount > 0 ? 'bg-emerald-500' : 'bg-amber-400 animate-pulse'}`}></span>
            <span>
              {unitsCount > 0
                ? `${unitsCount} Ingested Sources (Active Knowledge Base)`
                : 'Zero Knowledge State: Drop in any PDF, textbook, or notes to train'}
            </span>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          {/* Quick Upload CTA */}
          <button
            onClick={onOpenUpload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold border border-indigo-200 transition-all cursor-pointer shadow-2xs"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>+ Add Material</span>
          </button>

          {/* Grounding Mode Toggle */}
          <button
            onClick={onToggleStrictGrounding}
            title={strictGrounding ? "Strict Grounding: Refuses outside queries not in uploaded materials" : "Permissive: General knowledge allowed with badges"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
              strictGrounding
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-amber-50 border-amber-200 text-amber-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline">Grounding:</span> {strictGrounding ? 'Strict Material Only' : 'Open'}
          </button>

          {/* Language Switch */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-600" />
            <span>{language === 'en' ? 'English' : 'हिंदी / Hinglish'}</span>
          </button>

          {/* Student Profile Switcher */}
          <div className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-xs">
            <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
            <select
              value={activeProfile.id}
              onChange={(e) => {
                const found = profiles.find((p) => p.id === e.target.value);
                if (found) onSelectProfile(found);
              }}
              className="bg-transparent text-slate-800 text-xs font-medium focus:outline-none cursor-pointer"
            >
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.level})
                </option>
              ))}
            </select>
          </div>

          {/* GitHub & CI/CD Button */}
          <button
            onClick={onOpenGithubModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub & CI/CD</span>
          </button>
        </div>
      </div>

      {/* Main Tab Bar */}
      <nav className="flex items-center gap-1.5 px-4 lg:px-8 py-2 overflow-x-auto scrollbar-none bg-slate-50/60 border-t border-slate-100">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isActive ? 'bg-white text-indigo-600' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
