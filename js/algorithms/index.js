import { registerAlgorithm } from '../core/algorithm-registry.js';
import { findMaxAlgorithm } from './find-max.js';
import { linearSearchAlgorithm } from './linear-search.js';
import { bubbleSortAlgorithm } from './bubble-sort.js';
import { binarySearchAlgorithm } from './binary-search.js';
import { intervalSchedulingAlgorithm } from './interval-scheduling.js';
import { intervalPartitioningAlgorithm } from './interval-partitioning.js';
import { dijkstraAlgorithm } from './dijkstra.js';
import { primAlgorithm } from './prim.js';
import { kruskalAlgorithm } from './kruskal.js';
import { mergeSortAlgorithm } from './merge-sort.js';
import { inversionCountAlgorithm } from './inversion-count.js';
import { closestPairAlgorithm } from './closest-pair.js';

for (const algorithm of [findMaxAlgorithm, linearSearchAlgorithm, bubbleSortAlgorithm, binarySearchAlgorithm, intervalSchedulingAlgorithm, intervalPartitioningAlgorithm, dijkstraAlgorithm, primAlgorithm, kruskalAlgorithm, mergeSortAlgorithm, inversionCountAlgorithm, closestPairAlgorithm]) {
  registerAlgorithm(algorithm);
}

export { getAlgorithm, listAlgorithms } from '../core/algorithm-registry.js';
