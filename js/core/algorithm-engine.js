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
  return value === undefined ? undefined : structuredClone(value);
}

function deepFreeze(value) {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return value;
  Object.freeze(value);
  Object.values(value).forEach(deepFreeze);
  return value;
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
        frameId: event.frameId ?? null,
        childFrameId: event.childFrameId ?? null,
        variables: clone(event.variables ?? {}),
        structures: clone(event.structures ?? {}),
        counters: clone(counters),
        visualization: clone(event.visualization ?? {}),
        checkpointId: event.checkpointId ?? null,
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
  return deepFreeze({
    algorithmId,
    input: clone(input),
    result: clone(result),
    counters: execution.counters,
    trace: execution.trace
  });
}
