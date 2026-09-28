import assert from 'node:assert/strict';
import '../js/algorithms/index.js';
import {executeAlgorithm} from '../js/core/algorithm-engine.js';
import {shortestPathInstances,negativeEdgeChallenge} from '../js/data/graph-instances.js';
for(const instance of shortestPathInstances){const execution=executeAlgorithm('dijkstra',instance);assert.deepEqual(execution.result.distances,instance.expected);const extracted=execution.trace.filter(step=>step.type==='extractMin');assert.equal(new Set(extracted.map(step=>step.variables.u)).size,instance.vertices.length);for(const step of execution.trace.filter(item=>item.type==='relaxEdge'))assert.equal(step.variables.candidateDistance,step.variables.distanceU+step.variables.edgeWeight);for(const vertex of instance.vertices){const fixedAt=extracted.findIndex(step=>step.variables.u===vertex.id);if(fixedAt<0)continue;const fixedDistance=extracted[fixedAt].structures.distances[vertex.id];assert.ok(execution.trace.slice(execution.trace.indexOf(extracted[fixedAt])).every(step=>step.structures.distances[vertex.id]===fixedDistance));}assert.ok(execution.trace.every(step=>Object.isFrozen(step)&&Object.isFrozen(step.structures)));}
const tied=executeAlgorithm('dijkstra',shortestPathInstances[1]);const tieCheckpoint=tied.trace.find(step=>step.variables.tiedVertices?.length===2);assert.deepEqual(tieCheckpoint.variables.tiedVertices,['B','C']);assert.equal(tied.result.distances.Z,Infinity);
assert.throws(()=>executeAlgorithm('dijkstra',negativeEdgeChallenge),/nonnegative/);
console.log('dijkstra: all tests passed');
