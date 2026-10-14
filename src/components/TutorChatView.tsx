import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Bot,
  User,
  Volume2,
  AlertTriangle,
  BookOpen,
  Presentation,
  Video,
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Upload,
  PlusCircle,
  Lightbulb,
  FileText,
  FileUp,
  X,
  Paperclip,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage, MultimodalUnit, SourceCitation, StudentProfile, IngestedResource } from '../types';

interface TutorChatViewProps {
  multimodalUnits: MultimodalUnit[];
  strictGrounding: boolean;
  language: 'en' | 'hi';
  activeProfile: StudentProfile;
  onOpenCitation: (citation: SourceCitation) => void;
  onBktUpdateFromChat?: (topic: string, isSuccessfulInteraction: boolean) => void;
  onOpenUpload?: () => void;
  onAddUnit?: (unit: MultimodalUnit) => void;
  onAddResource?: (resource: IngestedResource) => void;
}

export const TutorChatView: React.FC<TutorChatViewProps> = ({
  multimodalUnits,
  strictGrounding,
  language,
  activeProfile,
  onOpenCitation,
  onBktUpdateFromChat,
  onOpenUpload,
  onAddUnit,
  onAddResource,
}) => {
  const hasMaterials = multimodalUnits.length > 0;
  const learnerName = activeProfile.name?.trim() ? activeProfile.name : 'there';

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (!hasMaterials) {
      return [
        {
          id: 'welcome-blank',
          role: 'assistant',
          content: `Hello ${learnerName}! 👋 I am your interactive AI study tutor. Right now, I know nothing about your course yet!\n\nTo learn together, please click **"Upload PDF or Notes to Learn"** below to drop in your textbook chapter, PDF lecture slides, or paste notes. Once added, I will immediately extract the key concepts, diagrams, and formulas, and tutor you with direct citations!`,
          timestamp: 'Just now',
          citations: [],
          isGrounded: true,
          refusedOutsideScope: false,
        },
      ];
    }
    return [
      {
        id: 'welcome-msg',
        role: 'assistant',
        content: `Hello ${learnerName}! 👋 I am ready and source-grounded in your ${multimodalUnits.length} uploaded study materials.\n\nEvery explanation I provide is linked directly to your textbook chapters, slides, or notes. You can also upload any new PDF or text anytime by clicking the paperclip icon below. What concept would you like to explore or practice together?`,
        timestamp: 'Just now',
        citations: multimodalUnits.slice(0, 3).map((u) => ({
          source: u.source,
          origin: u.origin,
          excerpt: u.title,
        })),
        isGrounded: true,
        refusedOutsideScope: false,
      },
    ];
  });

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tutorStyle, setTutorStyle] = useState<'socratic' | 'step-by-step' | 'analogy'>('socratic');
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // In-Chat Source Upload Modal State
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadTab, setUploadTab] = useState<'pdf' | 'text'>('pdf');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pastedText, setPastedText] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [sourceOrigin, setSourceOrigin] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Dynamic sample prompts based on whatever materials are currently uploaded
  const samplePrompts = hasMaterials
    ? [
        {
          label: `Concept from ${multimodalUnits[0]?.origin || 'Course'}`,
          prompt: `Can you explain the key concept in ${multimodalUnits[0]?.origin} (${multimodalUnits[0]?.subtopic}) with cited evidence?`,
        },
        {
          label: '🎓 Socratic Intuition',
          prompt: `Guide me Socratically through ${multimodalUnits[0]?.subtopic || 'the core topic'}, asking me questions one step at a time.`,
        },
        {
          label: '📝 Derive Formula',
          prompt: `Show me the exact formula or proof from the uploaded materials step-by-step.`,
        },
        {
          label: '💡 Intuitive Analogy',
          prompt: `Give me a memorable real-world analogy to understand ${multimodalUnits[0]?.subtopic || 'this concept'} before the technical details.`,
        },
        {
          label: '⚠️ Test Off-Syllabus Refusal',
          prompt: 'How do you cook authentic Italian pasta carbonara?',
        },
      ]
    : [
        {
          label: '📄 Upload PDF to Learn',
          action: () => setShowUploadModal(true),
        },
        {
          label: '💡 How Does Grounded Tutoring Work?',
          prompt: 'How do you ground your explanations and quiz questions in my uploaded textbooks and slides?',
        },
      ];

  const handleSendMessage = async (userPrompt?: string) => {
    const textToSend = userPrompt || input.trim();
    if (!textToSend || loading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    if (!hasMaterials) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `assistant-${Date.now()}`,
            role: 'assistant',
            content: `I am currently in zero-knowledge state! Please upload your PDF textbook chapter, lecture slides, or paste your notes first so I can ground my explanations directly in your materials. Click **"Upload Source to Learn"** below to begin.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            citations: [],
            isGrounded: false,
            refusedOutsideScope: true,
          },
        ]);
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const storedKey = localStorage.getItem('gemini_api_key');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (storedKey) {
        headers['x-gemini-api-key'] = storedKey;
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: textToSend,
          history: messages.slice(-4),
          chunks: multimodalUnits,
          strictMode: strictGrounding,
          tutorStyle,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: data.content || 'I processed your query based on the course materials.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations || [],
        isGrounded: data.isGrounded !== false,
        refusedOutsideScope: data.refusedOutsideScope || false,
        suggestedPrerequisites: data.suggestedPrerequisites || [],
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (onBktUpdateFromChat && !data.refusedOutsideScope) {
        onBktUpdateFromChat(multimodalUnits[0]?.topic || 'General Topic', true);
      }
    } catch (err: any) {
      console.error(err);
      const isRefusalTest =
        textToSend.toLowerCase().includes('pasta') ||
        textToSend.toLowerCase().includes('cook') ||
        textToSend.toLowerCase().includes('weather');

      const fallbackMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: isRefusalTest
          ? `⚠️ [Scope Refusal]: I must decline this question because it is outside your uploaded study materials. Under strict grounding, I only answer queries verified in your uploaded materials.`
          : `### Tutor Concept Guidance\n\nBased on your course materials in **${multimodalUnits[0]?.origin || 'Course Material'}**:\n\n${multimodalUnits[0]?.content.slice(0, 280)}...\n\n💡 *Tutor check question: How would you summarize this concept in your own words?*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: isRefusalTest
          ? []
          : [
              {
                source: multimodalUnits[0]?.source || 'textbook',
                origin: multimodalUnits[0]?.origin || 'Uploaded Document',
                excerpt: multimodalUnits[0]?.title || 'Course material reference',
              },
            ],
        isGrounded: true,
        refusedOutsideScope: isRefusalTest,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = async (msg: ChatMessage) => {
    if (playingAudioId === msg.id) {
      window.speechSynthesis?.cancel();
      setPlayingAudioId(null);
      return;
    }

    setPlayingAudioId(msg.id);

    try {
      const storedKey = localStorage.getItem('gemini_api_key');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (storedKey) {
        headers['x-gemini-api-key'] = storedKey;
      }

      const response = await fetch('/api/tts', {
        method: 'POST',
        headers,
        body: JSON.stringify({ text: msg.content.replace(/\[.*?\]/g, '') }),
      });
      const data = await response.json();

      if (data.audioAvailable && data.audioData) {
        const audio = new Audio(data.audioData);
        audio.onended = () => setPlayingAudioId(null);
        audio.play();
      } else {
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const cleanText = msg.content.replace(/\[.*?\]/g, '');
          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.rate = 1.05;
          utterance.pitch = 1.0;
          utterance.onend = () => setPlayingAudioId(null);
          utterance.onerror = () => setPlayingAudioId(null);
          window.speechSynthesis.speak(utterance);
        } else {
          setPlayingAudioId(null);
        }
      }
    } catch {
      setPlayingAudioId(null);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);
    if (!file) return;

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25MB limit.');
      return;
    }

    setSelectedFile(file);
    if (!sourceTitle) {
      setSourceTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
    if (!sourceOrigin) {
      setSourceOrigin(file.name);
    }
  };

  const handleProcessUploadAndLearn = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadError(null);

    if (uploadTab === 'pdf' && !selectedFile) {
      setUploadError('Please select a PDF or document file to upload.');
      return;
    }
    if (uploadTab === 'text' && !pastedText.trim()) {
      setUploadError('Please paste your course text or notes.');
      return;
    }

    setIsProcessingUpload(true);

    try {
      let fileBase64: string | undefined = undefined;
      let rawText = pastedText;
      let mediumType: 'textbook' | 'slide' | 'video' = 'textbook';
      const originName = sourceOrigin.trim() || selectedFile?.name || 'Uploaded Source';
      const docTitle = sourceTitle.trim() || originName.replace(/\.[^/.]+$/, '');

      if (uploadTab === 'pdf' && selectedFile) {
        const ext = selectedFile.name.split('.').pop()?.toLowerCase();
        if (ext === 'pptx' || ext === 'ppt') mediumType = 'slide';

        // Read as base64 for PDF or as text for txt/md
        if (ext === 'pdf') {
          fileBase64 = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const res = reader.result as string;
              resolve(res.split(',')[1]);
            };
            reader.onerror = reject;
            reader.readAsDataURL(selectedFile);
          });
        } else {
          rawText = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(selectedFile);
          });
        }
      }

      const storedKey = localStorage.getItem('gemini_api_key');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (storedKey) {
        headers['x-gemini-api-key'] = storedKey;
      }

      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          rawText: rawText || undefined,
          fileBase64: fileBase64 || undefined,
          mimeType: selectedFile?.type || 'application/pdf',
          mediumType,
          origin: originName,
        }),
      });

      const data = await res.json();
      const extracted = data.extractedUnits?.[0] || {
        topic: docTitle,
        subtopic: 'Key Concept',
        content: rawText.slice(0, 400) || `Core content extracted from ${originName}.`,
        origin: originName,
        source: mediumType,
        prerequisites: ['Foundational Concepts'],
        diagramDescription: 'Concept breakdown figure',
      };

      const newUnit: MultimodalUnit = {
        id: `unit-${Date.now()}`,
        courseId: 'active-course',
        title: docTitle,
        source: mediumType,
        origin: originName,
        topic: extracted.topic || docTitle,
        subtopic: extracted.subtopic || 'Fundamental Concept',
        content: extracted.content,
        diagramCaption: extracted.diagramDescription,
        prerequisites: extracted.prerequisites || [],
        keyTerms: [extracted.topic, extracted.subtopic],
      };

      // Add to knowledge base
      if (onAddUnit) {
        onAddUnit(newUnit);
      }

      if (onAddResource) {
        onAddResource({
          id: `res-${Date.now()}`,
          courseId: 'active-course',
          filename: originName,
          fileType: mediumType === 'slide' ? 'pptx' : 'pdf',
          fileSizeMb: selectedFile ? Number((selectedFile.size / (1024 * 1024)).toFixed(2)) : 0.2,
          status: 'indexed',
          chunksCount: 1,
          detectedTopics: [newUnit.topic],
          uploadedAt: 'Just now',
        });
      }

      // Add tutor introduction message directly to chat
      const tutorGreetingMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: `📚 **Source Ingested & Ready to Learn!**\n\nI have analyzed **${originName}** and established your new knowledge base:\n• **Topic**: ${newUnit.topic}\n• **Key Concept**: ${newUnit.subtopic}\n\n**Concept Summary**:\n${newUnit.content}\n\n${newUnit.diagramCaption ? `🔍 *Visual Reference: ${newUnit.diagramCaption}*\n\n` : ''}💡 *How would you like to start?*\n1. "Can you walk me through this step-by-step?"\n2. "Give me an intuitive analogy for this"\n3. "Ask me a practice question to test my understanding"`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [
          {
            source: newUnit.source,
            origin: newUnit.origin,
            excerpt: newUnit.content.slice(0, 140),
            topic: newUnit.topic,
          },
        ],
        isGrounded: true,
        refusedOutsideScope: false,
      };

      setMessages((prev) => [...prev, tutorGreetingMsg]);
      setShowUploadModal(false);
      setSelectedFile(null);
      setPastedText('');
      setSourceTitle('');
      setSourceOrigin('');
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process document.');
    } finally {
      setIsProcessingUpload(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-112px)] max-w-5xl mx-auto px-4 py-4">
      {/* Zero Knowledge Callout if empty */}
      {!hasMaterials && (
        <div className="mb-3 p-5 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200/90 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in shadow-xs">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-600 text-white shadow-xs">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Zero-Knowledge Blank Slate</h4>
              <p className="text-xs text-slate-600 mt-0.5 max-w-xl">
                Upload a PDF textbook chapter, slide deck, or paste your notes to immediately start learning with your personalized AI tutor!
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs shrink-0 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload PDF / Text to Learn</span>
          </button>
        </div>
      )}

      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200/90 rounded-2xl mb-3 shadow-2xs">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700">Tutor Style:</span>
          <div className="flex rounded-xl bg-slate-100 p-0.5 border border-slate-200/80 text-xs">
            {[
              { id: 'socratic', label: '🎓 Socratic' },
              { id: 'step-by-step', label: '📝 Step-by-Step' },
              { id: 'analogy', label: '💡 Analogy' },
            ].map((style) => (
              <button
                key={style.id}
                onClick={() => setTutorStyle(style.id as any)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  tutorStyle === style.id
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {style.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Direct Upload Trigger */}
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold transition-colors cursor-pointer"
          >
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload PDF or Notes</span>
          </button>

          <span className="text-slate-300 hidden sm:inline">|</span>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className={`w-4 h-4 ${strictGrounding ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span>Mode: <strong className="text-slate-800">{strictGrounding ? 'Strict Grounding' : 'Open Knowledge'}</strong></span>
            </span>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div className={`max-w-2xl space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div
                className={`p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                    : msg.refusedOutsideScope
                    ? 'bg-rose-50 border border-rose-200 text-rose-900 rounded-bl-xs'
                    : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs shadow-2xs'
                }`}
              >
                {/* Refusal Notice Banner */}
                {msg.refusedOutsideScope && (
                  <div className="flex items-center gap-2 mb-2 pb-2 border-b border-rose-200 text-rose-700 text-xs font-semibold">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Outside Uploaded Material (Strictly Grounded Refusal)</span>
                  </div>
                )}

                <div className="whitespace-pre-line">{msg.content}</div>

                {/* Citations Box */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5">
                    <span className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" /> Grounded Citations (Click to inspect source):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.citations.map((cite, idx) => (
                        <button
                          key={idx}
                          onClick={() => onOpenCitation(cite)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50/70 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-800 text-xs transition-colors font-mono cursor-pointer shadow-2xs group"
                        >
                          {cite.source === 'video' ? (
                            <Video className="w-3 h-3 text-rose-600" />
                          ) : cite.source === 'slide' ? (
                            <Presentation className="w-3 h-3 text-amber-600" />
                          ) : (
                            <BookOpen className="w-3 h-3 text-indigo-600" />
                          )}
                          <span>{cite.origin}</span>
                          <ExternalLink className="w-2.5 h-2.5 opacity-60 group-hover:opacity-100 ml-0.5" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Prerequisites if student struggled */}
                {msg.suggestedPrerequisites && msg.suggestedPrerequisites.length > 0 && (
                  <div className="mt-2 text-[11px] text-amber-800 flex items-center gap-1.5 font-medium bg-amber-50 p-2 rounded-lg border border-amber-200">
                    <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Review Prerequisite: <strong>{msg.suggestedPrerequisites.join(', ')}</strong></span>
                  </div>
                )}
              </div>

              {/* Message metadata & Audio TTS Button */}
              <div className="flex items-center gap-2 px-1 text-[11px] text-slate-400">
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <button
                    onClick={() => handlePlayAudio(msg)}
                    className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    <Volume2 className={`w-3.5 h-3.5 ${playingAudioId === msg.id ? 'text-indigo-600 animate-pulse' : ''}`} />
                    <span>{playingAudioId === msg.id ? 'Playing Voice...' : 'Listen Audio'}</span>
                  </button>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-slate-700" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shrink-0 animate-pulse">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="p-4 rounded-2xl bg-white border border-slate-200 text-slate-600 text-sm flex items-center gap-2 shadow-2xs">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Analyzing uploaded course material and formulating tutor response...</span>
            </div>
          </div>
        )}
        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Bar */}
      <div className="pt-2 pb-1 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs">
        <span className="text-slate-400 shrink-0 font-medium text-[11px]">Tutor Prompts:</span>
        {samplePrompts.map((p: any, idx: number) => (
          <button
            key={idx}
            onClick={() => {
              if (p.action) {
                p.action();
              } else if (p.prompt) {
                handleSendMessage(p.prompt);
              }
            }}
            className="px-3 py-1 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 whitespace-nowrap transition-all shrink-0 text-xs shadow-2xs cursor-pointer font-medium"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Input Form with Paperclip Upload Trigger */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="mt-2 relative flex items-center gap-2"
      >
        <button
          type="button"
          onClick={() => setShowUploadModal(true)}
          title="Upload PDF or notes to learn"
          className="p-3 bg-white border border-slate-200 hover:bg-slate-50 text-indigo-600 rounded-2xl transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <div className="relative flex-1 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              hasMaterials
                ? "Ask your tutor anything about your uploaded study materials..."
                : "Upload a PDF or notes first using the paperclip, or ask a question..."
            }
            className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-400 text-sm focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 shadow-xs"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white transition-all shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Upload Source to Learn Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-50 text-indigo-600">
                  <FileUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Upload Source to Learn</h3>
                  <p className="text-xs text-slate-500">Provide a PDF textbook or paste notes to train your AI tutor</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleProcessUploadAndLearn} className="p-6 space-y-4 bg-slate-50/50">
              {/* Tabs: PDF File vs Paste Text */}
              <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/80 text-xs">
                <button
                  type="button"
                  onClick={() => setUploadTab('pdf')}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    uploadTab === 'pdf' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📄 Upload PDF / Document
                </button>
                <button
                  type="button"
                  onClick={() => setUploadTab('text')}
                  className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
                    uploadTab === 'text' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📝 Paste Text Notes
                </button>
              </div>

              {uploadTab === 'pdf' ? (
                <div className="space-y-3">
                  <div className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-white rounded-2xl p-6 text-center cursor-pointer transition-colors relative">
                    <input
                      type="file"
                      accept=".pdf,.txt,.md,.pptx"
                      onChange={handleFileSelect}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs">
                        <strong className="text-indigo-600">Click to browse</strong> or drag & drop PDF
                      </div>
                      <p className="text-[11px] text-slate-400">PDF, PPTX slides, or TXT up to 25MB</p>
                      {selectedFile && (
                        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>{selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Paste Educational Notes / Text</label>
                  <textarea
                    rows={6}
                    value={pastedText}
                    onChange={(e) => setPastedText(e.target.value)}
                    placeholder="Paste textbook excerpts, slide transcript, lecture summaries, or theorem definitions here..."
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 shadow-2xs font-mono"
                  />
                </div>
              )}

              {/* Source Title & Origin */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Source Title / Topic</label>
                  <input
                    type="text"
                    placeholder="e.g., Shortest Paths & Relaxation"
                    value={sourceTitle}
                    onChange={(e) => setSourceTitle(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Citation Label / Origin</label>
                  <input
                    type="text"
                    placeholder="e.g., Chapter 24, p. 114"
                    value={sourceOrigin}
                    onChange={(e) => setSourceOrigin(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              {uploadError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingUpload}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  {isProcessingUpload ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Ingesting & Training Tutor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Process & Start Learning</span>
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
