from typing import Dict, Any, List

def compute_lps_array(pattern: str) -> Dict[str, Any]:
    """
    Compute the Longest Prefix Suffix (LPS) array for KMP algorithm.
    lps[i] stores the length of the longest proper prefix of pattern[0..i]
    that is also a suffix of pattern[0..i].
    """
    m = len(pattern)
    lps = [0] * m
    if m == 0:
        return {"lps": [], "steps": []}
    
    length = 0  # length of previous longest prefix suffix
    i = 1
    steps = []

    steps.append({
        "phase": "LPS initialization",
        "index": 0,
        "char": pattern[0],
        "length": 0,
        "lps": list(lps),
        "explanation": f"Set lps[0] = 0 for initial character '{pattern[0]}'"
    })

    while i < m:
        if pattern[i] == pattern[length]:
            length += 1
            lps[i] = length
            steps.append({
                "phase": "LPS build",
                "index": i,
                "char": pattern[i],
                "matched_with": pattern[length - 1],
                "length": length,
                "lps": list(lps),
                "explanation": f"Match found: '{pattern[i]}' == '{pattern[length - 1]}'. lps[{i}] = {length}"
            })
            i += 1
        else:
            if length != 0:
                prev_length = length
                length = lps[length - 1]
                steps.append({
                    "phase": "LPS fallback",
                    "index": i,
                    "char": pattern[i],
                    "prev_length": prev_length,
                    "new_length": length,
                    "lps": list(lps),
                    "explanation": f"Mismatch: '{pattern[i]}' != pattern[{prev_length}]. Fallback length to lps[{prev_length - 1}] = {length}"
                })
            else:
                lps[i] = 0
                steps.append({
                    "phase": "LPS no match",
                    "index": i,
                    "char": pattern[i],
                    "length": 0,
                    "lps": list(lps),
                    "explanation": f"Mismatch and length is 0. Set lps[{i}] = 0"
                })
                i += 1

    return {"lps": lps, "steps": steps}


def kmp_search(text: str, pattern: str) -> Dict[str, Any]:
    """
    Knuth-Morris-Pratt (KMP) String Matching Algorithm.
    Returns matches, LPS array, comparisons, and step-by-step trace.
    Time Complexity: O(N + M)
    Space Complexity: O(M)
    """
    if not pattern:
        return {
            "pattern": pattern,
            "text": text,
            "matches": [],
            "lps": [],
            "comparisons": 0,
            "lps_steps": [],
            "search_steps": [],
            "time_complexity": "O(N + M)",
            "space_complexity": "O(M)"
        }

    lps_data = compute_lps_array(pattern)
    lps = lps_data["lps"]
    
    n = len(text)
    m = len(pattern)
    i = 0  # index for text
    j = 0  # index for pattern
    
    matches = []
    comparisons = 0
    search_steps = []

    while i < n:
        comparisons += 1
        text_char = text[i]
        pattern_char = pattern[j]

        if pattern_char == text_char:
            search_steps.append({
                "text_index": i,
                "pattern_index": j,
                "text_char": text_char,
                "pattern_char": pattern_char,
                "matched": True,
                "action": f"Matched '{text_char}' at text[{i}] and pattern[{j}]",
                "current_j": j + 1
            })
            i += 1
            j += 1

            if j == m:
                match_start = i - j
                matches.append(match_start)
                search_steps.append({
                    "text_index": i - 1,
                    "pattern_index": j - 1,
                    "match_found": True,
                    "match_start": match_start,
                    "action": f"FULL PATTERN MATCH found starting at index {match_start}!",
                    "current_j": lps[j - 1]
                })
                j = lps[j - 1]
        else:
            search_steps.append({
                "text_index": i,
                "pattern_index": j,
                "text_char": text_char,
                "pattern_char": pattern_char,
                "matched": False,
                "action": f"Mismatch: text[{i}] '{text_char}' != pattern[{j}] '{pattern_char}'",
                "current_j": lps[j - 1] if j != 0 else 0
            })
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1

    return {
        "pattern": pattern,
        "text": text,
        "matches": matches,
        "lps": lps,
        "comparisons": comparisons,
        "lps_steps": lps_data["steps"],
        "search_steps": search_steps,
        "time_complexity": "O(N + M)",
        "space_complexity": "O(M)",
        "algorithm_info": {
            "name": "Knuth-Morris-Pratt (KMP)",
            "purpose": "Efficient customer and address pattern matching without backtracking in text",
            "preprocessing": "O(M) LPS table",
            "search_phase": "O(N) text scan"
        }
    }
