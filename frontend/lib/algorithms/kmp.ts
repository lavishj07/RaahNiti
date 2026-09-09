export function computeLPS(pattern: string) {
  const m = pattern.length;
  const lps = new Array(m).fill(0);
  let len = 0;
  let i = 1;

  while (i < m) {
    if (pattern[i] === pattern[len]) {
      len++;
      lps[i] = len;
      i++;
    } else {
      if (len !== 0) {
        len = lps[len - 1];
      } else {
        lps[i] = 0;
        i++;
      }
    }
  }
  return lps;
}

export function searchKMP(text: string, pattern: string) {
  if (!pattern) return { matches: [], lps: [], comparisons: 0, steps: [] };

  const lps = computeLPS(pattern);
  const n = text.length;
  const m = pattern.length;
  let i = 0;
  let j = 0;
  const matches: number[] = [];
  let comparisons = 0;
  const steps: any[] = [];

  while (i < n) {
    comparisons++;
    const textChar = text[i];
    const patternChar = pattern[j];

    if (patternChar === textChar) {
      steps.push({
        textIndex: i,
        patternIndex: j,
        textChar,
        patternChar,
        matched: true,
        action: `Matched '${textChar}' at text[${i}] and pattern[${j}]`,
      });
      i++;
      j++;

      if (j === m) {
        const matchStart = i - j;
        matches.push(matchStart);
        steps.push({
          textIndex: i - 1,
          patternIndex: j - 1,
          matched: true,
          matchFound: true,
          matchStart,
          action: `MATCH FOUND starting at index ${matchStart}`,
        });
        j = lps[j - 1];
      }
    } else {
      steps.push({
        textIndex: i,
        patternIndex: j,
        textChar,
        patternChar,
        matched: false,
        action: `Mismatch '${textChar}' != '${patternChar}'. Set pattern pointer to lps[${j - 1}] = ${j > 0 ? lps[j - 1] : 0}`,
      });
      if (j !== 0) {
        j = lps[j - 1];
      } else {
        i++;
      }
    }
  }

  return { matches, lps, comparisons, steps };
}
