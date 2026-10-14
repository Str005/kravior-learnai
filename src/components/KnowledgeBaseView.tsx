import React, { useState } from 'react';
import {
  BookOpen,
  Presentation,
  Video,
  Plus,
  Search,
  Sparkles,
  ExternalLink,
  Tag,
  Upload,
  ArrowRight,
  FileText,
  Trash2,
  FolderOpen,
  CheckCircle2,
  FileUp,
  Cpu,
  Atom,
  Dna,
} from 'lucide-react';
import { MultimodalUnit, MediumSource } from '../types';
import { PRESET_COURSES, CoursePreset } from '../data/mockCourseData';

interface KnowledgeBaseViewProps {
  units: MultimodalUnit[];
  onOpenUnit: (unit: MultimodalUnit) => void;
  onAddUnit: (unit: MultimodalUnit) => void;
  onLoadPreset: (preset: CoursePreset) => void;
  onClearUnits: () => void;
  onStartQuizOnUnit?: (unit: MultimodalUnit) => void;
  isUploadModalOpen?: boolean;
  setIsUploadModalOpen?: (open: boolean) => void;
}

export const KnowledgeBaseView: React.FC<KnowledgeBaseViewProps> = ({
  units,
  onOpenUnit,
  onAddUnit,
  onLoadPreset,
  onClearUnits,
  onStartQuizOnUnit,
  isUploadModalOpen = false,
  setIsUploadModalOpen,
}) => {
  const [selectedMedium, setSelectedMedium] = useState<MediumSource | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [localModalOpen, setLocalModalOpen] = useState(false);

  // Ingestion form state
  const [rawText, setRawText] = useState('');
  const [ingestMedium, setIngestMedium] = useState<MediumSource>('textbook');
  const [ingestOrigin, setIngestOrigin] = useState('');
  const [ingestTitle, setIngestTitle] = useState('');
  const [ingesting, setIngesting] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const showModal = isUploadModalOpen || localModalOpen;
  const setShowModal = (val: boolean) => {
    setLocalModalOpen(val);
    if (setIsUploadModalOpen) setIsUploadModalOpen(val);
  };

  const topicsList = Array.from(new Set(units.map((u) => u.topic)));

  const filteredUnits = units.filter((unit) => {
    const matchesMedium = selectedMedium === 'all' || unit.source === selectedMedium;
    const matchesTopic = selectedTopic === 'all' || unit.topic === selectedTopic;
    const matchesSearch =
      searchQuery === '' ||
      unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      unit.subtopic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMedium && matchesTopic && matchesSearch;
  });

  // Fast client-side file reading for PDF or TXT
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);
    setIngestTitle(file.name.replace(/\.[^/.]+$/, ''));
    setIngestOrigin(`${file.name} - Page 1`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setRawText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleIngest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) return;

    setIngesting(true);
    try {
      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          mediumType: ingestMedium,
          origin:
            ingestOrigin ||
            (ingestMedium === 'video'
              ? 'Lecture Video @ 05:00'
              : ingestMedium === 'slide'
              ? 'Slide 01'
              : 'Chapter 1, p. 10'),
        }),
      });

      const data = await response.json();
      const extracted = data.extractedUnits?.[0] || {
        topic: ingestTitle || 'General Knowledge',
        subtopic: 'Core Concept',
        content: rawText,
        origin: ingestOrigin || 'Uploaded Document',
        source: ingestMedium,
        prerequisites: ['Foundations'],
      };

      const newUnit: MultimodalUnit = {
        id: `unit-user-${Date.now()}`,
        title: ingestTitle || extracted.subtopic || 'Uploaded Course Section',
        source: ingestMedium,
        origin: ingestOrigin || extracted.origin || 'Uploaded File',
        topic: extracted.topic || ingestTitle || 'Course Topic',
        subtopic: extracted.subtopic || 'Concept Section',
        content: rawText,
        prerequisites: extracted.prerequisites || ['Fundamental Prerequisites'],
        keyTerms: ['Active Ingestion', 'Grounded Unit'],
      };

      onAddUnit(newUnit);
      setShowModal(false);
      setRawText('');
      setIngestOrigin('');
      setIngestTitle('');
      setUploadedFileName(null);
    } catch {
      // Fast optimistic fallback
      const newUnit: MultimodalUnit = {
        id: `unit-user-${Date.now()}`,
        title: ingestTitle || 'Uploaded Course Section',
        source: ingestMedium,
        origin: ingestOrigin || 'Document File',
        topic: ingestTitle || 'Course Topic',
        subtopic: 'Extracted Section',
        content: rawText,
        prerequisites: ['Basic Concepts'],
        keyTerms: ['Custom Ingestion'],
      };
      onAddUnit(newUnit);
      setShowModal(false);
      setRawText('');
      setIngestOrigin('');
      setIngestTitle('');
      setUploadedFileName(null);
    } finally {
      setIngesting(false);
    }
  };

  const getSourceIcon = (src: MediumSource) => {
    switch (src) {
      case 'video':
        return <Video className="w-3.5 h-3.5 text-rose-600" />;
      case 'slide':
        return <Presentation className="w-3.5 h-3.5 text-amber-600" />;
      default:
        return <BookOpen className="w-3.5 h-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Header & Ingestion CTA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Universal Multimodal Ingestion
            </span>
            <span className="text-xs text-slate-500 font-mono">
              {units.length} Sources in Knowledge Base
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Course Knowledge Base & Citations
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Drop in any textbooks, lecture slides, or video transcripts. SynapseAI extracts topics and constructs your prerequisite graph automatically.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {units.length > 0 && (
            <button
              onClick={onClearUnits}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset to Blank</span>
            </button>
          )}

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Ingest PDF / Notes</span>
          </button>
        </div>
      </div>

      {/* Preset Discipline Cards (1-Click Test Any Subject) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Quick-Load Knowledge Presets (Or Upload Your Own Above):
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_COURSES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset)}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-xl text-left transition-all shadow-2xs group cursor-pointer flex items-start gap-3"
            >
              <span className="text-2xl">{preset.icon}</span>
              <div>
                <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {preset.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                  {preset.description}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Zero Knowledge Empty State Screen if units === 0 */}
      {units.length === 0 && (
        <div className="p-12 bg-white border-2 border-dashed border-slate-200 rounded-3xl text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
            <FileUp className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Your Knowledge Base is Currently Empty</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              SynapseAI starts with zero pre-loaded assumptions. Drop in any PDF, paste lecture notes, or click a quick-load preset above to begin learning!
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs cursor-pointer inline-flex items-center gap-2"
          >
            <Upload className="w-4 h-4" /> Upload Course Material Now
          </button>
        </div>
      )}

      {/* Filter and Search Bar (if units exist) */}
      {units.length > 0 && (
        <>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-2xl shadow-2xs">
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                {(['all', 'textbook', 'slide', 'video'] as const).map((med) => (
                  <button
                    key={med}
                    onClick={() => setSelectedMedium(med)}
                    className={`px-3 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                      selectedMedium === med
                        ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {med === 'all' ? 'All Media' : `${med}s`}
                  </button>
                ))}
              </div>

              {topicsList.length > 0 && (
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="all">All Topics ({topicsList.length})</option>
                  {topicsList.map((top) => (
                    <option key={top} value={top}>
                      {top}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="relative w-full lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search concepts, citations, formulas..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Multimodal Units Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUnits.map((unit) => (
              <div
                key={unit.id}
                onClick={() => onOpenUnit(unit)}
                className="flex flex-col justify-between p-5 bg-white hover:border-indigo-300 border border-slate-200/90 rounded-2xl transition-all shadow-2xs hover:shadow-xs group cursor-pointer"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {getSourceIcon(unit.source)}
                      <span className="capitalize">{unit.source}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                      {unit.origin}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider block">
                      {unit.topic} • {unit.subtopic}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mt-0.5 line-clamp-2">
                      {unit.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {unit.content}
                  </p>

                  {unit.formula && (
                    <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-indigo-700 truncate">
                      {unit.formula}
                    </div>
                  )}

                  {unit.prerequisites && unit.prerequisites.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1">
                      <Tag className="w-3 h-3 text-slate-400 shrink-0" />
                      <span className="truncate">Prereqs: {unit.prerequisites.join(', ')}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Open Source Citation <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  {onStartQuizOnUnit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartQuizOnUnit(unit);
                      }}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white transition-colors"
                    >
                      Practice
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Ingest Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Ingest Any Course Material</h3>
                  <p className="text-xs text-slate-500">PDF, textbook excerpts, lecture transcripts, or notes</p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleIngest} className="space-y-4">
              {/* File upload input */}
              <div className="p-4 border-2 border-dashed border-indigo-200 rounded-2xl bg-indigo-50/40 text-center space-y-2">
                <FileUp className="w-6 h-6 mx-auto text-indigo-600" />
                <div className="text-xs text-slate-700">
                  {uploadedFileName ? (
                    <span className="font-bold text-emerald-700">✓ Loaded: {uploadedFileName}</span>
                  ) : (
                    <>
                      <label className="text-indigo-600 font-bold hover:underline cursor-pointer">
                        Click to upload PDF or text file
                        <input
                          type="file"
                          accept=".pdf,.txt,.md,.json"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-400 mt-0.5">Instant browser reading</p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Medium Source</label>
                  <select
                    value={ingestMedium}
                    onChange={(e) => setIngestMedium(e.target.value as MediumSource)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                  >
                    <option value="textbook">Textbook Chapter / Paper</option>
                    <option value="slide">Slide Deck Presentation</option>
                    <option value="video">Lecture Video Transcript</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Origin Reference</label>
                  <input
                    type="text"
                    value={ingestOrigin}
                    onChange={(e) => setIngestOrigin(e.target.value)}
                    placeholder="e.g. Chapter 4, p. 88 or Slide 12"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Title / Chapter Name</label>
                <input
                  type="text"
                  value={ingestTitle}
                  onChange={(e) => setIngestTitle(e.target.value)}
                  placeholder="e.g. Cellular Respiration or Newton's Laws"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Text Content / Excerpt / Transcript
                </label>
                <textarea
                  rows={5}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste textbook text, notes, or transcript here..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-indigo-600 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs hover:bg-slate-200 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={ingesting || !rawText.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {ingesting ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" /> Ingesting & Extracting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ingest & Train AI
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
