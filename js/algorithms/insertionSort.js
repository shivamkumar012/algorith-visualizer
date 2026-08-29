/**
 * Step generator for Insertion Sort
 * Iteratively takes next element as key and shifts larger elements in sorted prefix right.
 */

export function generateInsertionSortSteps(initialArray) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let shifts = 0;

  const getHighlights = (sortedUpTo = 0, keyIdx = -1, comparingIdx = -1, shiftedIdx = -1) => {
    const h = {};
    for (let idx = 0; idx < n; idx++) {
      if (idx === keyIdx) {
        h[idx] = 'key';
      } else if (idx === comparingIdx) {
        h[idx] = 'comparing';
      } else if (idx === shiftedIdx) {
        h[idx] = 'swapping';
      } else if (idx <= sortedUpTo) {
        h[idx] = 'sorted';
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
    highlights: getHighlights(0),
    pointers: { 0: 'sorted' },
    stats: {
      comparisons: 0,
      swaps: 0,
      status: 'initial'
    },
    description: `Insertion Sort initialized. Element at index 0 (${arr[0]}) is trivially sorted.`,
    codeLine: 1
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // Pick Key step
    steps.push({
      type: 'array',
      array: [...arr],
      highlights: getHighlights(i - 1, i),
      pointers: { [i]: `key=${key}` },
      stats: {
        comparisons,
        swaps: shifts,
        status: 'running'
      },
      description: `Pass ${i}: Picked key = arr[${i}] (${key}). Inserting into sorted subarray [0..${i - 1}].`,
      codeLine: 3
    });

    let inserted = false;
    while (j >= 0) {
      comparisons++;

      // Compare key with arr[j]
      steps.push({
        type: 'array',
        array: [...arr],
        highlights: getHighlights(i - 1, -1, j),
        pointers: { [j]: `compare with key (${key})` },
        stats: {
          comparisons,
          swaps: shifts,
          status: 'running'
        },
        description: `Comparing key (${key}) with sorted element arr[${j}] (${arr[j]}).`,
        codeLine: 5
      });

      if (arr[j] > key) {
        // Shift arr[j] to the right (arr[j + 1] = arr[j])
        shifts++;
        arr[j + 1] = arr[j];

        steps.push({
          type: 'array',
          array: [...arr],
          highlights: getHighlights(i - 1, -1, -1, j + 1),
          pointers: { [j + 1]: `shifted ${arr[j]}` },
          stats: {
            comparisons,
            swaps: shifts,
            status: 'running'
          },
          description: `Since ${arr[j]} > ${key}, shifted arr[${j}] rightward to index ${j + 1}.`,
          codeLine: 6
        });

        j--;
      } else {
        // Found insertion spot
        break;
      }
    }

    // Insert key at j + 1
    arr[j + 1] = key;

    steps.push({
      type: 'array',
      array: [...arr],
      highlights: getHighlights(i),
      pointers: { [j + 1]: `inserted key (${key})` },
      stats: {
        comparisons,
        swaps: shifts,
        status: 'running'
      },
      description: `Inserted key ${key} at index ${j + 1}. Subarray [0..${i}] is now fully sorted.`,
      codeLine: 9
    });
  }

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
      swaps: shifts,
      status: 'completed'
    },
    description: `Insertion Sort complete! Sorted ${n} elements with ${comparisons} comparisons and ${shifts} shifts.`,
    codeLine: 11
  });

  const totalSteps = steps.length;
  steps.forEach((step, idx) => {
    step.stats.stepNumber = idx + 1;
    step.stats.totalSteps = totalSteps;
  });

  return steps;
}
