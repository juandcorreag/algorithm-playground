import assert from 'node:assert/strict';
import '../js/algorithms/index.js';
import { analyzeFindMaxCases, analyzeLinearSearchCases } from '../js/core/case-analysis.js';

const linear = analyzeLinearSearchCases(10, 200);
assert.equal(linear.cases[0].counters.comparisons, 1);
assert.equal(linear.cases[1].theoretical, 5.5);
assert.equal(linear.cases[2].counters.comparisons, 10);
assert.ok(linear.cases[1].counters.comparisons >= 1 && linear.cases[1].counters.comparisons <= 10);

const maximum = analyzeFindMaxCases(10, 200);
assert.deepEqual(maximum.cases.map(item => item.counters.comparisons), [9, 9, 9]);
assert.equal(maximum.cases[0].counters.assignments, 1);
assert.equal(maximum.cases[2].counters.assignments, 10);
assert.ok(maximum.cases[1].counters.assignments > 1 && maximum.cases[1].counters.assignments < 10);
assert.throws(() => analyzeLinearSearchCases(1), RangeError);
console.log('case-analysis: all tests passed');
