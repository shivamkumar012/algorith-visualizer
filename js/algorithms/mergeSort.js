/**
 * Step generator for Merge Sort
 * Visualizes recursive divide-and-conquer and merging of sorted subarrays.
 */

export function generateMergeSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let overwrites = 0;

  const makeHighlights = (activeRange = [], comparing = [], overwriting = [], sortedRange = []) => {
    const h = {};
    for (let idx = 0; idx < n; idx++) {
      if (overwriting.includes(idx)) {
        h[idx] = 'swapping';
      } else if (comparing.includes(idx)) {
        h[idx] = 'comparing';
      } else if (sortedRange.includes(idx)) {
        h[idx] = 'sorted';
      } else if (activeRange.length === 2 && idx >= activeRange[0] && idx <= activeRange[1]) {
        h[idx] = 'selected';
      } else {
        h[idx] = 'default';
      }
    }
    return h;
  };

  // Initial Step
  steps.push({
    type: 'array',
    array: [...arr],
    highlights: makeHighlights(),
    pointers: { 0: 'L', [n - 1]: 'R' },
    stats: {
      comparisons: 0,
      swaps: 0,
      status: 'initial'
    },
    description: `Merge Sort initialized with ${n} elements. Starting recursive divide and conquer on range [0..${n - 1}].`,
    codeLine: 16
  });

  function merge(l, m, r) {
    const n1 = m - l + 1;
    const n2 = r - m;
    const L = [];
    const R = [];

    for (let i = 0; i < n1; i++) L.push(arr[l + i]);
    for (let j = 0; j < n2; j++) R.push(arr[m + 1 + j]);

    // Step: Starting merge of [l..m] and [m+1..r]
    steps.push({
      type: 'array',
      array: [...arr],
      highlights: makeHighlights([l, r]),
      pointers: { [l]: `L[0..${n1 - 1}]`, [m + 1]: `R[0..${n2 - 1}]` },
      stats: {
        comparisons,
        swaps: overwrites,
        status: 'running'
      },
      description: `Merging sorted subarrays [${l}..${m}] (values: [${L.join(', ')}]) and [${m + 1}..${r}] (values: [${R.join(', ')}]).`,
      codeLine: 1
    });

    let i = 0;
    let j = 0;
    let k = l;

    while (i < n1 && j < n2) {
      comparisons++;
      const valL = L[i];
      const valR = R[j];

      // Compare L[i] and R[j]
      steps.push({
        type: 'array',
        array: [...arr],
        highlights: makeHighlights([l, r], [l + i, m + 1 + j]),
        pointers: { [k]: `k=${k}`, [l + i]: `L[${i}]=${valL}`, [m + 1 + j]: `R[${j}]=${valR}` },
        stats: {
          comparisons,
          swaps: overwrites,
          status: 'running'
        },
        description: `Comparing L[${i}] (${valL}) and R[${j}] (${valR}).`,
        codeLine: 7
      });

      if (valL <= valR) {
        arr[k] = valL;
        overwrites++;

        steps.push({
          type: 'array',
          array: [...arr],
          highlights: makeHighlights([l, r], [], [k]),
          pointers: { [k]: `merged ${valL}` },
          stats: {
            comparisons,
            swaps: overwrites,
            status: 'running'
          },
          description: `${valL} <= ${valR}: Placed ${valL} into position ${k}.`,
          codeLine: 8
        });

        i++;
      } else {
        arr[k] = valR;
        overwrites++;

        steps.push({
          type: 'array',
          array: [...arr],
          highlights: makeHighlights([l, r], [], [k]),
          pointers: { [k]: `merged ${valR}` },
          stats: {
            comparisons,
            swaps: overwrites,
            status: 'running'
          },
          description: `${valR} < ${valL}: Placed ${valR} into position ${k}.`,
          codeLine: 9
        });

        j++;
      }
      k++;
    }

    // Remaining elements of L
    while (i < n1) {
      arr[k] = L[i];
      overwrites++;

      steps.push({
        type: 'array',
        array: [...arr],
        highlights: makeHighlights([l, r], [], [k]),
        pointers: { [k]: `copy L[${i}]` },
        stats: {
          comparisons,
          swaps: overwrites,
          status: 'running'
        },
        description: `Copying remaining L[${i}] (${L[i]}) into position ${k}.`,
        codeLine: 11
      });

      i++;
      k++;
    }

    // Remaining elements of R
    while (j < n2) {
      arr[k] = R[j];
      overwrites++;

      steps.push({
        type: 'array',
        array: [...arr],
        highlights: makeHighlights([l, r], [], [k]),
        pointers: { [k]: `copy R[${j}]` },
        stats: {
          comparisons,
          swaps: overwrites,
          status: 'running'
        },
        description: `Copying remaining R[${j}] (${R[j]}) into position ${k}.`,
        codeLine: 12
      });

      j++;
      k++;
    }

    const mergedIndices = [];
    for (let idx = l; idx <= r; idx++) mergedIndices.push(idx);

    steps.push({
      type: 'array',
      array: [...arr],
      highlights: makeHighlights([], [], [], mergedIndices),
      pointers: { [l]: 'merged', [r]: 'merged' },
      stats: {
        comparisons,
        swaps: overwrites,
        status: 'running'
      },
      description: `Subarray [${l}..${r}] is now fully merged and sorted: [${arr.slice(l, r + 1).join(', ')}].`,
      codeLine: 19
    });
  }

  function sort(l, r) {
    if (l >= r) return;

    const m = Math.floor(l + (r - l) / 2);

    // Divide step
    steps.push({
      type: 'array',
      array: [...arr],
      highlights: makeHighlights([l, r]),
      pointers: { [l]: 'l', [m]: 'mid', [r]: 'r' },
      stats: {
        comparisons,
        swaps: overwrites,
        status: 'running'
      },
      description: `Dividing range [${l}..${r}] at midpoint ${m} into [${l}..${m}] and [${m + 1}..${r}].`,
      codeLine: 17
    });

    sort(l, m);
    sort(m + 1, r);
    merge(l, m, r);
  }

  sort(0, n - 1);

  // Final Step
  const allSorted = {};
  for (let idx = 0; idx < n; idx++) allSorted[idx] = 'sorted';

  steps.push({
    type: 'array',
    array: [...arr],
    highlights: allSorted,
    pointers: {},
    stats: {
      comparisons,
      swaps: overwrites,
      status: 'completed'
    },
    description: `Merge Sort complete! Array sorted in ${comparisons} comparisons and ${overwrites} write operations.`,
    codeLine: 20
  });

  const totalSteps = steps.length;
  steps.forEach((step, idx) => {
    step.stats.stepNumber = idx + 1;
    step.stats.totalSteps = totalSteps;
  });

  return steps;
}
