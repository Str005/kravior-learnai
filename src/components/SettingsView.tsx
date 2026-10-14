import React, { useState } from 'react';
import {
  User,
  CheckCircle2,
  Trash2,
  Key,
  RefreshCw,
  ExternalLink,
  Github,
} from 'lucide-react';
import { StudentProfile, Course } from '../types';

interface SettingsViewProps {
  activeProfile: StudentProfile;
  onUpdateProfile: (profile: StudentProfile) => void;
  activeCourse: Course;
  onUpdateCourse: (course: Course) => void;
  onResetLearnerData: () => void;
  onClearAllUnits: () => void;
  apiKey?: string;
  onSaveApiKey?: (key: string) => void;
  onClearApiKey?: () => void;
  onOpenGithubModal?: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  activeProfile,
  onUpdateProfile,
  activeCourse,
  onUpdateCourse,
  onResetLearnerData,
  onClearAllUnits,
  apiKey = '',
  onSaveApiKey,
  onClearApiKey,
  onOpenGithubModal,
}) => {
  const [name, setName] = useState(activeProfile.name);
  const [level, setLevel] = useState(activeProfile.level);
  const [examDate, setExamDate] = useState(activeProfile.examDate || activeCourse.examDate);
  const [weeklyHours, setWeeklyHours] = useState(activeProfile.studyGoalHoursWeekly || 6);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // API Key State
  const [inputKey, setInputKey] = useState(apiKey);
  const [validatingKey, setValidatingKey] = useState(false);
  const [keyStatus, setKeyStatus] = useState<{
    valid: boolean;
    message: string;
  } | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...activeProfile,
      name,
      level,
      examDate,
      studyGoalHoursWeekly: Number(weeklyHours),
    });
    onUpdateCourse({
      ...activeCourse,
      examDate,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleTestAndSaveKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = inputKey.trim();
    if (!cleanKey) {
      setKeyStatus({
        valid: false,
        message: 'Please enter a valid Gemini API key.',
      });
      return;
    }

    setValidatingKey(true);
    setKeyStatus(null);

    try {
      const response = await fetch('/api/validate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': cleanKey,
        },
      });

      const data = await response.json();
      if (response.ok && data.valid) {
        setKeyStatus({
          valid: true,
          message: data.message || 'Key connected and verified successfully!',
        });
        if (onSaveApiKey) onSaveApiKey(cleanKey);
      } else {
        setKeyStatus({
          valid: false,
          message: data.message || 'Key validation failed. Please check the key.',
        });
      }
    } catch (err: any) {
      setKeyStatus({
        valid: false,
        message: err.message || 'Network error while testing API key.',
      });
    } finally {
      setValidatingKey(false);
    }
  };

  const handleClearKey = () => {
    setInputKey('');
    setKeyStatus(null);
    if (onClearApiKey) onClearApiKey();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Personal Preferences
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Settings & Study Configuration
          </h2>
          <p className="text-sm text-slate-500 max-w-xl">
            Configure your Gemini API key, learner profile, study goals, and manage your learning records.
          </p>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Learner profile and preferences updated successfully!</span>
        </div>
      )}

      {/* Gemini API Key Configuration Section */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Gemini AI Model Key</h3>
              <p className="text-xs text-slate-500">Provide your personal key for reliable, unlimited tutoring</p>
            </div>
          </div>
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
              apiKey
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {apiKey ? 'Personal Key Active' : 'Default Runtime Key'}
          </span>
        </div>

        <form onSubmit={handleTestAndSaveKey} className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">Gemini API Key</label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1"
              >
                <span>Get a free key from Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={inputKey}
                onChange={(e) => {
                  setInputKey(e.target.value);
                  setKeyStatus(null);
                }}
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 transition-colors shadow-2xs"
              />
              <button
                type="submit"
                disabled={validatingKey}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
              >
                {validatingKey ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <>
                    <Key className="w-3.5 h-3.5" />
                    <span>Validate & Save</span>
                  </>
                )}
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 text-xs font-semibold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {keyStatus && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                keyStatus.valid
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              {keyStatus.valid ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <Key className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{keyStatus.message}</span>
            </div>
          )}
        </form>
      </div>

      {/* Profile & Course Form */}
      <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <User className="w-4 h-4 text-indigo-600" /> Learner Profile & Study Schedule
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">
              Learner Name <span className="font-normal text-slate-400">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Alex"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Proficiency Cohort</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
            >
              <option value="novice">Novice (Intake diagnostics & fundamentals)</option>
              <option value="intermediate">Intermediate (Standard curriculum pace)</option>
              <option value="advanced">Advanced (Accelerated derivations & proofs)</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Target Assessment Date</label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600 cursor-pointer"
            />
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Weekly Study Target (Hours)</label>
            <input
              type="number"
              min={1}
              max={40}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Number(e.target.value))}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
          >
            Save Profile Preferences
          </button>
        </div>
      </form>

      {/* Data Management Controls */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <Trash2 className="w-4 h-4 text-rose-600" /> Study History & Data Controls
        </h3>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <div className="font-bold text-slate-800">Reset Study Practice History</div>
            <div className="text-slate-500">Clears question history and recalibrates topic mastery scores.</div>
          </div>
          <button
            type="button"
            onClick={onResetLearnerData}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 font-semibold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            Reset Practice History
          </button>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs pt-3 border-t border-slate-100">
          <div>
            <div className="font-bold text-slate-800">Clear Uploaded Study Materials</div>
            <div className="text-slate-500">Removes all uploaded textbook excerpts and slide notes.</div>
          </div>
          <button
            type="button"
            onClick={onClearAllUnits}
            className="px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold transition-colors cursor-pointer self-start sm:self-auto shrink-0"
          >
            Clear Study Materials
          </button>
        </div>
      </div>

      {/* Optional Export for developers at bottom */}
      {onOpenGithubModal && (
        <div className="pt-2 flex justify-end">
          <button
            type="button"
            onClick={onOpenGithubModal}
            className="text-xs text-slate-400 hover:text-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Developer: Export Project Repository</span>
          </button>
        </div>
      )}
    </div>
  );
};
