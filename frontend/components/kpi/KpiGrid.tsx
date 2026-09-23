'use client';

import React from 'react';
import { Package, Truck, Clock, Gauge, AlertTriangle, CheckCircle2, Users, Zap } from 'lucide-react';
import { DashboardStats } from '@/types';

interface KpiGridProps {
  stats?: DashboardStats | null;
}

export const KpiGrid: React.FC<KpiGridProps> = ({ stats }) => {
  const activeDeliveries   = stats?.active_deliveries       ?? 8;
  const activeVehicles     = stats?.active_vehicles         ?? 5;
  const pendingPackages    = stats?.pending_packages        ?? 18;
  const deliveredPackages  = stats?.delivered_packages      ?? 2;
  const delayedVehicles    = stats?.delayed_vehicles        ?? 1;
  const totalCustomers     = stats?.total_customers         ?? 32;
  const utilizationPct     = stats?.fleet_utilization_pct  ?? 68.2;
  const bottlenecks        = stats?.network_bottlenecks_detected ?? 1;
  const etaMins            = stats?.average_delivery_eta_mins ?? 34;
  const totalFleet         = 8;

  const kpis = [
    {
      title: 'Active Deliveries',
      value: activeDeliveries,
      subtitle: `${pendingPackages} pending · ${deliveredPackages} delivered`,
      icon: Package,
      color: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    },
    {
      title: 'Fleet Status',
      value: `${activeVehicles}/${totalFleet}`,
      subtitle: delayedVehicles > 0
        ? `⚠ ${delayedVehicles} vehicle${delayedVehicles > 1 ? 's' : ''} delayed`
        : 'All vehicles on-time',
      icon: Truck,
      color: delayedVehicles > 0
        ? 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30'
        : 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    },
    {
      title: 'Payload Utilization',
      value: `${utilizationPct}%`,
      subtitle: 'Optimized via 0/1 Knapsack DP',
      icon: Gauge,
      color: 'from-amber-500/20 to-yellow-500/10 text-amber-400 border-amber-500/30',
    },
    {
      title: 'Network Bottlenecks',
      value: bottlenecks,
      subtitle: 'Mathura Rd saturated (Edmonds-Karp)',
      icon: AlertTriangle,
      color: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30',
    },
    {
      title: 'Avg Delivery ETA',
      value: `${etaMins} min`,
      subtitle: 'Floyd-Warshall shortest paths',
      icon: Clock,
      color: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30',
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      subtitle: '5 zones · KMP-indexed',
      icon: Users,
      color: 'from-slate-700/40 to-slate-800/20 text-slate-300 border-slate-600/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-gradient-to-br ${kpi.color} border backdrop-blur-md flex flex-col justify-between transition-all hover:scale-[1.02] shadow-lg`}
          >
            <div className="flex items-center justify-between text-slate-400 font-mono">
              <span className="text-xs font-medium">{kpi.title}</span>
              <Icon className="w-4 h-4" />
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold tracking-tight text-white font-mono">
                {kpi.value}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-mono truncate">{kpi.subtitle}</span>
          </div>
        );
      })}
    </div>
  );
};
