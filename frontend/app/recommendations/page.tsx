'use client';

import React, { useState, useEffect } from 'react';
import { apiService } from '@/lib/api';
import { RecommendationsResult, RecommendationTask } from '@/types';
import {
  AlertTriangle, CheckCircle2, Clock, TrendingUp,
  Cpu, RefreshCw, ChevronRight, Zap, Package,
  MapPin, Network, Truck, Search, Star
} from 'lucide-react';

const URGENCY_CONFIG = {
  CRITICAL: { color: 'rose', bg: 'bg-rose-500/10', border: 'border-rose-500/40', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-300', dot: 'bg-rose-500' },
  HIGH:     { color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/40', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300', dot: 'bg-amber-500' },
  MEDIUM:   { color: 'cyan', bg: 'bg-cyan-500/10', border: 'border-cyan-500/40', text: 'text-cyan-400', badge: 'bg-cyan-500/20 text-cyan-300', dot: 'bg-cyan-500' },
  LOW:      { color: 'slate', bg: 'bg-slate-800/60', border: 'border-slate-700', text: 'text-slate-400', badge: 'bg-slate-700 text-slate-400', dot: 'bg-slate-500' },
};

const ALGO_ICONS: Record<string, React.ElementType> = {
  'KMP String Match':      Search,
  '0/1 Knapsack DP':       Package,
  "Graham's Scan":         MapPin,
  'Floyd-Warshall':        Network,
  'Edmonds-Karp':          TrendingUp,
  'Floyd-Warshall + Edmonds-Karp': Truck,
};

const ALGO_COLOR_MAP: Record<string, string> = {
  cyan:    'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
  emerald: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/30',
  purple:  'text-purple-400 bg-purple-500/15 border-purple-500/30',
  amber:   'text-amber-400 bg-amber-500/15 border-amber-500/30',
  rose:    'text-rose-400 bg-rose-500/15 border-rose-500/30',
  orange:  'text-orange-400 bg-orange-500/15 border-orange-500/30',
};

function TaskCard({ task, index }: { task: RecommendationTask; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = URGENCY_CONFIG[task.urgency];
  const AlgoIcon = ALGO_ICONS[task.algo] || Cpu;
  const algoColorClass = ALGO_COLOR_MAP[task.algo_color] || ALGO_COLOR_MAP.cyan;

  return (
    <div
      className={`rounded-xl border ${cfg.border} ${cfg.bg} backdrop-blur-md transition-all duration-200 hover:shadow-lg hover:shadow-black/30`}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 space-y-3"
      >
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Priority Badge */}
            <div className={`shrink-0 w-7 h-7 rounded-full ${cfg.dot} flex items-center justify-center text-white font-black text-xs shadow-lg`}>
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${algoColorClass}`}>
                  <AlgoIcon className="inline w-2.5 h-2.5 mr-1" />
                  {task.algo} · {task.algo_tag}
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                  {task.urgency}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug font-mono">{task.title}</h3>
            </div>
          </div>
          <ChevronRight className={`shrink-0 w-4 h-4 text-slate-500 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </div>

        {/* Metric pill */}
        <div className="ml-10">
          <span className="text-[11px] font-mono text-slate-400 bg-slate-900/70 px-2.5 py-1 rounded-lg border border-slate-800">
            {task.metric}
          </span>
        </div>
      </button>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-4 pb-4 ml-10 space-y-3 border-t border-slate-800/60 pt-3">
          <p className="text-xs text-slate-300 leading-relaxed">{task.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase flex items-center gap-1">
                <Zap className="w-3 h-3" /> Recommended Action
              </span>
              <p className="text-xs text-slate-200">{task.action}</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800 space-y-1">
              <span className="text-[10px] text-purple-400 font-mono font-bold uppercase flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Expected Impact
              </span>
              <p className="text-xs text-slate-200">{task.impact}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecommendationsPage() {
  const [data, setData] = useState<RecommendationsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    try {
      setError(null);
      const result = await apiService.getRecommendations();
      setData(result);
    } catch (err) {
      setError('Unable to load recommendations. Ensure the backend API is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const filteredTasks = data?.tasks.filter(t => filter === 'ALL' || t.urgency === filter) ?? [];

  return (
    <div className="space-y-6 font-mono">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
            AI Recommendations
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30">
              5-Algo Synthesis
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized fleet manager action items synthesized from KMP · Knapsack · Graham Scan · Floyd-Warshall · Edmonds-Karp
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs transition-all disabled:opacity-60"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Recalculating...' : 'Refresh Analysis'}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-cyan-400">Running all 5 algorithms against live database...</p>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
          <AlertTriangle className="inline w-4 h-4 mr-2" />
          {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Summary KPI Strip */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-center">
              <span className="text-2xl font-black text-rose-400">{data.critical_tasks}</span>
              <p className="text-[10px] text-slate-400 mt-1">Critical Tasks</p>
            </div>
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
              <span className="text-2xl font-black text-amber-400">{data.high_tasks}</span>
              <p className="text-[10px] text-slate-400 mt-1">High Priority</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-2xl font-black text-slate-200">{data.summary.pending_packages}</span>
              <p className="text-[10px] text-slate-400 mt-1">Pending Packages</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-2xl font-black text-emerald-400">{data.summary.idle_vehicles}</span>
              <p className="text-[10px] text-slate-400 mt-1">Idle Vehicles</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-2xl font-black text-cyan-400">{data.summary.fleet_efficiency_score}%</span>
              <p className="text-[10px] text-slate-400 mt-1">Fleet Efficiency</p>
            </div>
          </div>

          {/* Algorithm Contributors */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-wrap gap-2 items-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-2">Generated by:</span>
            {data.generated_by.map((algo) => (
              <span key={algo} className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300">
                {algo}
              </span>
            ))}
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-slate-900/80 border border-slate-800 w-fit flex-wrap">
            {(['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((f) => {
              const count = f === 'ALL' ? data.total_tasks : data.tasks.filter(t => t.urgency === f).length;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filter === f
                      ? 'bg-cyan-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {f} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
                </button>
              );
            })}
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-slate-500 text-sm space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                <p>No {filter !== 'ALL' ? filter.toLowerCase() + ' ' : ''}tasks. Fleet is operating optimally.</p>
              </div>
            ) : (
              filteredTasks.map((task, i) => (
                <TaskCard key={task.id} task={task} index={i} />
              ))
            )}
          </div>

          {/* Footer note */}
          <div className="text-[10px] text-slate-600 text-center py-2 border-t border-slate-800/50">
            Recommendations computed live from database state × 5 DSA algorithms. Click any task card to expand action details.
          </div>
        </>
      )}
    </div>
  );
}
