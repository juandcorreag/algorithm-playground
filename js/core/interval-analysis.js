export const schedulingRules=Object.freeze({
  earliestStart:{label:'EARLIEST START',order:(a,b)=>a.start-b.start||a.finish-b.finish},
  earliestFinish:{label:'EARLIEST FINISH',order:(a,b)=>a.finish-b.finish||a.start-b.start},
  shortestDuration:{label:'SHORTEST DURATION',order:(a,b)=>(a.finish-a.start)-(b.finish-b.start)||a.finish-b.finish},
  fewestConflicts:{label:'FEWEST CONFLICTS',order:(a,b,all)=>conflicts(a,all)-conflicts(b,all)||a.finish-b.finish}
});
export function runSchedulingRule(intervals,ruleId){const rule=schedulingRules[ruleId];if(!rule)throw new RangeError(`Unknown scheduling rule: ${ruleId}`);const ordered=intervals.map(item=>({...item})).sort((a,b)=>rule.order(a,b,intervals)),selected=[],rejected=[];for(const item of ordered)(isCompatible([...selected,item])?selected:rejected).push(item);return {ruleId,ordered,selected,rejected,cardinality:selected.length};}
export function isCompatible(intervals){return intervals.every((item,index)=>intervals.slice(index+1).every(other=>item.finish<=other.start||other.finish<=item.start));}
export function depthAt(intervals,time){return intervals.filter(item=>item.start<=time&&time<item.finish).length;}
export function maximumDepth(intervals){const points=[...new Set(intervals.flatMap(item=>[item.start,item.finish]))];return Math.max(...points.map(time=>depthAt(intervals,time)),0);}
function conflicts(interval,all){return all.filter(other=>other.id!==interval.id&&interval.start<other.finish&&other.start<interval.finish).length;}
