export interface KnapsackItem {
  id: string;
  name: string;
  weight: number;
  value: number;
  priority: number;
}

export function solve_01_knapsack(items: KnapsackItem[], capacity: number) {
  const n = items.length;
  const W = capacity;
  const dp: number[][] = Array.from({ length: n + 1 }, () => new Array(W + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const item = items[i - 1];
    const weight = item.weight;
    const value = item.value;

    for (let w = 0; w <= W; w++) {
      if (weight <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - weight] + value);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  const selectedItems: KnapsackItem[] = [];
  const rejectedItems: KnapsackItem[] = [];
  let w = W;

  for (let i = n; i > 0; i--) {
    const item = items[i - 1];
    if (dp[i][w] !== dp[i - 1][w]) {
      selectedItems.push(item);
      w -= item.weight;
    } else {
      rejectedItems.push(item);
    }
  }

  selectedItems.reverse();
  const totalWeight = selectedItems.reduce((sum, item) => sum + item.weight, 0);
  const totalValue = selectedItems.reduce((sum, item) => sum + item.value, 0);
  const totalPriority = selectedItems.reduce((sum, item) => sum + item.priority, 0);
  const utilizationPct = W > 0 ? Math.round((totalWeight / W) * 100) : 0;

  return {
    capacity,
    totalItems: n,
    selectedItems,
    rejectedItems,
    totalWeight,
    totalValue,
    totalPriority,
    remainingCapacity: W - totalWeight,
    utilizationPct,
    dpTable: dp,
  };
}
