import assert from 'node:assert/strict';
import { detectiveCases } from '../js/detective-cases.js';

const expected={log:3,linear:3,nlogn:3,quadratic:3,cubic:2,exponential:2};
assert.equal(detectiveCases.length,16);
assert.equal(new Set(detectiveCases.map(item=>item.id)).size,16);
for(const [complexity,count] of Object.entries(expected)) assert.equal(detectiveCases.filter(item=>item.complexity===complexity).length,count,complexity);
for(const item of detectiveCases){
  assert.equal(item.values.length,4,item.id);
  assert.ok(item.explanation,item.id);
  item.values.forEach((value,index)=>{assert.ok(Number.isFinite(value.n)&&value.n>0,item.id);assert.ok(Number.isFinite(value.operations)&&value.operations>0,item.id);if(index){assert.ok(value.n>item.values[index-1].n,item.id);assert.ok(value.operations>item.values[index-1].operations,item.id);}});
}
console.log('detective-cases: all tests passed');
