import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  CheckSquare,
  BarChart3,
  CalendarDays,
  Network,
  Settings,
  Sparkles,
  Key,
  Edit3,
  X,
} from 'lucide-react';
import { StudentProfile, Course } from '../types';

export type SaaSPage =
  | 'dashboard'
  | 'library'
  | 'tutor'
  | 'assessment'
  | 'analytics'
  | 'revision'
  | 'flowmap'
  | 'settings';

interface SidebarProps {
  currentPage: SaaSPage;
  onSelectPage: (page: SaaSPage) => void;
  activeProfile: StudentProfile;
  profiles: StudentProfile[];
  onSelectProfile: (profile: StudentProfile) => void;
  activeCourse: Course;
  courses: Course[];
  onSelectCourse: (course: Course) => void;
  unitsCount: number;
  onOpenGithubModal: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
  hasCustomApiKey?: boolean;
  onOpenApiKeyModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onSelectPage,
  activeProfile,
  profiles,
  onSelectProfile,
  activeCourse,
  courses,
  onSelectCourse,
  unitsCount,
  onOpenGithubModal,
  isMobileOpen,
  setIsMobileOpen,
  hasCustomApiKey = false,
  onOpenApiKeyModal,
}) => {
  const navItems = [
    { id: 'dashboard' as SaaSPage, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tutor' as SaaSPage, label: 'Interactive AI Tutor', icon: MessageSquare },
    { id: 'library' as SaaSPage, label: 'Study Sources', icon: BookOpen, badge: unitsCount },
    { id: 'assessment' as SaaSPage, label: 'Adaptive Practice', icon: CheckSquare },
    { id: 'analytics' as SaaSPage, label: 'Mastery Progress', icon: BarChart3 },
    { id: 'revision' as SaaSPage, label: 'Revision Planner', icon: CalendarDays },
    { id: 'flowmap' as SaaSPage, label: 'Concept Map', icon: Network },
    { id: 'settings' as SaaSPage, label: 'Settings', icon: Settings },
  ];

  const profileDisplayName = activeProfile.name?.trim() ? activeProfile.name : 'Learner';

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* App Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block">
                Kravior LearnAI
              </span>
              <span className="text-[10px] text-slate-400 font-medium">Personalized Tutoring Platform</span>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Module Selector */}
        <div className="p-3 border-b border-slate-800/60">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-2 mb-1">
            Current Module
          </div>
          <div className="relative">
            <select
              value={activeCourse.id}
              onChange={(e) => {
                const found = courses.find((c) => c.id === e.target.value);
                if (found) onSelectCourse(found);
              }}
              className="w-full bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 text-white rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                  {c.code}: {c.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* API Key Status & Learner Profile Card */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {/* Custom API Key Button */}
          {onOpenApiKeyModal && (
            <button
              onClick={onOpenApiKeyModal}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                hasCustomApiKey
                  ? 'bg-emerald-950/40 hover:bg-emerald-950/60 border-emerald-700/60 text-emerald-300'
                  : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <Key className={`w-3.5 h-3.5 ${hasCustomApiKey ? 'text-emerald-400' : 'text-amber-400'}`} />
                <span>{hasCustomApiKey ? 'Gemini Key Configured' : 'Set Gemini API Key'}</span>
              </div>
              <span className={`w-2 h-2 rounded-full ${hasCustomApiKey ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            </button>
          )}

          {/* Abstract Learner Profile Card */}
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/50 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-base">{activeProfile.avatar || '👤'}</span>
              <div>
                <div className="text-xs font-bold text-white line-clamp-1">{profileDisplayName}</div>
                <div className="text-[10px] text-slate-400 capitalize">{activeProfile.level} Tier</div>
              </div>
            </div>
            <button
              onClick={() => onSelectPage('settings')}
              title="Edit Profile"
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
