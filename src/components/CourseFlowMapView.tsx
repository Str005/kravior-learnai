import React, { useState } from 'react';
import { Network, Sparkles, BookOpen, CheckCircle2, Lock, ArrowRight, ChevronRight, Layers } from 'lucide-react';
import { TopicNode, LearnerMastery, MultimodalUnit } from '../types';

interface CourseFlowMapViewProps {
  topics: TopicNode[];
  masteryList: LearnerMastery[];
  multimodalUnits: MultimodalUnit[];
  onSelectTopicForPractice: (topicName: string) => void;
  onOpenUnit: (unit: MultimodalUnit) => void;
}

export const CourseFlowMapView: React.FC<CourseFlowMapViewProps> = ({
  topics,
  masteryList,
  multimodalUnits,
  onSelectTopicForPractice,
  onOpenUnit,
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>(topics[0]?.id || '');

  const selectedTopic = topics.find((t) => t.id === selectedTopicId) || topics[0];
  const linkedUnits = multimodalUnits.filter((u) => u.topic === selectedTopic?.name);

  // Dynamically map nodes from available topics or fallback
  const displayNodes = topics.length > 0
    ? topics.map((t, idx) => {
        const mastery = masteryList.find((m) => m.topicName === t.name)?.pL ?? 0.45;
        const xPos = 120 + (idx % 3) * 260;
        const yPos = 80 + Math.floor(idx / 3) * 110;
        return {
          id: t.id,
          label: t.name,
          category: t.category,
          mastery,
          x: xPos,
          y: yPos,
        };
      })
    : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Prerequisite DAG Map
            </span>
            <span className="text-xs text-emerald-700 font-semibold">Interactive Curriculum Flow</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Visual Course Flow & Prerequisite Graph
          </h2>
          <p className="text-sm text-slate-600 max-w-2xl">
            Concepts automatically form a Directed Acyclic Graph (DAG) derived from your course material. Nodes update in real time as mastery thresholds are met.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs shrink-0 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-slate-700 font-medium">Mastered</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
            <span className="text-slate-700 font-medium">In Progress</span>
          </div>
        </div>
      </div>

      {/* Visual DAG Canvas */}
      <div className="p-6 bg-white border border-slate-200 rounded-3xl overflow-x-auto shadow-xs">
        {displayNodes.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No course topics yet. Upload a syllabus or textbook in the Knowledge Base to generate your concept graph!
          </div>
        ) : (
          <div className="min-w-[850px] relative">
            <svg viewBox="0 0 850 240" className="w-full h-auto">
              <defs>
                <marker
                  id="dag-arrow"
                  viewBox="0 0 10 10"
                  refX="7"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 1 L 9 5 L 0 9 z" fill="#6366f1" />
                </marker>
              </defs>

              {/* Connecting arrows */}
              {displayNodes.slice(0, displayNodes.length - 1).map((node, i) => {
                const nextNode = displayNodes[i + 1];
                return (
                  <path
                    key={`edge-${i}`}
                    d={`M ${node.x + 65} ${node.y} L ${nextNode.x - 65} ${nextNode.y}`}
                    stroke="#cbd5e1"
                    strokeWidth="2"
                    markerEnd="url(#dag-arrow)"
                    strokeDasharray="3"
                  />
                );
              })}

              {/* Nodes */}
              {displayNodes.map((node) => {
                const isMastered = node.mastery >= 0.8;
                const isSelected = selectedTopic?.id === node.id;
                const strokeColor = isSelected ? '#4f46e5' : isMastered ? '#10b981' : '#cbd5e1';
                const fillColor = isSelected ? '#eef2ff' : isMastered ? '#ecfdf5' : '#ffffff';

                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedTopicId(node.id)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <rect
                      x={node.x - 70}
                      y={node.y - 28}
                      width={140}
                      height={56}
                      rx={16}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="filter drop-shadow-xs"
                    />
                    <text
                      x={node.x}
                      y={node.y - 6}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize={11}
                      fontWeight="bold"
                    >
                      {node.label.length > 18 ? `${node.label.slice(0, 16)}...` : node.label}
                    </text>
                    <text
                      x={node.x}
                      y={node.y + 12}
                      textAnchor="middle"
                      fill={isMastered ? '#059669' : '#6366f1'}
                      fontSize={10}
                      fontFamily="monospace"
                      fontWeight="600"
                    >
                      Mastery {Math.round(node.mastery * 100)}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        )}
      </div>

      {/* Selected Topic Details Drawer */}
      {selectedTopic && (
        <div className="p-6 bg-white border border-slate-200 rounded-3xl space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
                {selectedTopic.category} Track
              </span>
              <h3 className="text-lg font-bold text-slate-900">{selectedTopic.name}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{selectedTopic.description}</p>
            </div>

            <button
              onClick={() => onSelectTopicForPractice(selectedTopic.name)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>Practice This Topic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-700 block">
                Required Prerequisite Dependencies:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTopic.prerequisites.map((p, i) => (
                  <span
                    key={i}
                    className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 border border-slate-200 font-mono"
                  >
                    ✓ {p}
                  </span>
                ))}
              </div>

              <span className="text-xs font-bold text-slate-700 block pt-2">
                Core Subtopics in Concept DAG:
              </span>
              <div className="space-y-1.5">
                {selectedTopic.subtopics.map((sub, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">
                Linked Course Sources ({linkedUnits.length}):
              </span>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {linkedUnits.map((unit) => (
                  <div
                    key={unit.id}
                    onClick={() => onOpenUnit(unit)}
                    className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors flex items-center justify-between"
                  >
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-slate-800 line-clamp-1">{unit.title}</div>
                      <div className="text-[10px] font-mono text-slate-500">{unit.origin}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
