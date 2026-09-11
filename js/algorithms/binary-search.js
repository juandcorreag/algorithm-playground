export const binarySearchAlgorithm = {
  id: 'binary-search', name: { es: 'Búsqueda binaria', en: 'Binary Search' }, category: 'search', inputType: 'sorted-array-target', parameters: ['array', 'target'],
  supportedOperations: ['comparisons', 'assignments', 'arithmeticOperations', 'arrayAccesses', 'loopIterations'], cases: ['middle', 'first', 'last', 'not-found', 'custom'],
  pseudocode: [
    { id: 1, text: 'low ← 0; high ← n − 1' }, { id: 2, text: 'while low ≤ high' }, { id: 3, text: '    mid ← ⌊(low + high) / 2⌋' },
    { id: 4, text: '    if a[mid] = target: return mid' }, { id: 5, text: '    if a[mid] < target: low ← mid + 1' },
    { id: 6, text: '    else: high ← mid − 1' }, { id: 7, text: 'return NOT_FOUND' }
  ],
  prediction: { question: 'Approximately how many iterations can Binary Search require for 1,000,000 elements?', choices: () => [20, 100, 1000, 500000, 1000000] },
  generateInput({ size = 16, preset = 'middle', target } = {}) {
    if (!Number.isInteger(size) || size < 1) throw new RangeError('Binary Search requires a positive integer size.');
    const array = Array.from({ length: size }, (_, index) => index * 2 + 1); let selected = Number(target);
    if (preset === 'middle') selected = array[Math.floor((size - 1) / 2)]; if (preset === 'first') selected = array[0]; if (preset === 'last') selected = array.at(-1);
    if (preset === 'not-found') selected = array.at(-1) + 2; if (!Number.isFinite(selected)) selected = array[Math.floor((size - 1) / 2)];
    return { array, target: selected };
  },
  execute(input, _options, recorder) {
    const { array, target } = input, virtual = !Array.isArray(array) && Number.isInteger(input.size) && input.size > 0;
    if ((!virtual && (!Array.isArray(array) || array.length === 0 || !array.every(Number.isFinite))) || !Number.isFinite(target)) throw new RangeError('Binary Search requires a non-empty numeric array and target.');
    if (!virtual) for (let i = 1; i < array.length; i++) if (array[i] < array[i - 1]) throw new RangeError('Binary Search requires a sorted array.');
    const n = virtual ? input.size : array.length, valueAt = index => virtual ? index * 2 + 1 : array[index], visual = (low, high) => virtual ? {} : view(array, low, high);
    let low = 0, high = n - 1;
    recorder.record({ line: 1, type: 'assignment', increment: { assignments: 2, arithmeticOperations: 1 }, variables: { n, low, high, target, remaining: n }, visualization: visual(low, high), message: { es: 'El intervalo inicial contiene todo el arreglo.', en: 'The initial interval contains the whole array.' } });
    while (low <= high) {
      const beforeLow = low, beforeHigh = high, mid = Math.floor((low + high) / 2), value = valueAt(mid);
      if (value === target) {
        recorder.record({ line: 4, type: 'comparison', increment: { comparisons: 1, assignments: 1, arithmeticOperations: 2, arrayAccesses: 1, loopIterations: 1 }, variables: { n, low, high, mid, target, 'a[mid]': value, remaining: high - low + 1 }, visualization: { ...visual(low, high), activeIndices: [mid], foundIndices: [mid], labels: { [mid]: 'mid · found' } }, message: { es: `Se encuentra el objetivo en mid = ${mid}.`, en: `The target is found at mid = ${mid}.` } }); return mid;
      }
      const goRight = value < target; if (goRight) low = mid + 1; else high = mid - 1;
      recorder.record({ line: goRight ? 5 : 6, type: 'comparison', increment: { comparisons: 2, assignments: 2, arithmeticOperations: 3, arrayAccesses: 1, loopIterations: 1 }, variables: { n, low, high, mid, target, 'a[mid]': value, remaining: Math.max(0, high - low + 1) }, visualization: { ...visual(low, high), activeIndices: [mid], comparedIndices: [mid], labels: { [mid]: 'mid · discarded' } }, message: { es: `Se descarta el intervalo ${goRight ? `${beforeLow}…${mid}` : `${mid}…${beforeHigh}`}.`, en: `Discard indices ${goRight ? `${beforeLow}…${mid}` : `${mid}…${beforeHigh}`}.` } });
    }
    recorder.record({ line: 7, type: 'return', variables: { n, low, high, target, remaining: 0 }, visualization: virtual ? {} : { array, discardedIndices: array.map((_, index) => index) }, message: { es: 'El intervalo quedó vacío; el objetivo no está presente.', en: 'The interval is empty; the target is not present.' } }); return -1;
  }
};
function view(array, low, high) { return { array, discardedIndices: array.map((_, index) => index).filter(index => index < low || index > high) }; }
