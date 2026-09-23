'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiService } from '@/lib/api';
import { searchKMP } from '@/lib/algorithms/kmp';
import { Customer, PackageItem, Vehicle, Zone, KMPResult } from '@/types';
import { DEMO_CUSTOMERS, DEMO_PACKAGES, DEMO_VEHICLES, DEMO_ZONES } from '@/lib/demoData';

export type SearchHitKind = 'customer' | 'package' | 'vehicle' | 'zone';

export interface SearchHit {
  kind: SearchHitKind;
  id: string;
  title: string;
  subtitle: string;
}

interface SearchContextValue {
  query: string;
  hits: SearchHit[];
  comparisons: number;
  scanned: number;
  isSearching: boolean;
  usedFallback: boolean;
  highlightedCustomerIds: string[];
  runSearch: (pattern: string) => Promise<void>;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextValue | null>(null);

export function useKmpSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useKmpSearch must be used within SearchProvider');
  return ctx;
}

function localKmpSearch(
  pattern: string,
  customers: Customer[],
  packages: PackageItem[],
  vehicles: Vehicle[],
  zones: Zone[]
) {
  const needle = pattern.toLowerCase();
  const hits: SearchHit[] = [];
  let comparisons = 0;
  customers.forEach((c) => {
    const text = `${c.name} ${c.address} ${c.zone_id || ''} ${c.id}`.toLowerCase();
    const res = searchKMP(text, needle);
    comparisons += res.comparisons;
    if (res.matches.length) {
      hits.push({ kind: 'customer', id: c.id, title: c.name, subtitle: c.address });
    }
  });
  packages.forEach((p) => {
    const text = `${p.id} ${p.tracking_number} ${p.customer_id} ${p.status}`.toLowerCase();
    const res = searchKMP(text, needle);
    comparisons += res.comparisons;
    if (res.matches.length) {
      hits.push({
        kind: 'package',
        id: p.id,
        title: p.tracking_number,
        subtitle: `${p.status} · ${p.customer_id}`,
      });
    }
  });
  vehicles.forEach((v) => {
    const text = `${v.id} ${v.vehicle_number} ${v.driver_name} ${v.status}`.toLowerCase();
    const res = searchKMP(text, needle);
    comparisons += res.comparisons;
    if (res.matches.length) {
      hits.push({
        kind: 'vehicle',
        id: v.id,
        title: v.vehicle_number,
        subtitle: `${v.driver_name} · ${v.status}`,
      });
    }
  });
  zones.forEach((z) => {
    const text = `${z.id} ${z.name}`.toLowerCase();
    const res = searchKMP(text, needle);
    comparisons += res.comparisons;
    if (res.matches.length) {
      hits.push({ kind: 'zone', id: z.id, title: z.name, subtitle: z.id });
    }
  });
  return { hits, comparisons, scanned: customers.length + packages.length + vehicles.length + zones.length };
}

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [query, setQuery] = useState('');
  const [hits, setHits] = useState<SearchHit[]>([]);
  const [comparisons, setComparisons] = useState(0);
  const [scanned, setScanned] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [usedFallback, setUsedFallback] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(DEMO_CUSTOMERS);
  const [packages, setPackages] = useState<PackageItem[]>(DEMO_PACKAGES);
  const [vehicles, setVehicles] = useState<Vehicle[]>(DEMO_VEHICLES);
  const [zones, setZones] = useState<Zone[]>(DEMO_ZONES);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [c, p, v, z] = await Promise.all([
          apiService.getCustomers(),
          apiService.getPackages(),
          apiService.getVehicles(),
          apiService.getZones(),
        ]);
        if (cancelled) return;
        if (c?.length) setCustomers(c);
        if (p?.length) setPackages(p);
        if (v?.length) setVehicles(v);
        if (z?.length) setZones(z);
      } catch {
        /* keep demo corpus so KMP still has text to match */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const runSearch = async (pattern: string) => {
    const trimmed = pattern.trim();
    if (!trimmed) return;
    setIsSearching(true);
    setQuery(trimmed);
    try {
      const res: KMPResult = await apiService.runKMP(trimmed);
      const nextHits: SearchHit[] = [];
      (res.matching_customers || []).forEach((row: any) => {
        const c = row.customer || row;
        nextHits.push({
          kind: 'customer',
          id: c.id,
          title: c.name,
          subtitle: c.address,
        });
      });
      (res.matching_packages || []).forEach((p: any) => {
        nextHits.push({
          kind: 'package',
          id: p.id,
          title: p.tracking_number || p.id,
          subtitle: `${p.status || ''} · ${p.customer_id || ''}`.trim(),
        });
      });
      (res.matching_vehicles || []).forEach((v: any) => {
        nextHits.push({
          kind: 'vehicle',
          id: v.id,
          title: v.vehicle_number || v.id,
          subtitle: `${v.driver_name || ''} · ${v.status || ''}`.trim(),
        });
      });
      (res.matching_zones || []).forEach((z: any) => {
        nextHits.push({ kind: 'zone', id: z.id, title: z.name, subtitle: z.id });
      });
      if (nextHits.length === 0) {
        const local = localKmpSearch(trimmed, customers, packages, vehicles, zones);
        setHits(local.hits);
        setComparisons(local.comparisons);
        setScanned(local.scanned);
        setUsedFallback(true);
      } else {
        setHits(nextHits);
        setComparisons(res.total_comparisons_all_customers || res.comparisons || 0);
        setScanned(res.total_records_scanned || res.total_customers_scanned || nextHits.length);
        setUsedFallback(false);
      }
    } catch {
      const local = localKmpSearch(trimmed, customers, packages, vehicles, zones);
      setHits(local.hits);
      setComparisons(local.comparisons);
      setScanned(local.scanned);
      setUsedFallback(true);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setHits([]);
    setComparisons(0);
    setScanned(0);
    setUsedFallback(false);
  };

  const highlightedCustomerIds = useMemo(
    () => hits.filter((h) => h.kind === 'customer').map((h) => h.id),
    [hits]
  );

  const value: SearchContextValue = {
    query,
    hits,
    comparisons,
    scanned,
    isSearching,
    usedFallback,
    highlightedCustomerIds,
    runSearch,
    clearSearch,
  };

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
};
