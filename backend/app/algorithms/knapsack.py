from typing import Dict, Any, List

def solve_01_knapsack(items: List[Dict[str, Any]], capacity: int) -> Dict[str, Any]:
    """
    0/1 Knapsack Dynamic Programming implementation.
    
    State: DP[i][w] = max value using first i items with weight capacity w
    Transition: DP[i][w] = max(DP[i-1][w], DP[i-1][w-wt[i]] + val[i])
    
    Time Complexity: O(N * W)
    Space Complexity: O(N * W)
    """
    n = len(items)
    W = capacity
    
    # DP Table of size (n+1) x (W+1)
    dp = [[0] * (W + 1) for _ in range(n + 1)]
    
    # Trace steps for visualization
    dp_steps = []
    
    for i in range(1, n + 1):
        item = items[i - 1]
        item_id = item.get("id", i)
        item_name = item.get("name", f"Package {i}")
        weight = item.get("weight", 0)
        value = item.get("value", 0)
        priority = item.get("priority", 1)

        for w in range(W + 1):
            if weight <= w:
                include_val = dp[i - 1][w - weight] + value
                exclude_val = dp[i - 1][w]
                if include_val > exclude_val:
                    dp[i][w] = include_val
                    decision = "INCLUDE"
                else:
                    dp[i][w] = exclude_val
                    decision = "EXCLUDE (Better without)"
            else:
                dp[i][w] = dp[i - 1][w]
                decision = "EXCLUDE (Overweight)"

            # Record sample key DP steps for animation (first 200 to keep JSON light)
            if len(dp_steps) < 200 or w == W:
                dp_steps.append({
                    "item_index": i,
                    "item_name": item_name,
                    "item_weight": weight,
                    "item_value": value,
                    "capacity_column": w,
                    "dp_value": dp[i][w],
                    "decision": decision
                })

    # Backtrack to identify selected packages
    selected_items = []
    rejected_items = []
    w = W
    for i in range(n, 0, -1):
        item = items[i - 1]
        weight = item.get("weight", 0)
        value = item.get("value", 0)
        
        if dp[i][w] != dp[i - 1][w]:
            selected_items.append(item)
            w -= weight
        else:
            rejected_items.append(item)

    selected_items.reverse()
    
    total_weight = sum(item.get("weight", 0) for item in selected_items)
    total_value = sum(item.get("value", 0) for item in selected_items)
    total_priority = sum(item.get("priority", 1) for item in selected_items)
    remaining_capacity = W - total_weight
    utilization_pct = round((total_weight / W * 100), 2) if W > 0 else 0

    return {
        "capacity": capacity,
        "total_items": n,
        "selected_items": selected_items,
        "rejected_items": rejected_items,
        "total_weight": total_weight,
        "total_value": total_value,
        "total_priority": total_priority,
        "remaining_capacity": remaining_capacity,
        "utilization_percentage": utilization_pct,
        "dp_table": dp,
        "dp_steps": dp_steps,
        "time_complexity": f"O({n} × {capacity}) = O(N × W)",
        "space_complexity": f"O({n+1} × {capacity+1}) = O(N × W)",
        "algorithm_info": {
            "name": "0/1 Knapsack Dynamic Programming",
            "purpose": "Optimal cargo package selection to maximize priority/value within truck payload capacity",
            "state_definition": "DP[i][w] = Max value using subset of first i packages within weight limit w",
            "transition": "DP[i][w] = max(DP[i-1][w], DP[i-1][w - weight[i]] + value[i])"
        }
    }
