import { executeAlgorithm } from './algorithm-engine.js';

function ascending(n) { return Array.from({ length: n }, (_, index) => index + 1); }
function descending(n) { return ascending(n).reverse(); }
function shuffled(n) {
  const array = ascending(n);
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
function mean(values) { return values.reduce((sum, value) => sum + value, 0) / values.length; }

export function analyzeLinearSearchCases(n, trials = 500) {
  validate(n, trials);
  const array = ascending(n);
  const best = executeAlgorithm('linear-search', { array, target: array[0] }, { collectTrace: false });
  const worst = executeAlgorithm('linear-search', { array, target: array.at(-1) }, { collectTrace: false });
  const samples = Array.from({ length: trials }, () => {
    const position = Math.floor(Math.random() * n);
    return executeAlgorithm('linear-search', { array, target: array[position] }, { collectTrace: false }).counters;
  });
  return {
    algorithmId: 'linear-search', n, trials,
    cases: [
      row('best', best.counters, 1, 'Target is at the first position.'),
      row('average', averageCounters(samples), (n + 1) / 2, 'Target exists and every position is equally likely.'),
      row('worst', worst.counters, n, 'Target is at the last position.')
    ]
  };
}

export function analyzeFindMaxCases(n, trials = 500) {
  validate(n, trials);
  const best = executeAlgorithm('find-max', { array: descending(n) }, { collectTrace: false });
  const worst = executeAlgorithm('find-max', { array: ascending(n) }, { collectTrace: false });
  const samples = Array.from({ length: trials }, () => executeAlgorithm('find-max', { array: shuffled(n) }, { collectTrace: false }).counters);
  return {
    algorithmId: 'find-max', n, trials,
    cases: [
      row('best', best.counters, 1, 'Maximum is first; no later value replaces it.'),
      row('average', averageCounters(samples), harmonic(n), 'Random permutation of distinct values.'),
      row('worst', worst.counters, n, 'Ascending values replace maximum at every position.')
    ]
  };
}

function row(id, counters, theoretical, description) { return { id, counters, theoretical, description }; }
function averageCounters(samples) {
  const keys = Object.keys(samples[0]);
  return Object.fromEntries(keys.map(key => [key, mean(samples.map(sample => sample[key]))]));
}
function harmonic(n) { let sum = 0; for (let i = 1; i <= n; i++) sum += 1 / i; return sum; }
function validate(n, trials) {
  if (!Number.isInteger(n) || n < 2 || n > 1000) throw new RangeError('n must be an integer from 2 to 1000.');
  if (!Number.isInteger(trials) || trials < 1 || trials > 10000) throw new RangeError('trials must be an integer from 1 to 10,000.');
}
