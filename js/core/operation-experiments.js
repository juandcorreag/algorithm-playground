import { executeAlgorithm } from './algorithm-engine.js';

export function runOperationExperiment(algorithmId, sizes, createInput, counter = 'comparisons') {
  if (!Array.isArray(sizes) || sizes.some(n => !Number.isInteger(n) || n <= 0)) throw new TypeError('Experiment sizes must be positive integers.');
  if (typeof createInput !== 'function') throw new TypeError('An input factory is required.');
  return sizes.map(n => {
    const execution = executeAlgorithm(algorithmId, createInput(n), { collectTrace: false });
    if (!(counter in execution.counters)) throw new RangeError(`Unknown operation counter: ${counter}`);
    return { n, operations: execution.counters[counter] };
  });
}
