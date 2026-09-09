'use client';

import React, { useState } from 'react';
import { Search, Play, RotateCcw, ChevronRight } from 'lucide-react';
import { searchKMP } from '@/lib/algorithms/kmp';

interface KMPVisualizerProps {
  initialText?: string;
  initialPattern?: string;
}

export const KMPVisualizer: React.FC<KMPVisualizerProps> = ({
  initialText = 'Sector 21 Dwarka New Delhi Connaught Place Cyber City DLF',
  initialPattern = 'Connaught',
}) => {
  const [text, setText] = useState(initialText);
  const [pattern, setPattern] = useState(initialPattern);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const kmpResult = searchKMP(text, pattern);
  const steps = kmpResult.steps;
  const currentStep = steps[currentStepIndex] || null;

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-5 font-mono">
      {/* Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-semibold">Target Text / Address Stream</label>
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setCurrentStepIndex(0);
            }}
            className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-slate-400 font-semibold">Search Pattern Query</label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => {
              setPattern(e.target.value);
              setCurrentStepIndex(0);
            }}
            className="w-full px-3.5 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-cyan-400 focus:outline-none focus:border-cyan-500 font-bold"
          />
        </div>
      </div>

      {/* LPS Array Table */}
      <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-cyan-400">Precomputed LPS (Longest Prefix Suffix) Table</span>
          <span className="text-slate-500">O(M) Preprocessing</span>
        </div>
        <div className="flex flex-wrap gap-1.5 overflow-x-auto py-1">
          {pattern.split('').map((char, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-[10px] text-slate-500">{idx}</span>
              <div className="w-8 h-8 rounded border border-slate-700 bg-slate-900 flex items-center justify-center font-bold text-slate-200 text-xs">
                {char}
              </div>
              <span className="text-xs font-bold text-cyan-400 mt-1">{kmpResult.lps[idx] ?? 0}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-3 text-center text-xs">
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Total Matches</span>
          <span className="text-lg font-bold text-emerald-400">{kmpResult.matches.length}</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Comparisons Made</span>
          <span className="text-lg font-bold text-cyan-400">{kmpResult.comparisons}</span>
        </div>
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
          <span className="text-slate-400 block text-[10px]">Matches Indices</span>
          <span className="text-xs font-bold text-purple-400 truncate">
            {kmpResult.matches.length > 0 ? kmpResult.matches.join(', ') : 'None'}
          </span>
        </div>
      </div>

      {/* Step Playback Controls & Trace */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">
            KMP Step Trace ({currentStepIndex + 1} / {steps.length || 1})
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentStepIndex(0)}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setCurrentStepIndex((prev) => Math.min(prev + 1, steps.length - 1))}
              disabled={currentStepIndex >= steps.length - 1}
              className="px-3 py-1 rounded bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1"
            >
              <span>Next Step</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Action Callout */}
        {currentStep && (
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              {currentStep.action}
            </p>
          </div>
        )}

        {/* Character Stream Grid */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 overflow-x-auto">
          <div className="flex flex-wrap gap-1">
            {text.split('').map((char, idx) => {
              const isMatchStart = kmpResult.matches.includes(idx);
              const isCurrentTextIndex = currentStep?.textIndex === idx;

              return (
                <div
                  key={idx}
                  className={`w-7 h-8 rounded flex items-center justify-center font-bold text-xs transition-all ${
                    isMatchStart
                      ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-400'
                      : isCurrentTextIndex
                      ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-400/40 animate-bounce'
                      : 'bg-slate-900 border border-slate-800 text-slate-300'
                  }`}
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
