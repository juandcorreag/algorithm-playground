function randomArray(size) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * 90) + 10);
}

export const linearSearchAlgorithm = {
  id: 'linear-search',
  name: { es: 'Búsqueda lineal', en: 'Linear Search' },
  category: 'search',
  inputType: 'array-target',
  parameters: ['array', 'target'],
  supportedOperations: ['comparisons', 'assignments', 'arithmeticOperations', 'arrayAccesses', 'loopIterations'],
  cases: ['best', 'middle', 'worst-present', 'not-found', 'random', 'custom'],
  pseudocode: [
    { id: 1, text: 'i ← 0' },
    { id: 2, text: 'while i < n' },
    { id: 3, text: '    if a[i] = target' },
    { id: 4, text: '        return i' },
    { id: 5, text: '    i ← i + 1' },
    { id: 6, text: 'return NOT_FOUND' }
  ],
  prediction: {
    question: 'How many element comparisons do you predict for this input?',
    choices: input => [...new Set([1, Math.ceil(input.array.length / 2), input.array.length, Math.max(1, input.array.length - 1)])].sort((a, b) => a - b)
  },
  generateInput({ size = 8, preset = 'random', array, target } = {}) {
    const values = preset === 'custom' ? [...array] : randomArray(size);
    let selectedTarget = Number(target);
    if (preset === 'best') selectedTarget = values[0];
    if (preset === 'middle') selectedTarget = values[Math.floor((values.length - 1) / 2)];
    if (preset === 'worst-present') selectedTarget = values.at(-1);
    if (preset === 'not-found') selectedTarget = Math.max(...values) + 1;
    if (preset === 'random' && !Number.isFinite(selectedTarget)) selectedTarget = values[Math.floor(Math.random() * values.length)];
    return { array: values, target: selectedTarget };
  },
  execute(input, _options, recorder) {
    const { array, target } = input;
    if (!Array.isArray(array) || array.length === 0 || !Number.isFinite(target)) throw new RangeError('Linear Search requires a non-empty array and a numeric target.');
    let i = 0;
    recorder.record({ line: 1, type: 'assignment', increment: { assignments: 1 }, variables: { n: array.length, i, target }, visualization: { array, activeIndices: [0], labels: { 0: 'i' } }, message: { es: 'La búsqueda comienza en la primera posición.', en: 'The search starts at the first position.' } });
    while (i < array.length) {
      const found = array[i] === target;
      recorder.record({ line: 3, type: 'comparison', increment: { comparisons: 1, arrayAccesses: 1, loopIterations: 1 }, variables: { n: array.length, i, target, 'a[i]': array[i] }, visualization: { array, activeIndices: [i], comparedIndices: [i], labels: { [i]: 'i' } }, message: { es: `Se compara a[${i}] con target.`, en: `Compare a[${i}] with the target.` } });
      if (found) {
        recorder.record({ line: 4, type: 'return', variables: { n: array.length, i, target, 'a[i]': array[i] }, visualization: { array, foundIndices: [i], labels: { [i]: 'found' } }, message: { es: `El elemento fue encontrado en la posición ${i}.`, en: `The target was found at position ${i}.` } });
        return i;
      }
      i += 1;
      recorder.record({ line: 5, type: 'arithmetic', increment: { assignments: 1, arithmeticOperations: 1 }, variables: { n: array.length, i, target }, visualization: { array, activeIndices: i < array.length ? [i] : [], labels: i < array.length ? { [i]: 'i' } : {} }, message: { es: 'Se avanza a la siguiente posición.', en: 'Move to the next position.' } });
    }
    recorder.record({ line: 6, type: 'return', variables: { n: array.length, i, target }, visualization: { array }, message: { es: 'El elemento no está en el arreglo.', en: 'The target is not in the array.' } });
    return -1;
  }
};
