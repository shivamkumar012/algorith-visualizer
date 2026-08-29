/**
 * Step generator for Bubble Sort
 * Repeatedly compares adjacent elements and swaps them if out of order.
 */

export function generateBubbleSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  const sortedIndices = new Set();

  const getHighlights = (comparingIndices = [], swappingIndices = []) => {
    const h = {};
    for (let i = 0; i < n; i++) {
      if (sortedIndices.has(i)) {
        h[i] = 'sorted';
      } else if (swappingIndices.includes(i)) {
        h[i] = 'swapping';
      } else if (comparingIndices.includes(i)) {
        h[i] = 'comparing';
      } else {
        h[i] = 'default';
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
    description: `Bubble Sort initialized with ${n} elements. Starting pass 1.`,
    codeLine: 1
  });

  for (let i = 0; i < n - 1; i++) {
    let swappedInPass = false;

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;

      // Step 1: Compare adjacent pair arr[j] & arr[j+1]
      steps.push({
        type: 'array',
        array: [...arr],
        highlights: getHighlights([j, j + 1]),
        pointers: { [j]: 'j', [j + 1]: 'j+1' },
        stats: {
          comparisons,
          swaps,
          status: 'running'
        },
        description: `Pass ${i + 1}: Comparing adjacent arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
        codeLine: 5
      });

      if (arr[j] > arr[j + 1]) {
        // Step 2: Swap them
        swaps++;
        swappedInPass = true;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        steps.push({
          type: 'array',
          array: [...arr],
          highlights: getHighlights([], [j, j + 1]),
          pointers: { [j]: 'swap', [j + 1]: 'swap' },
          stats: {
            comparisons,
            swaps,
            status: 'running'
          },
          description: `Since ${temp} > ${arr[j]}, swapped arr[${j}] and arr[${j + 1}].`,
          codeLine: 6
        });
      }
    }

    // Element at n - 1 - i is now in its sorted final position
    const sortedIdx = n - 1 - i;
    sortedIndices.add(sortedIdx);

    steps.push({
      type: 'array',
      array: [...arr],
      highlights: getHighlights(),
      pointers: { [sortedIdx]: 'sorted' },
      stats: {
        comparisons,
        swaps,
        status: 'running'
      },
      description: `Pass ${i + 1} complete: Element at index ${sortedIdx} (${arr[sortedIdx]}) has bubbled to its sorted position.`,
      codeLine: 10
    });

    if (!swappedInPass) {
      // Early exit optimization
      for (let k = 0; k < n; k++) sortedIndices.add(k);
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
        description: 'No swaps occurred in this pass. Array is already completely sorted!',
        codeLine: 10
      });
      break;
    }
  }

  // Ensure all indices are marked sorted
  for (let k = 0; k < n; k++) sortedIndices.add(k);

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
    description: `Bubble Sort complete! Sorted ${n} elements in ${comparisons} comparisons and ${swaps} swaps.`,
    codeLine: 12
  });

  const totalSteps = steps.length;
  steps.forEach((step, idx) => {
    step.stats.stepNumber = idx + 1;
    step.stats.totalSteps = totalSteps;
  });

  return steps;
}
