import React from 'react';
import { MultimodalUnit, SourceCitation } from '../types';
import { X, ExternalLink, Video, BookOpen, Presentation, CheckCircle2, Sparkles } from 'lucide-react';

interface SourceViewerModalProps {
  citation: SourceCitation | null;
  unit: MultimodalUnit | null;
  onClose: () => void;
  onAskTutor?: (prompt: string) => void;
}

export const SourceViewerModal: React.FC<SourceViewerModalProps> = ({
  citation,
  unit,
  onClose,
  onAskTutor,
}) => {
  if (!citation && !unit) return null;

  const source = unit?.source || citation?.source || 'textbook';
  const origin = unit?.origin || citation?.origin || 'Course Material';
  const title = unit?.title || `Citation from ${origin}`;
  const content = unit?.content || citation?.excerpt || '';

  const getSourceIcon = () => {
    switch (source) {
      case 'video':
        return <Video className="w-5 h-5 text-rose-600" />;
      case 'slide':
        return <Presentation className="w-5 h-5 text-amber-600" />;
      default:
        return <BookOpen className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200">
              {getSourceIcon()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {source} Origin
                </span>
                <span className="text-xs text-slate-500 font-mono">{origin}</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-1">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {source === 'video' && (
            <div className="space-y-3">
              <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden shadow-inner">
                {unit?.videoUrl ? (
                  <iframe
                    src={unit.videoUrl}
                    title={title}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-6 text-center">
                    <Video className="w-12 h-12 mb-2 text-rose-500 animate-pulse" />
                    <p className="text-sm font-bold text-white">Synchronized Video Lecture</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Seeked to exact timestamp: <span className="font-mono text-rose-400 font-bold">{unit?.timestamp || '14:20'}</span>
                    </p>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Timestamp: <strong className="text-slate-800">{unit?.timestamp || '14:20'}</strong></span>
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Synchronized with lecture transcript
                </span>
              </div>
            </div>
          )}

          {source === 'slide' && (
            <div className="space-y-3">
              <div className="p-6 bg-amber-50/50 rounded-2xl border border-amber-200 shadow-2xs">
                <div className="flex items-center justify-between mb-4 border-b border-amber-200/80 pb-3">
                  <span className="text-xs font-mono uppercase text-amber-800 font-bold flex items-center gap-1.5">
                    <Presentation className="w-4 h-4" /> Slide Deck Presentation #{unit?.slideNumber || 1}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                    Course Slide
                  </span>
                </div>
                <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line">
                  {content}
                </div>
              </div>
            </div>
          )}

          {source === 'textbook' && (
            <div className="space-y-3">
              <div className="p-6 bg-slate-50/80 rounded-2xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4" /> Textbook Page Citation
                  </span>
                  <span className="text-xs font-mono text-slate-500">{origin}</span>
                </div>
                <div className="text-sm text-slate-800 leading-relaxed whitespace-pre-line border-l-3 border-indigo-600 pl-4 py-1">
                  {content}
                </div>
              </div>
            </div>
          )}

          {unit?.formula && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                Canonical Formula
              </span>
              <code className="text-sm font-mono text-indigo-700 font-bold block bg-white p-2.5 rounded-xl border border-slate-200">
                {unit.formula}
              </code>
            </div>
          )}

          {unit?.keyTerms && unit.keyTerms.length > 0 && (
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Tagged Terms & Prerequisites
              </span>
              <div className="flex flex-wrap gap-1.5">
                {unit.keyTerms.map((term, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono font-medium"
                  >
                    #{term}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Source Origin: <strong className="text-slate-800">{origin}</strong>
          </span>
          <div className="flex items-center gap-2">
            {onAskTutor && (
              <button
                onClick={() => {
                  onClose();
                  onAskTutor(`Please explain the concept in ${origin} (${title}) in detail with practical step-by-step intuition.`);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Ask Tutor About This
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
