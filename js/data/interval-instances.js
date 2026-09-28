export const intervalInstances=Object.freeze([
  {id:'lecture-day',name:'Lecture day',optimalCardinality:4,maximumDepth:2,intervals:[{id:'A',start:0,finish:3},{id:'B',start:1,finish:2},{id:'C',start:2,finish:5},{id:'D',start:3,finish:4},{id:'E',start:4,finish:7},{id:'F',start:5,finish:6},{id:'G',start:6,finish:8}]},
  {id:'tied-finishes',name:'Tied finishes',optimalCardinality:3,maximumDepth:2,intervals:[{id:'A',start:0,finish:2},{id:'B',start:1,finish:3},{id:'C',start:2,finish:4},{id:'D',start:3,finish:4},{id:'E',start:4,finish:6}]},
  {id:'duration-trap',name:'Duration trap',optimalCardinality:3,maximumDepth:2,intervals:[{id:'A',start:0,finish:4},{id:'B',start:3,finish:5},{id:'C',start:4,finish:7},{id:'D',start:5,finish:9},{id:'E',start:8,finish:10},{id:'F',start:9,finish:11}]}
]);
export function cloneInstance(id='lecture-day'){const source=intervalInstances.find(item=>item.id===id)??intervalInstances[0];return {...source,intervals:source.intervals.map(item=>({...item}))};}
