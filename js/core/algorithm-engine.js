import { getAlgorithm } from './algorithm-registry.js';

export const COUNTER_KEYS = Object.freeze([
  'comparisons',
  'assignments',
  'arithmeticOperations',
  'arrayAccesses',
  'loopIterations'
]);

export function createCounters() {
  return Object.fromEntries(COUNTER_KEYS.map(key => [key, 0]));
}

function clone(value) {
  return value === undefined ? undefined : JSON.parse(JSON.stringify(value));
}

function createRecorder(collectTrace = true) {
  const counters = createCounters();
  const trace = [];
  return {
    counters,
    record(event) {
      for (const [key, amount] of Object.entries(event.increment ?? {})) {
        if (!COUNTER_KEYS.includes(key)) throw new RangeError(`Unknown operation counter: ${key}`);
        if (!Number.isInteger(amount) || amount < 0) throw new TypeError(`Invalid increment for ${key}`);
        counters[key] += amount;
      }
      if (!collectTrace) return;
      trace.push({
        step: trace.length + 1,
        line: event.line,
        type: event.type,
        variables: clone(event.variables ?? {}),
        counters: clone(counters),
        visualization: clone(event.visualization ?? {}),
        message: clone(event.message ?? { es: '', en: '' })
      });
    },
    snapshot() {
      return { counters: clone(counters), trace: clone(trace) };
    }
  };
}

export function executeAlgorithm(algorithmId, input, options = {}) {
  const algorithm = getAlgorithm(algorithmId);
  const recorder = createRecorder(options.collectTrace !== false);
  const safeInput = clone(input);
  const result = algorithm.execute(safeInput, options, recorder);
  const execution = recorder.snapshot();
  return Object.freeze({
    algorithmId,
    input: clone(input),
    result: clone(result),
    counters: Object.freeze(execution.counters),
    trace: Object.freeze(execution.trace)
  });
}
