/**
 * Step generator for Recursion (Factorial & Visual Call Stack)
 * Visualizes function invocations pushing frames onto the stack, base case detection,
 * and return/unwinding in LIFO order.
 */

export function generateRecursionSteps(n = 5) {
  // Clamp n between 1 and 8 to keep stack clean and readable
  n = Math.max(1, Math.min(8, Math.floor(n)));
  const steps = [];

  let callCount = 0;
  let returnCount = 0;
  let maxDepth = 0;

  // Snapshot helper
  const snapshot = (stack, phase, desc, codeLine, status = 'running') => {
    steps.push({
      type: 'recursion',
      targetN: n,
      phase, // 'init' | 'push' | 'base-case' | 'unwind' | 'complete'
      stack: stack.map(f => ({ ...f })),
      stats: {
        calls: callCount,
        maxDepth,
        returns: returnCount,
        status
      },
      description: desc,
      codeLine
    });
  };

  // Stack is an array of frames: bottom (index 0) to top (last index)
  const currentStack = [];

  // Step 0: Initial state
  snapshot(
    currentStack,
    'init',
    `Recursion initialized: Ready to compute factorial(${n}) with base case n <= 1.`,
    1,
    'initial'
  );

  function simulateFactorial(currN) {
    callCount++;
    const frameId = callCount;
    maxDepth = Math.max(maxDepth, currentStack.length + 1);

    const frame = {
      id: frameId,
      name: `factorial(${currN})`,
      n: currN,
      status: 'calling',
      returnVal: null,
      subResult: null,
      expression: currN <= 1 ? `return 1` : `${currN} × factorial(${currN - 1})`
    };

    currentStack.push(frame);

    // Step: Function call push
    snapshot(
      currentStack,
      'push',
      `PUSH Frame #${frameId}: Calling factorial(${currN}). New activation record pushed to Call Stack (Depth: ${currentStack.length}).`,
      currN <= 1 ? 3 : 7
    );

    if (currN <= 1) {
      // Base Case step
      frame.status = 'base-case';
      frame.returnVal = 1;
      returnCount++;

      snapshot(
        currentStack,
        'base-case',
        `BASE CASE REACHED: factorial(${currN}) evaluates (n <= 1) → returns 1 directly without further recursion.`,
        4
      );

      // Unwind base frame
      frame.status = 'returned';
      snapshot(
        currentStack,
        'unwind',
        `POP Frame #${frameId}: factorial(${currN}) returns 1 to its caller.`,
        4
      );

      currentStack.pop();
      return 1;
    }

    // Waiting for sub-call
    frame.status = 'waiting';
    snapshot(
      currentStack,
      'push',
      `Frame #${frameId} [factorial(${currN})] pauses and waits for sub-problem factorial(${currN - 1}) to resolve.`,
      7
    );

    const subVal = simulateFactorial(currN - 1);

    // After sub-call returned, calculate result
    // Re-access top frame (which is our current frame)
    const activeFrame = currentStack[currentStack.length - 1];
    activeFrame.subResult = subVal;
    activeFrame.returnVal = currN * subVal;
    activeFrame.status = 'calculating';
    returnCount++;

    snapshot(
      currentStack,
      'unwind',
      `CALCULATION in Frame #${frameId}: factorial(${currN - 1}) returned ${subVal}. Evaluating ${currN} × ${subVal} = ${activeFrame.returnVal}.`,
      8
    );

    // Unwind this frame
    activeFrame.status = 'returned';
    snapshot(
      currentStack,
      'unwind',
      `POP Frame #${frameId}: factorial(${currN}) returning ${activeFrame.returnVal}. Stack depth unwinds from ${currentStack.length} to ${currentStack.length - 1}.`,
      9
    );

    currentStack.pop();
    return activeFrame.returnVal;
  }

  const finalResult = simulateFactorial(n);

  // Final Complete step
  steps.push({
    type: 'recursion',
    targetN: n,
    phase: 'complete',
    stack: [],
    finalResult,
    stats: {
      calls: callCount,
      maxDepth,
      returns: returnCount,
      status: 'completed'
    },
    description: `Recursion complete! All call frames unwound. Final result: factorial(${n}) = ${finalResult}. Total calls made: ${callCount}, Max stack depth: ${maxDepth}.`,
    codeLine: 9
  });

  const totalSteps = steps.length;
  steps.forEach((step, idx) => {
    step.stats.stepNumber = idx + 1;
    step.stats.totalSteps = totalSteps;
  });

  return steps;
}
