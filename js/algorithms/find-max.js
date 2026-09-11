function makeArray(size, preset) {
  const ascending = Array.from({ length: size }, (_, index) => index + 1);
  if (preset === 'ascending') return ascending;
  if (preset === 'descending') return ascending.reverse();
  return ascending.map(value => ({ value, key: Math.random() })).sort((a, b) => a.key - b.key).map(item => item.value);
}

export const findMaxAlgorithm = {
  id: 'find-max',
  name: { es: 'Encontrar el máximo', en: 'Find Maximum' },
  category: 'scan',
  inputType: 'array',
  parameters: ['array'],
  supportedOperations: ['comparisons', 'assignments', 'arithmeticOperations', 'arrayAccesses', 'loopIterations'],
  cases: ['random', 'ascending', 'descending', 'custom'],
  pseudocode: [
    { id: 1, text: 'maximum ← a[0]' },
    { id: 2, text: 'for i ← 1 to n − 1' },
    { id: 3, text: '    if a[i] > maximum' },
    { id: 4, text: '        maximum ← a[i]' },
    { id: 5, text: 'return maximum' }
  ],
  prediction: {
    question: 'For this input of size n, how many comparisons do you predict?',
    choices: input => [Math.max(0, input.array.length - 2), input.array.length - 1, input.array.length, input.array.length + 1]
  },
  generateInput({ size = 8, preset = 'random', array } = {}) {
    if (preset === 'custom') return { array: [...array] };
    return { array: makeArray(size, preset) };
  },
  execute(input, _options, recorder) {
    const array = input.array;
    if (!Array.isArray(array) || array.length === 0) throw new RangeError('Find Maximum requires a non-empty array.');
    let maximum = array[0];
    recorder.record({ line: 1, type: 'assignment', increment: { assignments: 1, arrayAccesses: 1 }, variables: { n: array.length, maximum }, visualization: { array, activeIndices: [0], labels: { 0: 'maximum' } }, message: { es: 'Se inicializa maximum con el primer elemento.', en: 'Initialize maximum with the first element.' } });
    for (let i = 1; i < array.length; i++) {
      const isLarger = array[i] > maximum;
      recorder.record({ line: 3, type: 'comparison', increment: { comparisons: 1, arrayAccesses: 1, loopIterations: 1, arithmeticOperations: 1 }, variables: { n: array.length, i, maximum, 'a[i]': array[i] }, visualization: { array, activeIndices: [i], comparedIndices: [i], labels: { [i]: 'i' } }, message: { es: `Se compara a[${i}] con maximum.`, en: `Compare a[${i}] with maximum.` } });
      if (isLarger) {
        maximum = array[i];
        recorder.record({ line: 4, type: 'assignment', increment: { assignments: 1, arrayAccesses: 1 }, variables: { n: array.length, i, maximum, 'a[i]': array[i] }, visualization: { array, activeIndices: [i], labels: { [i]: 'maximum' } }, message: { es: 'Se encontró un máximo mayor.', en: 'A larger maximum was found.' } });
      }
    }
    recorder.record({ line: 5, type: 'return', variables: { n: array.length, maximum }, visualization: { array, foundIndices: [array.indexOf(maximum)], labels: { [array.indexOf(maximum)]: 'maximum' } }, message: { es: `El máximo es ${maximum}.`, en: `The maximum is ${maximum}.` } });
    return maximum;
  }
};
