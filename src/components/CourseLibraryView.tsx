import React, { useState } from 'react';
import {
  BookOpen,
  Presentation,
  Video,
  Image as ImageIcon,
  FileText,
  Upload,
  Plus,
  Trash2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  FileUp,
  Tag,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { MultimodalUnit, IngestedResource, MediumSource, Course } from '../types';
import { PRESET_COURSES, CoursePreset } from '../data/mockCourseData';

interface CourseLibraryViewProps {
  activeCourse: Course;
  units: MultimodalUnit[];
  resources: IngestedResource[];
  onOpenUnit: (unit: MultimodalUnit) => void;
  onAddUnit: (unit: MultimodalUnit) => void;
  onAddResource: (resource: IngestedResource) => void;
  onDeleteResource: (id: string) => void;
  onRetryResource: (id: string) => void;
  onLoadPreset: (preset: CoursePreset) => void;
  onClearAll: () => void;
}

export const CourseLibraryView: React.FC<CourseLibraryViewProps> = ({
  activeCourse,
  units,
  resources,
  onOpenUnit,
  onAddUnit,
  onAddResource,
  onDeleteResource,
  onRetryResource,
  onLoadPreset,
  onClearAll,
}) => {
  const [selectedMedium, setSelectedMedium] = useState<MediumSource | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'sources' | 'resources'>('sources');

  // Ingestion Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadMedium, setUploadMedium] = useState<MediumSource>('textbook');
  const [uploadOrigin, setUploadOrigin] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [rawText, setRawText] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [fileSizeMb, setFileSizeMb] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // File size validation: 50MB limit
  const MAX_FILE_SIZE_MB = 50;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    const sizeInMb = Number((file.size / (1024 * 1024)).toFixed(2));
    if (sizeInMb > MAX_FILE_SIZE_MB) {
      setUploadError(`File exceeds maximum size of ${MAX_FILE_SIZE_MB}MB (current: ${sizeInMb}MB).`);
      return;
    }

    setUploadedFileName(file.name);
    setFileSizeMb(sizeInMb);
    setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));

    // Infer media type from extension
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') {
      setUploadMedium('textbook');
      setUploadOrigin(`${file.name} - Page 1`);
    } else if (ext === 'pptx' || ext === 'ppt') {
      setUploadMedium('slide');
      setUploadOrigin(`${file.name} - Slide 1`);
    } else if (ext === 'mp4' || ext === 'mkv') {
      setUploadMedium('video');
      setUploadOrigin(`${file.name} @ 00:00`);
    } else if (ext === 'png' || ext === 'jpg' || ext === 'jpeg') {
      setUploadMedium('image');
      setUploadOrigin(`Figure in ${file.name}`);
    } else {
      setUploadMedium('textbook');
      setUploadOrigin(`${file.name}`);
    }

    // Read file text
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) setRawText(text);
    };
    reader.readAsText(file);
  };

  const handleIngestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawText.trim()) {
      setUploadError('Please provide file or paste course content.');
      return;
    }

    setIsProcessing(true);
    setUploadError(null);

    const resourceId = `res-${Date.now()}`;
    const newResource: IngestedResource = {
      id: resourceId,
      courseId: activeCourse.id,
      filename: uploadedFileName || `${uploadTitle || 'Course Document'}.txt`,
      fileType: uploadMedium === 'video' ? 'video' : uploadMedium === 'slide' ? 'pptx' : 'pdf',
      fileSizeMb: fileSizeMb || 0.45,
      status: 'indexed',
      chunksCount: 1,
      detectedTopics: [uploadTitle || 'Core Subject'],
      uploadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    try {
      const storedKey = localStorage.getItem('gemini_api_key');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (storedKey) {
        headers['x-gemini-api-key'] = storedKey;
      }

      const response = await fetch('/api/ingest', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rawText,
          mediumType: uploadMedium,
          origin: uploadOrigin || 'Course Reference',
        }),
      });

      const data = await response.json();
      const extracted = data.extractedUnits?.[0] || {
        topic: uploadTitle || 'General Topic',
        subtopic: 'Core Concept',
        content: rawText,
        origin: uploadOrigin || 'Uploaded File',
        source: uploadMedium,
        prerequisites: ['Foundational Concepts'],
      };

      const newUnit: MultimodalUnit = {
        id: `unit-${Date.now()}`,
        courseId: activeCourse.id,
        title: uploadTitle || extracted.subtopic || 'Extracted Course Unit',
        source: uploadMedium,
        origin: uploadOrigin || extracted.origin || 'Uploaded Course Material',
        topic: extracted.topic || uploadTitle || 'Course Topic',
        subtopic: extracted.subtopic || 'Concept Section',
        content: rawText,
        prerequisites: extracted.prerequisites || ['Foundations'],
        keyTerms: ['Course Ingestion', 'Grounded Unit'],
      };

      onAddResource(newResource);
      onAddUnit(newUnit);

      setShowUploadModal(false);
      setRawText('');
      setUploadOrigin('');
      setUploadTitle('');
      setUploadedFileName(null);
    } catch (err: any) {
      console.error(err);
      // Fallback local index
      const newUnit: MultimodalUnit = {
        id: `unit-${Date.now()}`,
        courseId: activeCourse.id,
        title: uploadTitle || 'Uploaded Course Unit',
        source: uploadMedium,
        origin: uploadOrigin || 'Uploaded Document',
        topic: uploadTitle || 'Course Topic',
        subtopic: 'Key Concept',
        content: rawText,
        prerequisites: ['Course Foundations'],
        keyTerms: ['Direct Ingestion'],
      };
      onAddResource(newResource);
      onAddUnit(newUnit);

      setShowUploadModal(false);
      setRawText('');
      setUploadOrigin('');
      setUploadTitle('');
      setUploadedFileName(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredUnits = units.filter((u) => {
    const matchesMedium = selectedMedium === 'all' || u.source === selectedMedium;
    const matchesSearch =
      searchQuery === '' ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.subtopic.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMedium && matchesSearch;
  });

  const getSourceIcon = (src: MediumSource) => {
    switch (src) {
      case 'video':
        return <Video className="w-4 h-4 text-rose-600" />;
      case 'slide':
        return <Presentation className="w-4 h-4 text-amber-600" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-cyan-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              Module A: Multimodal Course Ingestion
            </span>
            <span className="text-xs font-mono text-emerald-700 font-semibold">
              RAG Pipeline Active
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Course Material Library & Provenance Index
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl leading-relaxed">
            Ingest PDF textbooks, PPTX slides, lecture video transcripts, and diagrams with metadata preservation (filename, page, slide number, timestamp).
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {units.length > 0 && (
            <button
              onClick={onClearAll}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 hover:border-rose-200 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Reset Library</span>
            </button>
          )}

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Material</span>
          </button>
        </div>
      </div>

      {/* Preset Discipline Cards (1-Click Switch Domain) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>Quick Ingestion Presets (1-Click Test Disciplines):</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PRESET_COURSES.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onLoadPreset(preset)}
              className="p-4 bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 rounded-2xl text-left transition-all shadow-2xs group cursor-pointer flex items-start gap-3"
            >
              <span className="text-2xl shrink-0">{preset.icon}</span>
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

      {/* View Switcher: Individual Chunks vs Ingested Files */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'sources'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Retrievable Chunks ({units.length})
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'resources'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 bg-white border border-slate-200'
            }`}
          >
            Files & Processing Status ({resources.length})
          </button>
        </div>

        {/* Medium Filter & Search */}
        {activeTab === 'sources' && (
          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search extracted chunks..."
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sources Tab */}
      {activeTab === 'sources' && (
        <div className="space-y-4">
          {filteredUnits.length === 0 ? (
            <div className="p-12 bg-white border border-slate-200 rounded-3xl text-center space-y-3">
              <FileUp className="w-10 h-10 text-slate-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No Retrievable Chunks Found</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Upload a course textbook, lecture slides, or video transcript above to generate searchable knowledge chunks.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Upload Course File
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUnits.map((unit) => (
                <div
                  key={unit.id}
                  onClick={() => onOpenUnit(unit)}
                  className="bg-white border border-slate-200/90 hover:border-indigo-300 rounded-2xl p-5 space-y-3 shadow-2xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                        {getSourceIcon(unit.source)}
                        <span className="capitalize">{unit.source}</span>
                      </span>
                      <span className="text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {unit.origin}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                        {unit.topic} • {unit.subtopic}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mt-0.5">
                        {unit.title}
                      </h4>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {unit.content}
                    </p>

                    {unit.formula && (
                      <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 font-mono text-[11px] text-indigo-700 truncate">
                        {unit.formula}
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-semibold">
                    <span>Inspect Evidence</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Ingested Files & Status Tab */}
      {activeTab === 'resources' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-mono font-semibold">
                <th className="p-3.5 pl-6">Filename</th>
                <th className="p-3.5">Type & Size</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Chunks Indexed</th>
                <th className="p-3.5">Detected Topics</th>
                <th className="p-3.5 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {resources.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    No files uploaded yet. Click "Upload New Material" to add your first resource.
                  </td>
                </tr>
              ) : (
                resources.map((res) => (
                  <tr key={res.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3.5 pl-6 font-bold text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      <span>{res.filename}</span>
                    </td>
                    <td className="p-3.5 font-mono uppercase text-slate-600">
                      {res.fileType} ({res.fileSizeMb} MB)
                    </td>
                    <td className="p-3.5">
                      {res.status === 'indexed' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Indexed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200">
                          <AlertCircle className="w-3 h-3" /> Error
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-800">
                      {res.chunksCount} chunks
                    </td>
                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1">
                        {res.detectedTopics.map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-3.5 pr-6 text-right space-x-2">
                      {res.status === 'failed' && (
                        <button
                          onClick={() => onRetryResource(res.id)}
                          className="text-xs text-indigo-600 hover:underline font-semibold cursor-pointer"
                        >
                          Retry
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteResource(res.id)}
                        className="text-xs text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Upload Modal with File Validation */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload Course Material</h3>
                  <p className="text-xs text-slate-500">PDF, PPTX slides, MP4 transcripts, or text files</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-700 text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>

            {uploadError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <form onSubmit={handleIngestSubmit} className="space-y-4">
              {/* File Dropzone */}
              <div className="p-6 border-2 border-dashed border-indigo-200 hover:border-indigo-400 rounded-2xl bg-indigo-50/30 text-center space-y-2 transition-colors">
                <FileUp className="w-7 h-7 mx-auto text-indigo-600" />
                <div className="text-xs text-slate-700">
                  {uploadedFileName ? (
                    <div className="space-y-0.5">
                      <span className="font-bold text-emerald-700">✓ Selected: {uploadedFileName}</span>
                      <p className="text-[11px] text-slate-500">Size: {fileSizeMb} MB (Validated &lt; 50MB)</p>
                    </div>
                  ) : (
                    <>
                      <label className="text-indigo-600 font-bold hover:underline cursor-pointer">
                        Choose PDF, PPTX, or Video transcript
                        <input
                          type="file"
                          accept=".pdf,.pptx,.ppt,.txt,.md,.json,.mp4"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[11px] text-slate-400 mt-0.5">Supported: PDF, PPTX, MP4, TXT (Max 50MB)</p>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Media Source</label>
                  <select
                    value={uploadMedium}
                    onChange={(e) => setUploadMedium(e.target.value as MediumSource)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="textbook">PDF Textbook / Paper</option>
                    <option value="slide">PPTX Slide Deck</option>
                    <option value="video">Lecture Video Transcript</option>
                    <option value="image">Diagram / Figure</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Provenance / Origin Location
                  </label>
                  <input
                    type="text"
                    value={uploadOrigin}
                    onChange={(e) => setUploadOrigin(e.target.value)}
                    placeholder="e.g. Chapter 4, p. 112 or Slide 15"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Section Title</label>
                <input
                  type="text"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g. Bellman-Ford Shortest Paths or DNA Helicase"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Extracted Content / Transcript
                </label>
                <textarea
                  rows={4}
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  placeholder="Paste excerpt, transcript, or lecture notes here..."
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:outline-none focus:border-indigo-600 font-mono"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs hover:bg-slate-200 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing || !rawText.trim()}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Ingesting & Extracting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Ingest & Index
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
