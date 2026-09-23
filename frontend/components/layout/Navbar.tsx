'use client';

import React, { useState } from 'react';
import { Search, Bell, Shield, Cpu, X, MapPin, Package, Truck, Layers } from 'lucide-react';
import { useKmpSearch } from '@/components/layout/SearchProvider';

const KIND_ICON = {
  customer: MapPin,
  package: Package,
  vehicle: Truck,
  zone: Layers,
};

export const Navbar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { hits, isSearching, runSearch, clearSearch, comparisons, scanned, usedFallback, query } =
    useKmpSearch();
  const [open, setOpen] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setOpen(true);
    await runSearch(searchQuery);
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
          <Cpu className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            RaahNiti
            <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono">
              v1.0 Engine
            </span>
          </h1>
          <p className="text-xs text-slate-400 font-mono">Intelligent Route & Fleet Optimization</p>
        </div>
      </div>

      <form onSubmit={handleSearch} className="relative w-full max-w-md mx-8">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => hits.length > 0 && setOpen(true)}
            placeholder="KMP search: Hospital, Connaught, MG Road, RN-HOSP..."
            className="w-full pl-10 pr-24 py-2 text-sm bg-slate-900/90 border border-slate-700/70 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="absolute right-1.5 px-3 py-1 text-xs font-semibold rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 transition-all font-mono"
          >
            {isSearching ? 'KMP...' : 'KMP Search'}
          </button>
        </div>

        {open && query && (
          <div className="absolute top-full mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 shadow-2xl overflow-hidden z-[60]">
            <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-[10px] font-mono text-slate-400">
              <span>
                Pattern “{query}” · {hits.length} hits · {scanned} records · {comparisons} comparisons
                {usedFallback ? ' · local KMP' : ' · O(N+M)'}
              </span>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  clearSearch();
                }}
                className="p-1 hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="max-h-72 overflow-y-auto">
              {hits.length === 0 ? (
                <p className="px-3 py-4 text-xs text-slate-500 font-mono">
                  No matches. Try Hospital, Connaught, MG Road, Cyber, RN-HOSP, or a driver name.
                </p>
              ) : (
                hits.map((hit) => {
                  const Icon = KIND_ICON[hit.kind];
                  return (
                    <div
                      key={`${hit.kind}-${hit.id}`}
                      className="px-3 py-2.5 border-b border-slate-800/80 hover:bg-slate-900 flex items-start gap-2"
                    >
                      <Icon className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs text-white font-semibold truncate">{hit.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">
                          {hit.kind} · {hit.subtitle}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </form>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Fleet Active</span>
        </div>

        <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400"></span>
        </button>

        <div className="flex items-center space-x-2 border-l border-slate-800 pl-4">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
            <Shield className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-medium text-slate-200">Logistics Manager</p>
            <p className="text-[10px] text-slate-500 font-mono">Admin Command</p>
          </div>
        </div>
      </div>
    </header>
  );
};
