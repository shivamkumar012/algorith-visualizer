/**
 * Step generator for Selection Sort
 * Divides array into sorted prefix and unsorted suffix, finding minimum of unsorted each round.
 */

export function generateSelectionSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set();

  const getHighlights = (options = {}) => {
    const { currentI = -1, minIdx = -1, scanningJ = -1, swapping = [] } = options;
    const h = {};

    for (let idx = 0; idx < n; idx++) {
      if (swapping.includes(idx)) {
        h[idx] = 'swapping';
      } else if (sortedIndices.has(idx)) {
        h[idx] = 'sorted';
      } else if (idx === minIdx) {
        h[idx] = 'pivot'; // use distinct accent for current minimum
      } else if (idx === scanningJ) {
        h[idx] = 'comparing';
      } else if (idx === currentI) {
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
    highlights: getHighlights(),
    pointers: {},
    stats: {
      comparisons: 0,
      swaps: 0,
      status: 'initial'
    },
    description: `Selection Sort initialized with ${n} elements.`,
    codeLine: 1
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    // Step: Start pass i, assume arr[i] is minimum
    steps.push({
      type: 'array',
      array: [...arr],
      highlights: getHighlights({ currentI: i, minIdx: i }),
      pointers: { [i]: 'i / min' },
      stats: {
        comparisons,
        swaps,
        status: 'running'
      },
      description: `Pass ${i + 1}: Starting search for minimum element in unsorted range [${i}..${n - 1}]. Initial min at index ${i} (${arr[i]}).`,
      codeLine: 3
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;

      // Step: Compare arr[j] with arr[minIdx]
      const pointers = { [minIdx]: 'min', [j]: 'j' };
      if (i !== minIdx) pointers[i] = 'i';

      steps.push({
        type: 'array',
        array: [...arr],
        highlights: getHighlights({ currentI: i, minIdx, scanningJ: j }),
        pointers,
        stats: {
          comparisons,
          swaps,
          status: 'running'
        },
        description: `Comparing arr[${j}] (${arr[j]}) with current minimum arr[${minIdx}] (${arr[minIdx]}).`,
        codeLine: 5
      });

      if (arr[j] < arr[minIdx]) {
        const oldMin = minIdx;
        minIdx = j;

        const newPointers = { [minIdx]: 'new min' };
        if (i !== minIdx) newPointers[i] = 'i';

        steps.push({
          type: 'array',
          array: [...arr],
          highlights: getHighlights({ currentI: i, minIdx }),
          pointers: newPointers,
          stats: {
            comparisons,
            swaps,
            status: 'running'
          },
          description: `Found smaller element! Updating minimum index from ${oldMin} to ${minIdx} (value: ${arr[minIdx]}).`,
          codeLine: 6
        });
      }
    }

    if (minIdx !== i) {
      swaps++;
      const valI = arr[i];
      const valMin = arr[minIdx];
      arr[i] = valMin;
      arr[minIdx] = valI;

      steps.push({
        type: 'array',
        array: [...arr],
        highlights: getHighlights({ swapping: [i, minIdx] }),
        pointers: { [i]: 'swapped min', [minIdx]: 'swapped' },
        stats: {
          comparisons,
          swaps,
          status: 'running'
        },
        description: `Swapped minimum element ${valMin} (from index ${minIdx}) into position ${i}.`,
        codeLine: 10
      });
    } else {
      steps.push({
        type: 'array',
        array: [...arr],
        highlights: getHighlights({ currentI: i, minIdx: i }),
        pointers: { [i]: 'min in place' },
        stats: {
          comparisons,
          swaps,
          status: 'running'
        },
        description: `Element at index ${i} (${arr[i]}) was already the minimum in the unsorted portion. No swap needed.`,
        codeLine: 9
      });
    }

    sortedIndices.add(i);
  }

  // Last element is automatically in place
  sortedIndices.add(n - 1);

  // Final Step
  steps.push({
    type: 'array',
    array: [...arr],
    highlights: getHighlights(),
    pointers: {},
    stats: {
      comparisons,
      swaps,
      status: 'completed'
    },
    description: `Selection Sort complete! Array fully sorted with ${comparisons} comparisons and ${swaps} swaps.`,
    codeLine: 12
  });

  const totalSteps = steps.length;
  steps.forEach((step, idx) => {
    step.stats.stepNumber = idx + 1;
    step.stats.totalSteps = totalSteps;
  });

  return steps;
}
