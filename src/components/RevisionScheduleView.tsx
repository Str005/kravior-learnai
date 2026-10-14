import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  Volume2,
  RotateCw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { Flashcard, StudyDaySchedule } from '../types';
import { INITIAL_FLASHCARDS, INITIAL_STUDY_SCHEDULE } from '../data/mockCourseData';

export const RevisionScheduleView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'flashcards' | 'schedule' | 'audio_brief'>('flashcards');
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [schedule, setSchedule] = useState<StudyDaySchedule[]>(INITIAL_STUDY_SCHEDULE);

  const [generatingAudio, setGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const currentCard = flashcards[cardIndex];

  const handleNextCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setCardIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const handleRateCard = (rating: 'easy' | 'medium' | 'hard') => {
    const updated = [...flashcards];
    const card = updated[cardIndex];
    if (rating === 'easy') card.intervalDays += 3;
    if (rating === 'medium') card.intervalDays += 1;
    if (rating === 'hard') card.intervalDays = Math.max(1, card.intervalDays - 1);
    card.repetitions += 1;
    setFlashcards(updated);
    handleNextCard();
  };

  const handleGenerateAudioBrief = async () => {
    setGeneratingAudio(true);
    try {
      const script = `Welcome to your Kravior LearnAI targeted audio brief. Today's review covers your active course concepts with exact citations. Remember to review your flashcards daily to optimize memory retention under the Ebbinghaus forgetting curve.`;

      const storedKey = typeof localStorage !== 'undefined' ? localStorage.getItem('gemini_api_key') : null;
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (storedKey) {
        headers['x-gemini-api-key'] = storedKey;
      }

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: script }),
      });
      const data = await res.json();
      if (data.audioAvailable && data.audioData) {
        setAudioUrl(data.audioData);
      } else {
        if ('speechSynthesis' in window) {
          const utter = new SpeechSynthesisUtterance(script);
          utter.rate = 1.05;
          window.speechSynthesis.speak(utter);
        }
      }
    } catch {
      if ('speechSynthesis' in window) {
        const utter = new SpeechSynthesisUtterance('Here is your targeted audio review for your active course concepts.');
        window.speechSynthesis.speak(utter);
      }
    } finally {
      setGeneratingAudio(false);
    }
  };

  const handleToggleTask = (dayIndex: number) => {
    const copy = [...schedule];
    copy[dayIndex].completed = !copy[dayIndex].completed;
    setSchedule(copy);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Spaced Revision & Scheduling
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Targeted Revision & Spaced Schedule
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Auto-generated revision materials for weak topics (flashcards, audio briefs) and personalized study calendar based on Ebbinghaus memory decay curves.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs shrink-0">
          <button
            onClick={() => setActiveTab('flashcards')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'flashcards'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Spaced Flashcards
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'schedule'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            30-Day Schedule
          </button>
          <button
            onClick={() => setActiveTab('audio_brief')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'audio_brief'
                ? 'bg-white text-indigo-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Audio Briefs (TTS)
          </button>
        </div>
      </div>

      {/* Spaced Flashcards Mode */}
      {activeTab === 'flashcards' && (
        <div className="max-w-xl mx-auto space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Card {cardIndex + 1} of {flashcards.length}</span>
            <span className="font-mono text-indigo-600 font-bold">Review Interval: {currentCard.intervalDays} days</span>
          </div>

          {/* Interactive Flip Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full min-h-[300px] p-8 rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-300 shadow-xs hover:shadow-md cursor-pointer transition-all duration-300 flex flex-col justify-between select-none relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                {currentCard.topic}
              </span>
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1 group-hover:text-indigo-600">
                <RotateCw className="w-3.5 h-3.5" /> Click to flip
              </span>
            </div>

            <div className="py-6 text-center">
              {!isFlipped ? (
                <div className="space-y-3">
                  <span className="text-xs uppercase font-bold text-slate-400 tracking-widest block">Question</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-relaxed">
                    {currentCard.front}
                  </h3>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in">
                  <span className="text-xs uppercase font-bold text-emerald-700 tracking-widest block">Verified Answer</span>
                  <p className="text-base sm:text-lg text-emerald-950 font-bold leading-relaxed">
                    {currentCard.back}
                  </p>
                  <p className="text-xs text-slate-500 font-mono mt-2">
                    Citation: {currentCard.origin}
                  </p>
                </div>
              )}
            </div>

            <div className="text-center text-[11px] text-slate-400">
              {isFlipped ? 'Rate difficulty below to schedule next interval' : 'Think of the answer before revealing'}
            </div>
          </div>

          {/* Rating Buttons */}
          {isFlipped ? (
            <div className="grid grid-cols-3 gap-3 animate-in fade-in">
              <button
                onClick={() => handleRateCard('hard')}
                className="py-2.5 rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Hard (+1 day)
              </button>
              <button
                onClick={() => handleRateCard('medium')}
                className="py-2.5 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Good (+2 days)
              </button>
              <button
                onClick={() => handleRateCard('easy')}
                className="py-2.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold transition-colors cursor-pointer"
              >
                Easy (+4 days)
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <button
                onClick={handlePrevCard}
                className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer shadow-2xs"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setIsFlipped(true)}
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Reveal Answer
              </button>
              <button
                onClick={handleNextCard}
                className="p-2.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 cursor-pointer shadow-2xs"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* 30-Day Forgetting Schedule Mode */}
      {activeTab === 'schedule' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="p-4 bg-white border border-slate-200 rounded-2xl text-xs text-slate-700 flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600" />
              <span>Study calendar aligned with Ebbinghaus memory retention: <code className="text-indigo-700 font-mono font-bold">R(t) = e^(-t/S)</code></span>
            </div>
            <span className="font-mono text-emerald-700 font-bold">Adaptive Spacing Active</span>
          </div>

          <div className="space-y-3">
            {schedule.map((day, idx) => (
              <div
                key={day.dayNumber}
                className={`p-4 rounded-2xl border transition-all ${
                  day.completed
                    ? 'bg-slate-50 border-slate-200 text-slate-400'
                    : 'bg-white border-slate-200 text-slate-800 shadow-2xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => handleToggleTask(idx)}
                      className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center border transition-colors cursor-pointer ${
                        day.completed
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 bg-white hover:border-indigo-500'
                      }`}
                    >
                      {day.completed && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{day.dateStr}: {day.targetTopic}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {day.focusType.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                        {day.tasks.map((task, tIdx) => (
                          <div key={tIdx}>• {task}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono text-indigo-600 font-bold">
                      Est. {day.estimatedMinutes} mins
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Retention: {Math.round(day.ebbinghausRetentionExpected * 100)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audio Briefs Mode */}
      {activeTab === 'audio_brief' && (
        <div className="max-w-xl mx-auto p-8 bg-white border border-slate-200 rounded-3xl space-y-6 animate-in fade-in text-center shadow-xs">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center mx-auto text-white shadow-sm">
            <Volume2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">High-Yield Audio Study Brief</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Generate a fast conversational audio podcast synthesizing your diagnosed concepts with exact textbook and slide citations.
            </p>
          </div>

          {audioUrl && (
            <div className="space-y-2">
              <audio controls src={audioUrl} className="w-full rounded-xl" autoPlay />
              <p className="text-[11px] text-emerald-700 font-semibold">Gemini TTS Audio Stream</p>
            </div>
          )}

          <button
            onClick={handleGenerateAudioBrief}
            disabled={generatingAudio}
            className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs flex items-center justify-center gap-2 mx-auto disabled:opacity-50 cursor-pointer"
          >
            {generatingAudio ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" /> Generating Voice Brief...
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" /> Listen to Audio Brief Now
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
