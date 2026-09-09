'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Cpu, PackageCheck, MapPin, Network, Truck, FileText
} from 'lucide-react';

const navItems = [
  { name: 'Command Center', href: '/', icon: LayoutDashboard },
  { name: 'Algorithm Lab', href: '/algorithm-lab', icon: Cpu, badge: '5 DSA' },
  { name: 'Cargo Optimization', href: '/cargo', icon: PackageCheck, badge: 'Knapsack' },
  { name: 'Delivery Zones', href: '/zones', icon: MapPin, badge: 'Graham' },
  { name: 'Network Analysis', href: '/network', icon: Network, badge: 'Max Flow' },
  { name: 'Fleet Management', href: '/fleet', icon: Truck },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 backdrop-blur-md flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <p className="px-3 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-semibold mb-3">
            Core Modules
          </p>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-md shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Algorithm Quick Reference */}
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs space-y-2 font-mono">
          <div className="flex items-center justify-between text-slate-300 font-semibold">
            <span>Engine Specs</span>
            <span className="text-[10px] text-cyan-400">DSA 5/5</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1">
            <p>• KMP String Match O(N+M)</p>
            <p>• 0/1 Knapsack DP O(N·W)</p>
            <p>• Graham Scan Hull O(N log N)</p>
            <p>• Floyd-Warshall O(V³)</p>
            <p>• Edmonds-Karp O(V·E²)</p>
          </div>
        </div>
      </div>

      {/* System Footer Status */}
      <div className="border-t border-slate-800/80 pt-4 px-2 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Engine Ready
        </span>
        <span>Local Mode</span>
      </div>
    </aside>
  );
};
