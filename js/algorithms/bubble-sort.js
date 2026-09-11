function initialArray(size, preset) {
  const ascending = Array.from({ length: size }, (_, index) => index + 1);
  if (preset === 'sorted') return ascending;
  if (preset === 'reverse') return ascending.reverse();
  return ascending.map(value => ({ value, key: Math.random() })).sort((a, b) => a.key - b.key).map(item => item.value);
}

export const bubbleSortAlgorithm = {
  id: 'bubble-sort',
  name: { es: 'Ordenamiento burbuja', en: 'Bubble Sort' },
  category: 'sorting',
  inputType: 'array',
  parameters: ['array'],
  supportedOperations: ['comparisons', 'assignments', 'arithmeticOperations', 'arrayAccesses', 'loopIterations'],
  cases: ['sorted', 'reverse', 'random', 'custom'],
  pseudocode: [
    { id: 1, text: 'for i ← 0 to n − 2' },
    { id: 2, text: '    for j ← 0 to n − i − 2' },
    { id: 3, text: '        if a[j] > a[j + 1]' },
    { id: 4, text: '            swap a[j] and a[j + 1]' },
    { id: 5, text: 'return a' }
  ],
  prediction: {
    question: 'Which growth model do you predict for the number of comparisons?',
    choices: () => ['log n', 'n', 'n log n', 'n²', 'n³']
  },
  generateInput({ size = 8, preset = 'random', array } = {}) {
    return { array: preset === 'custom' ? [...array] : initialArray(size, preset) };
  },
  execute(input, _options, recorder) {
    const array = input.array;
    if (!Array.isArray(array) || array.length === 0) throw new RangeError('Bubble Sort requires a non-empty array.');
    for (let i = 0; i < array.length - 1; i++) {
      recorder.record({ line: 1, type: 'loop', increment: { loopIterations: 1 }, variables: { n: array.length, i }, visualization: { array, sortedFrom: array.length - i }, message: { es: `Comienza la iteración exterior ${i + 1}.`, en: `Start outer iteration ${i + 1}.` } });
      for (let j = 0; j < array.length - i - 1; j++) {
        const shouldSwap = array[j] > array[j + 1];
        recorder.record({ line: 3, type: 'comparison', increment: { comparisons: 1, arrayAccesses: 2, loopIterations: 1, arithmeticOperations: 1 }, variables: { n: array.length, i, j, 'a[j]': array[j], 'a[j+1]': array[j + 1] }, visualization: { array, activeIndices: [j, j + 1], comparedIndices: [j, j + 1], sortedFrom: array.length - i }, message: { es: `Se comparan las posiciones ${j} y ${j + 1}.`, en: `Compare positions ${j} and ${j + 1}.` } });
        if (shouldSwap) {
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
          recorder.record({ line: 4, type: 'swap', increment: { assignments: 3, arrayAccesses: 4 }, variables: { n: array.length, i, j, 'a[j]': array[j], 'a[j+1]': array[j + 1] }, visualization: { array, activeIndices: [j, j + 1], swappedIndices: [j, j + 1], sortedFrom: array.length - i }, message: { es: `Se intercambian las posiciones ${j} y ${j + 1}.`, en: `Swap positions ${j} and ${j + 1}.` } });
        }
      }
    }
    recorder.record({ line: 5, type: 'return', variables: { n: array.length }, visualization: { array, sortedFrom: 0 }, message: { es: 'El arreglo está ordenado.', en: 'The array is sorted.' } });
    return array;
  }
};
