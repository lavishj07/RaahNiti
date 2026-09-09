'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Navigation, CheckCircle2 } from 'lucide-react';

interface Stop {
  id: string;
  name: string;
  eta: string;
  distance: string;
}

const mockStops: Stop[] = [
  { id: 'W1', name: 'Dwarka Central Warehouse', eta: '09:00 AM', distance: '0.0 km' },
  { id: 'N01', name: 'Dhaula Kuan Junction', eta: '09:18 AM', distance: '11.5 km' },
  { id: 'N05', name: 'Rajiv Chowk (CP)', eta: '09:32 AM', distance: '19.5 km' },
  { id: 'C01', name: 'Apex Electronics Ltd', eta: '09:40 AM', distance: '20.1 km' },
  { id: 'C08', name: 'Lajpat Nagar Central Market', eta: '10:05 AM', distance: '31.4 km' },
];

export const RoutePlayback: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            if (currentStopIndex < mockStops.length - 1) {
              setCurrentStopIndex((idx) => idx + 1);
              return 0;
            } else {
              setIsPlaying(false);
              return 100;
            }
          }
          return prev + 5 * speedMultiplier;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStopIndex, speedMultiplier]);

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStopIndex(0);
    setProgress(0);
  };

  const currentStop = mockStops[currentStopIndex];

  return (
    <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 backdrop-blur-md space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-mono">Live Route Playback Simulation</h3>
            <p className="text-[11px] text-slate-400 font-mono">Vehicle: DL-01-EV-4091 (Rajesh Kumar)</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? 'Pause' : 'Start Simulation'}</span>
          </button>
          <button
            onClick={handleRestart}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all border border-slate-700"
            title="Restart Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSpeedMultiplier((s) => (s === 1 ? 2 : s === 2 ? 5 : 1))}
            className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-mono border border-slate-700"
          >
            {speedMultiplier}x Speed
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono text-slate-400">
          <span>Current Stop: <strong className="text-cyan-300">{currentStop.name}</strong></span>
          <span>ETA: <strong className="text-emerald-400">{currentStop.eta}</strong> ({currentStop.distance})</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 transition-all duration-300 relative"
            style={{ width: `${((currentStopIndex + progress / 100) / mockStops.length) * 100}%` }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-lg shadow-white animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Stop Sequence Indicators */}
      <div className="flex items-center justify-between pt-1">
        {mockStops.map((stop, idx) => {
          const isDone = idx < currentStopIndex;
          const isCurrent = idx === currentStopIndex;
          return (
            <div key={stop.id} className="flex flex-col items-center text-center space-y-1">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-bold transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : isCurrent
                    ? 'bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/30 shadow-lg shadow-cyan-500/40 animate-pulse'
                    : 'bg-slate-800 text-slate-500 border border-slate-700'
                }`}
              >
                {isDone ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
              </div>
              <span
                className={`text-[10px] font-mono max-w-[80px] truncate ${
                  isCurrent ? 'text-cyan-300 font-bold' : isDone ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {stop.name.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
