/**
 * Step generator for Linear Search
 * Sequentially searches array from left to right for target.
 */

export function generateLinearSearchSteps(initialArray, target) {
  const steps = [];
  const arr = [...initialArray];
  const n = arr.length;
  let comparisons = 0;
  let found = false;
  let foundIndex = -1;

  // Helper to build initial highlights
  const makeDefaultHighlights = () => {
    const h = {};
    for (let i = 0; i < n; i++) h[i] = 'default';
    return h;
  };

  // Initial Step 0
  steps.push({
    type: 'array',
    array: [...arr],
    highlights: makeDefaultHighlights(),
    pointers: {},
    stats: {
      comparisons: 0,
      swaps: 0,
      status: 'initial'
    },
    description: `Ready to search for target value ${target} sequentially starting at index 0.`,
    codeLine: 1
  });

  for (let i = 0; i < n; i++) {
    comparisons++;
    const currentVal = arr[i];

    // Comparing step
    const comparingHighlights = makeDefaultHighlights();
    for (let prev = 0; prev < i; prev++) {
      comparingHighlights[prev] = 'eliminated';
    }
    comparingHighlights[i] = 'comparing';

    const pointers = { [i]: 'i' };

    if (currentVal === target) {
      found = true;
      foundIndex = i;

      steps.push({
        type: 'array',
        array: [...arr],
        highlights: { ...comparingHighlights },
        pointers: { ...pointers },
        stats: {
          comparisons,
          swaps: 0,
          status: 'running'
        },
        description: `Step ${i + 1}: Checking index ${i} (value: ${currentVal}). ${currentVal} == ${target}. Match found!`,
        codeLine: 3
      });

      // Found final step
      const foundHighlights = makeDefaultHighlights();
      for (let prev = 0; prev < i; prev++) {
        foundHighlights[prev] = 'eliminated';
      }
      foundHighlights[i] = 'found';

      steps.push({
        type: 'array',
        array: [...arr],
        highlights: foundHighlights,
        pointers: { [i]: 'Found!' },
        stats: {
          comparisons,
          swaps: 0,
          status: 'found'
        },
        description: `Target ${target} successfully located at index ${i} after ${comparisons} comparison${comparisons > 1 ? 's' : ''}!`,
        codeLine: 4
      });
      break;
    } else {
      steps.push({
        type: 'array',
        array: [...arr],
        highlights: { ...comparingHighlights },
        pointers: { ...pointers },
        stats: {
          comparisons,
          swaps: 0,
          status: 'running'
        },
        description: `Step ${i + 1}: Checking index ${i} (value: ${currentVal}). ${currentVal} != ${target}. Moving to next element.`,
        codeLine: 3
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
      description: `Target ${target} was not found in the array after checking all ${n} elements. Returning -1.`,
      codeLine: 7
    });
  }

  // Set stepNumber and totalSteps on all steps
  const totalSteps = steps.length;
  steps.forEach((step, idx) => {
    step.stats.stepNumber = idx + 1;
    step.stats.totalSteps = totalSteps;
  });

  return steps;
}
