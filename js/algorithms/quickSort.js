/**
 * Step generator for Quick Sort
 * Selects pivot, partitions subarray with i and j pointers, recursively sorts partitions.
 */

export function generateQuickSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set();

  const makeHighlights = (options = {}) => {
    const {
      activeRange = [],
      pivotIdx = -1,
      comparingIdx = -1,
      swapping = [],
      lesserBoundary = -1
    } = options;
    const h = {};

    for (let idx = 0; idx < n; idx++) {
      if (swapping.includes(idx)) {
        h[idx] = 'swapping';
      } else if (sortedIndices.has(idx)) {
        h[idx] = 'sorted';
      } else if (idx === pivotIdx) {
        h[idx] = 'pivot';
      } else if (idx === comparingIdx) {
        h[idx] = 'comparing';
      } else if (idx === lesserBoundary) {
        h[idx] = 'selected';
      } else if (activeRange.length === 2 && idx >= activeRange[0] && idx <= activeRange[1]) {
        h[idx] = 'default';
      } else {
        h[idx] = 'eliminated';
      }
    }
    return h;
  };

  // Initial Step
  steps.push({
    type: 'array',
    array: [...arr],
    highlights: makeHighlights({ activeRange: [0, n - 1] }),
    pointers: { 0: 'low', [n - 1]: 'high' },
    stats: {
      comparisons: 0,
      swaps: 0,
      status: 'initial'
    },
    description: `Quick Sort initialized on array of ${n} elements. Range: [0..${n - 1}].`,
    codeLine: 13
  });

  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;

    // Step: Select pivot
    steps.push({
      type: 'array',
      array: [...arr],
      highlights: makeHighlights({ activeRange: [low, high], pivotIdx: high }),
      pointers: { [high]: `pivot (${pivot})`, [low]: 'low' },
      stats: {
        comparisons,
        swaps,
        status: 'running'
      },
      description: `Partitioning range [${low}..${high}]: Selected arr[${high}] (${pivot}) as the pivot.`,
      codeLine: 2
    });

    for (let j = low; j < high; j++) {
      comparisons++;

      // Step: Compare arr[j] with pivot
      const pointers = { [high]: `pivot (${pivot})`, [j]: `j (${arr[j]})` };
      if (i >= low) pointers[i] = `i (${arr[i]})`;

      steps.push({
        type: 'array',
        array: [...arr],
        highlights: makeHighlights({
          activeRange: [low, high],
          pivotIdx: high,
          comparingIdx: j,
          lesserBoundary: i >= low ? i : -1
        }),
        pointers,
        stats: {
          comparisons,
          swaps,
          status: 'running'
        },
        description: `Comparing arr[${j}] (${arr[j]}) with pivot (${pivot}).`,
        codeLine: 5
      });

      if (arr[j] <= pivot) {
        i++;
        if (i !== j) {
          swaps++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          steps.push({
            type: 'array',
            array: [...arr],
            highlights: makeHighlights({
              activeRange: [low, high],
              pivotIdx: high,
              swapping: [i, j]
            }),
            pointers: { [high]: `pivot (${pivot})`, [i]: `i (swapped)`, [j]: `j (swapped)` },
            stats: {
              comparisons,
              swaps,
              status: 'running'
            },
            description: `arr[${j}] (${arr[i]}) <= pivot (${pivot}): Incremented i to ${i} and swapped arr[${i}] and arr[${j}].`,
            codeLine: 7
          });
        }
      }
    }

    // Place pivot at i + 1
    swaps++;
    const pi = i + 1;
    const temp = arr[pi];
    arr[pi] = arr[high];
    arr[high] = temp;
    sortedIndices.add(pi);

    steps.push({
      type: 'array',
      array: [...arr],
      highlights: makeHighlights({
        activeRange: [low, high],
        swapping: [pi, high]
      }),
      pointers: { [pi]: `pivot placed (${arr[pi]})` },
      stats: {
        comparisons,
        swaps,
        status: 'running'
      },
      description: `Placing pivot in its sorted final position: Swapped arr[${pi}] and arr[${high}]. Pivot ${arr[pi]} is now locked at index ${pi}.`,
      codeLine: 10
    });

    return pi;
  }

  function sort(low, high) {
    if (low < high) {
      const pi = partition(low, high);
      sort(low, pi - 1);
      sort(pi + 1, high);
    } else if (low === high) {
      sortedIndices.add(low);
    }
  }

  sort(0, n - 1);

  // Mark all as sorted
  for (let idx = 0; idx < n; idx++) sortedIndices.add(idx);

  // Final Step
  steps.push({
    type: 'array',
    array: [...arr],
    highlights: makeHighlights({ activeRange: [0, n - 1] }),
    pointers: {},
    stats: {
      comparisons,
      swaps,
      status: 'completed'
    },
    description: `Quick Sort complete! Array sorted in ${comparisons} comparisons and ${swaps} swaps.`,
    codeLine: 18
  });

  const totalSteps = steps.length;
  steps.forEach((step, idx) => {
    step.stats.stepNumber = idx + 1;
    step.stats.totalSteps = totalSteps;
  });

  return steps;
}
