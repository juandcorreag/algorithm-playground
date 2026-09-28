export const intervalSchedulingAlgorithm = {
  id:'interval-scheduling', name:{es:'Selección de intervalos',en:'Interval Scheduling'}, category:'greedy', inputType:'intervals', parameters:['intervals'],
  supportedOperations:['comparisons','assignments','arrayAccesses','loopIterations'],
  pseudocode:[{id:1,text:'order intervals by nondecreasing finish time'},{id:2,text:'S ← ∅; lastFinish ← −∞'},{id:3,text:'for each interval j in order'},{id:4,text:'    if start[j] ≥ lastFinish'},{id:5,text:'        add j to S; lastFinish ← finish[j]'},{id:6,text:'    else reject j'}],
  generateInput({intervals=[]}={}){return {intervals:normalize(intervals)};},
  execute(input,_options,recorder){
    const ordered=normalize(input.intervals).sort((a,b)=>a.finish-b.finish||a.start-b.start||a.id.localeCompare(b.id));
    const selected=[],rejected=[];let lastFinish=null;
    recorder.record({line:2,type:'assignment',increment:{assignments:2},variables:{lastFinish},structures:{ordered,selected:[],rejected:[]},message:{en:'The candidate list is ordered by finish time.',es:'Los candidatos están ordenados por tiempo de finalización.'}});
    for(let index=0;index<ordered.length;index++){
      const current=ordered[index],compatible=lastFinish===null||current.start>=lastFinish;
      recorder.record({line:4,type:'considerCandidate',checkpointId:`schedule-decision-${current.id}`,increment:{comparisons:1,arrayAccesses:1,loopIterations:1},variables:{index,currentId:current.id,start:current.start,finish:current.finish,lastFinish,compatible},structures:{ordered,selected:[...selected],rejected:[...rejected]},visualization:{currentInterval:current.id,state:compatible?'COMPATIBLE':'INCOMPATIBLE'},message:{en:`Consider ${current.id}: ${current.start} ≥ ${lastFinish??'−∞'} is ${compatible}.`,es:`Se considera ${current.id}: ${current.start} ≥ ${lastFinish??'−∞'} es ${compatible}.`}});
      if(compatible){selected.push(current);lastFinish=current.finish;recorder.record({line:5,type:'selectGreedy',increment:{assignments:2,arrayAccesses:1},variables:{currentId:current.id,lastFinish},structures:{ordered,selected:[...selected],rejected:[...rejected]},visualization:{currentInterval:current.id,state:'SELECTED'},message:{en:`Select ${current.id} and update lastFinish.`,es:`Se selecciona ${current.id} y se actualiza lastFinish.`}});}
      else{rejected.push(current);recorder.record({line:6,type:'rejectIncompatible',variables:{currentId:current.id,lastFinish},structures:{ordered,selected:[...selected],rejected:[...rejected]},visualization:{currentInterval:current.id,state:'REJECTED'},message:{en:`Reject ${current.id} because it overlaps the last selection.`,es:`Se rechaza ${current.id} porque se solapa con la última selección.`}});}
    }
    return {selected:selected.map(item=>item.id),rejected:rejected.map(item=>item.id),cardinality:selected.length,lastFinish};
  }
};

function normalize(intervals){if(!Array.isArray(intervals)||!intervals.length)throw new RangeError('At least one interval is required.');const ids=new Set();return intervals.map((item,index)=>{const id=String(item.id??`I${index+1}`),start=Number(item.start),finish=Number(item.finish);if(ids.has(id)||!Number.isFinite(start)||!Number.isFinite(finish)||start>=finish)throw new RangeError('Intervals require unique ids and finite start < finish.');ids.add(id);return {id,start,finish};});}
