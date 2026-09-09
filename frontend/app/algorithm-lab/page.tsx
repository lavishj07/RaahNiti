'use client';

import React, { useState } from 'react';
import { Cpu, Search, Package, MapPin, Route, Network } from 'lucide-react';
import { AlgorithmExplanationCard } from '@/components/visualizers/AlgorithmExplanationCard';
import { KMPVisualizer } from '@/components/visualizers/KMPVisualizer';
import { KnapsackVisualizer } from '@/components/visualizers/KnapsackVisualizer';
import { GrahamScanVisualizer } from '@/components/visualizers/GrahamScanVisualizer';
import { FloydWarshallVisualizer } from '@/components/visualizers/FloydWarshallVisualizer';
import { EdmondsKarpVisualizer } from '@/components/visualizers/EdmondsKarpVisualizer';

type AlgorithmKey = 'kmp' | 'knapsack' | 'graham' | 'floyd' | 'edmonds';

const algorithmDefs = [
  { id: 'kmp' as AlgorithmKey, name: 'KMP Search', tag: 'String Matching', icon: Search },
  { id: 'knapsack' as AlgorithmKey, name: '0/1 Knapsack', tag: 'Cargo Loading', icon: Package },
  { id: 'graham' as AlgorithmKey, name: "Graham's Scan", tag: 'Delivery Zones', icon: MapPin },
  { id: 'floyd' as AlgorithmKey, name: 'Floyd-Warshall', tag: 'Shortest Path', icon: Route },
  { id: 'edmonds' as AlgorithmKey, name: 'Edmonds-Karp', tag: 'Max Flow', icon: Network },
];

export default function AlgorithmLabPage() {
  const [activeAlgo, setActiveAlgo] = useState<AlgorithmKey>('kmp');

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2 font-mono">
          Algorithm Laboratory & Playground
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            Interactive DSA Engine
          </span>
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          Inspect internal state execution, time/space complexity, DP matrices, and real-world logistics applications.
        </p>
      </div>

      {/* Algorithm Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 font-mono">
        {algorithmDefs.map((algo) => {
          const Icon = algo.icon;
          const isActive = activeAlgo === algo.id;
          return (
            <button
              key={algo.id}
              onClick={() => setActiveAlgo(algo.id)}
              className={`p-3.5 rounded-xl border text-left transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 border-cyan-500/50 text-cyan-300 shadow-lg shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                  {algo.tag}
                </span>
              </div>
              <p className="text-xs font-bold text-slate-100">{algo.name}</p>
            </button>
          );
        })}
      </div>

      {/* Active Algorithm Explanation & Playground */}
      {activeAlgo === 'kmp' && (
        <div className="space-y-6">
          <AlgorithmExplanationCard
            title="Knuth-Morris-Pratt (KMP) String Matching"
            subtitle="Pattern Search without Backtracking in Text Stream"
            problem="Given a delivery customer database or address string T of length N and pattern P of length M, locate all occurrences of P in T efficiently."
            intuition="Computes a Longest Prefix Suffix (LPS) table in O(M) preprocessing time. When a character mismatch occurs, the pattern pointer j falls back to LPS[j-1] rather than re-scanning text characters."
            timeComplexity="O(N + M)"
            spaceComplexity="O(M)"
            stateFormula="LPS[i] = Length of longest proper prefix of P[0..i] that is also a suffix of P[0..i]"
            logisticsUseCase="Powers RaahNiti search engine across customer names, addresses, and tracking IDs instantly without database full table scans."
          />
          <KMPVisualizer />
        </div>
      )}

      {activeAlgo === 'knapsack' && (
        <div className="space-y-6">
          <AlgorithmExplanationCard
            title="0/1 Knapsack Dynamic Programming"
            subtitle="Truck Payload Cargo Selection Optimization"
            problem="Given a set of delivery packages each with a weight w_i, dollar value v_i, and priority p_i, select a package subset that maximizes total cargo value within truck weight limit W."
            intuition="Builds a 2D dynamic programming grid DP[i][w]. For each item i and capacity w, decides whether to include or exclude item i."
            timeComplexity="O(N × W)"
            spaceComplexity="O(N × W)"
            stateFormula="DP[i][w] = max( DP[i-1][w], DP[i-1][w - wt[i]] + val[i] )"
            logisticsUseCase="Used in RaahNiti's Cargo Optimization module to pack delivery trucks to maximum payload efficiency without exceeding weight capacities."
          />
          <KnapsackVisualizer />
        </div>
      )}

      {activeAlgo === 'graham' && (
        <div className="space-y-6">
          <AlgorithmExplanationCard
            title="Graham's Scan Convex Hull Algorithm"
            subtitle="Delivery Cluster Convex Boundary Generation"
            problem="Given N delivery customer coordinates in 2D space, construct the smallest convex polygon bounding envelope containing all customer points."
            intuition="Finds pivot P0 with lowest Y coordinate. Sorts remaining points by polar angle relative to P0. Iterates through sorted points maintaining a stack and discarding points creating non-left turns via cross product."
            timeComplexity="O(N log N)"
            spaceComplexity="O(N)"
            stateFormula="CrossProduct(O, A, B) = (A.x - O.x)*(B.y - O.y) - (A.y - O.y)*(B.x - O.x) > 0"
            logisticsUseCase="Dynamically generates delivery zone boundaries around clusters of delivery destinations for fleet dispatchers."
          />
          <GrahamScanVisualizer />
        </div>
      )}

      {activeAlgo === 'floyd' && (
        <div className="space-y-6">
          <AlgorithmExplanationCard
            title="Floyd-Warshall All-Pairs Shortest Path"
            subtitle="Road Intersections Shortest Distance Matrix"
            problem="Compute shortest path distances between every pair of road intersections in a weighted network graph."
            intuition="Dynamic programming considering all vertices {0..k} as intermediate nodes. Updates distance matrix dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])."
            timeComplexity="O(V³)"
            spaceComplexity="O(V²)"
            stateFormula="dist[i][j] = min( dist[i][j], dist[i][k] + dist[k][j] )"
            logisticsUseCase="Precomputes shortest distance matrices across all road junctions to give fleet drivers instant ETAs and turn-by-turn routes."
          />
          <FloydWarshallVisualizer />
        </div>
      )}

      {activeAlgo === 'edmonds' && (
        <div className="space-y-6">
          <AlgorithmExplanationCard
            title="Edmonds-Karp Maximum Flow"
            subtitle="Road Network Traffic Capacity & Bottleneck Analysis"
            problem="Determine maximum volume of delivery vehicles that can travel simultaneously from Central Warehouse (Source) to Regional Hubs (Sink) given road capacities."
            intuition="Implements Ford-Fulkerson using Breadth-First Search (BFS) to find shortest augmenting paths in the residual capacity graph."
            timeComplexity="O(V × E²)"
            spaceComplexity="O(V + E)"
            stateFormula="Augment Flow along BFS Path by Bottleneck = min( Residual Capacity along Path edges )"
            logisticsUseCase="Identifies congested road bottlenecks across Delhi NCR highways so dispatchers can reroute vehicles before gridlock occurs."
          />
          <EdmondsKarpVisualizer />
        </div>
      )}
    </div>
  );
}
