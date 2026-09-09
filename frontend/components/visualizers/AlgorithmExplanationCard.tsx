'use client';

import React from 'react';
import { Cpu, Clock, HardDrive, Lightbulb, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface AlgorithmExplanationProps {
  title: string;
  subtitle: string;
  problem: string;
  intuition: string;
  timeComplexity: string;
  spaceComplexity: string;
  logisticsUseCase: string;
  stateFormula?: string;
}

export const AlgorithmExplanationCard: React.FC<AlgorithmExplanationProps> = ({
  title,
  subtitle,
  problem,
  intuition,
  timeComplexity,
  spaceComplexity,
  logisticsUseCase,
  stateFormula,
}) => {
  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-4 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">{title}</h3>
            <p className="text-xs text-cyan-400">{subtitle}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" /> {timeComplexity}
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-emerald-400" /> {spaceComplexity}
          </span>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        {/* Problem Formulation */}
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Problem Formulation</span>
          </div>
          <p className="text-slate-400 leading-relaxed">{problem}</p>
        </div>

        {/* Real-World Logistics Use Case */}
        <div className="p-3.5 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1.5">
          <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>RaahNiti Logistics Application</span>
          </div>
          <p className="text-slate-400 leading-relaxed">{logisticsUseCase}</p>
        </div>
      </div>

      {/* Intuition & Formula */}
      <div className="p-3.5 rounded-lg bg-cyan-950/20 border border-cyan-500/20 space-y-2">
        <div className="flex items-center space-x-1.5 text-cyan-300 font-semibold text-xs">
          <Lightbulb className="w-4 h-4 text-yellow-400" />
          <span>Algorithm Intuition & Mathematical Transition</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">{intuition}</p>
        {stateFormula && (
          <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-cyan-400 text-xs font-mono overflow-x-auto">
            <code>{stateFormula}</code>
          </div>
        )}
      </div>
    </div>
  );
};
