import assert from 'node:assert/strict';
import '../js/algorithms/index.js';
import { listAlgorithms, getAlgorithm } from '../js/core/algorithm-registry.js';
import { COUNTER_KEYS, executeAlgorithm } from '../js/core/algorithm-engine.js';
import { runOperationExperiment } from '../js/core/operation-experiments.js';

assert.deepEqual(listAlgorithms().map(item => item.id), ['find-max', 'linear-search', 'bubble-sort', 'binary-search']);

const descendingMax = executeAlgorithm('find-max', { array: [9, 7, 4, 1] });
assert.equal(descendingMax.result, 9);
assert.equal(descendingMax.counters.comparisons, 3);
assert.equal(descendingMax.counters.assignments, 1);

const ascendingMax = executeAlgorithm('find-max', { array: [1, 4, 7, 9] });
assert.equal(ascendingMax.result, 9);
assert.equal(ascendingMax.counters.comparisons, 3);
assert.equal(ascendingMax.counters.assignments, 4);

const found = executeAlgorithm('linear-search', { array: [8, 3, 6, 2], target: 6 });
assert.equal(found.result, 2);
assert.equal(found.counters.comparisons, 3);
const absent = executeAlgorithm('linear-search', { array: [8, 3, 6, 2], target: 10 });
assert.equal(absent.result, -1);
assert.equal(absent.counters.comparisons, 4);

for (const array of [[1, 2, 3, 4], [4, 3, 2, 1]]) {
  const sorted = executeAlgorithm('bubble-sort', { array });
  assert.deepEqual(sorted.result, [1, 2, 3, 4]);
  assert.equal(sorted.counters.comparisons, 6);
}

for (const execution of [descendingMax, ascendingMax, found, absent]) {
  assert.ok(execution.trace.length > 0);
  execution.trace.forEach((step, index) => {
    assert.equal(step.step, index + 1);
    assert.ok(Number.isInteger(step.line));
    assert.ok(step.message.es && step.message.en);
    for (const key of COUNTER_KEYS) assert.ok(Number.isInteger(step.counters[key]));
  });
}

assert.throws(() => getAlgorithm('student-code'), /Unknown predefined algorithm/);
const countOnly = executeAlgorithm('bubble-sort', { array: [5, 4, 3, 2, 1] }, { collectTrace: false });
assert.equal(countOnly.trace.length, 0);
assert.equal(countOnly.counters.comparisons, 10);
const bubbleExperiment = runOperationExperiment('bubble-sort', [10, 20, 50, 100], n => ({ array: Array.from({ length: n }, (_, index) => n - index) }));
assert.deepEqual(bubbleExperiment, [
  { n: 10, operations: 45 },
  { n: 20, operations: 190 },
  { n: 50, operations: 1225 },
  { n: 100, operations: 4950 }
]);
const binaryFound = executeAlgorithm('binary-search', { array: [1, 3, 5, 7, 9, 11, 13], target: 11 });
assert.equal(binaryFound.result, 5);
const binaryAbsent = executeAlgorithm('binary-search', { array: Array.from({ length: 1000 }, (_, index) => index), target: 1001 });
assert.equal(binaryAbsent.result, -1);
assert.equal(binaryAbsent.counters.loopIterations, 10);
const virtualBillion = executeAlgorithm('binary-search', { size: 1000000000, target: 2000000001 }, { collectTrace: false });
assert.equal(virtualBillion.counters.loopIterations, 30);
assert.deepEqual([10, 100, 1000, 1000000].map(n => executeAlgorithm('binary-search', { size: n, target: n * 2 + 1 }, { collectTrace: false }).counters.loopIterations), [4, 7, 10, 20]);
assert.throws(() => executeAlgorithm('binary-search', { array: [3, 1, 2], target: 1 }), /sorted array/);
console.log('algorithm-engine: all tests passed');
