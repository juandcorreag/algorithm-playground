import { registerAlgorithm } from '../core/algorithm-registry.js';
import { findMaxAlgorithm } from './find-max.js';
import { linearSearchAlgorithm } from './linear-search.js';
import { bubbleSortAlgorithm } from './bubble-sort.js';
import { binarySearchAlgorithm } from './binary-search.js';

for (const algorithm of [findMaxAlgorithm, linearSearchAlgorithm, bubbleSortAlgorithm, binarySearchAlgorithm]) {
  registerAlgorithm(algorithm);
}

export { getAlgorithm, listAlgorithms } from '../core/algorithm-registry.js';
