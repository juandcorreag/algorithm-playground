import assert from 'node:assert/strict';
import '../js/algorithms/index.js';
import {executeAlgorithm} from '../js/core/algorithm-engine.js';
import {isCompatible,maximumDepth,runSchedulingRule} from '../js/core/interval-analysis.js';
import {intervalInstances} from '../js/data/interval-instances.js';
for(const instance of intervalInstances){
  const scheduling=executeAlgorithm('interval-scheduling',{intervals:instance.intervals});
  const chosen=instance.intervals.filter(item=>scheduling.result.selected.includes(item.id));
  assert.equal(isCompatible(chosen),true,`${instance.id} selection must be compatible`);
  assert.equal(scheduling.result.cardinality,instance.optimalCardinality,`${instance.id} known optimum`);
  const considered=scheduling.trace.filter(step=>step.type==='considerCandidate');
  assert.deepEqual(considered.map(step=>step.variables.finish),[...considered.map(step=>step.variables.finish)].sort((a,b)=>a-b));
  assert.ok(considered.every(step=>step.checkpointId));
  const partition=executeAlgorithm('interval-partitioning',{intervals:instance.intervals});
  assert.equal(Object.keys(partition.result.assignments).length,instance.intervals.length);
  assert.equal(partition.result.rooms,maximumDepth(instance.intervals));
  assert.equal(partition.result.maximumDepth,instance.maximumDepth);
  for(const roomId of new Set(Object.values(partition.result.assignments))){const roomIntervals=instance.intervals.filter(item=>partition.result.assignments[item.id]===roomId);assert.equal(isCompatible(roomIntervals),true);}
  for(const step of partition.trace.filter(item=>item.type==='decreaseKey'))assert.equal(step.variables.newKey,instance.intervals.find(item=>item.id===step.variables.currentId).finish);
}
assert.equal(runSchedulingRule(intervalInstances[0].intervals,'earliestFinish').cardinality,intervalInstances[0].optimalCardinality);
assert.equal(isCompatible([{id:'long',start:0,finish:10},{id:'late',start:3,finish:4}]),false);
console.log('scheduling-algorithms: all tests passed');
