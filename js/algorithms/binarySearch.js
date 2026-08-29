/**
 * Step generator for Binary Search
 * Requires a sorted array. Iteratively halves search range [low..high].
 */

export function generateBinarySearchSteps(sortedArray, target) {
  const steps = [];
  const arr = [...sortedArray];
  const n = arr.length;
  let comparisons = 0;
  let found = false;

  const getRangeHighlights = (low, high, mid = -1, state = 'active') => {
    const h = {};
    for (let i = 0; i < n; i++) {
      if (i < low || i > high) {
        h[i] = 'eliminated';
      } else if (i === mid) {
        h[i] = state;
      } else {
        h[i] = 'default';
      }
    }
    return h;
  };

  // Initial Step 0
  steps.push({
    type: 'array',
    array: [...arr],
    highlights: getRangeHighlights(0, n - 1),
    pointers: { 0: 'low', [n - 1]: 'high' },
    stats: {
      comparisons: 0,
      swaps: 0,
      status: 'initial'
    },
    description: `Binary Search initialized for target ${target} on sorted array. Initial range: index [0..${n - 1}].`,
    codeLine: 2
  });

  let low = 0;
  let high = n - 1;

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    comparisons++;

    const pointers = {};
    if (low === high && low === mid) {
      pointers[mid] = 'low/mid/high';
    } else {
      if (low === mid) {
        pointers[low] = 'low/mid';
        pointers[high] = 'high';
      } else if (high === mid) {
        pointers[low] = 'low';
        pointers[high] = 'mid/high';
      } else {
        pointers[low] = 'low';
        pointers[mid] = 'mid';
        pointers[high] = 'high';
      }
    }

    // Step: Calculate mid and compare
    steps.push({
      type: 'array',
      array: [...arr],
      highlights: getRangeHighlights(low, high, mid, 'comparing'),
      pointers: { ...pointers },
      stats: {
        comparisons,
        swaps: 0,
        status: 'running'
      },
      description: `Examining mid index ${mid} (value: ${arr[mid]}). Range is [${low}..${high}]. Target is ${target}.`,
      codeLine: 4
    });

    if (arr[mid] === target) {
      found = true;
      // Found step
      const foundHighlights = getRangeHighlights(low, high, mid, 'found');
      // Keep only mid highlighted as found, others eliminated
      for (let i = 0; i < n; i++) {
        if (i !== mid) foundHighlights[i] = 'eliminated';
      }

      steps.push({
        type: 'array',
        array: [...arr],
        highlights: foundHighlights,
        pointers: { [mid]: 'Found!' },
        stats: {
          comparisons,
          swaps: 0,
          status: 'found'
        },
        description: `Target ${target} matches arr[${mid}] (${arr[mid]})! Search complete in ${comparisons} comparisons.`,
        codeLine: 6
      });
      break;
    } else if (arr[mid] < target) {
      const oldLow = low;
      low = mid + 1;

      // Discard left half
      steps.push({
        type: 'array',
        array: [...arr],
        highlights: getRangeHighlights(low, high),
        pointers: low <= high ? { [low]: 'low', [high]: 'high' } : {},
        stats: {
          comparisons,
          swaps: 0,
          status: 'running'
        },
        description: `arr[${mid}] (${arr[mid]}) < ${target}. Discarding left half [${oldLow}..${mid}]. Updating low = ${low}.`,
        codeLine: 8
      });
    } else {
      const oldHigh = high;
      high = mid - 1;

      // Discard right half
      steps.push({
        type: 'array',
        array: [...arr],
        highlights: getRangeHighlights(low, high),
        pointers: low <= high ? { [low]: 'low', [high]: 'high' } : {},
        stats: {
          comparisons,
          swaps: 0,
          status: 'running'
        },
        description: `arr[${mid}] (${arr[mid]}) > ${target}. Discarding right half [${mid}..${oldHigh}]. Updating high = ${high}.`,
        codeLine: 10
      });
    }
  }

  if (!found) {
    const finalHighlights = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = 'not-found';

    steps.push({
      type: 'array',
      array: [...arr],
      highlights: finalHighlights,
      pointers: {},
      stats: {
        comparisons,
        swaps: 0,
        status: 'not-found'
      },
      description: `Target ${target} was not found. low (${low}) > high (${high}), search interval exhausted. Returning -1.`,
      codeLine: 12
    });
  }

  const totalSteps = steps.length;
  steps.forEach((step, idx) => {
    step.stats.stepNumber = idx + 1;
    step.stats.totalSteps = totalSteps;
  });

  return steps;
}
