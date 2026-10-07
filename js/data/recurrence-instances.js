export const recurrenceInstances=Object.freeze([
  {id:'merge-sort',title:'Merge Sort',display:'T(n) = 2T(n/2) + n',kind:'uniform',a:2,b:2,combineWork:{coefficient:1,exponent:1,logExponent:0,display:'n'},baseSize:1,baseCost:1},
  {id:'root-heavy',title:'Root-dominated',display:'T(n) = 2T(n/2) + n²',kind:'uniform',a:2,b:2,combineWork:{coefficient:1,exponent:2,logExponent:0,display:'n²'},baseSize:1,baseCost:1},
  {id:'leaf-heavy',title:'Leaf-dominated',display:'T(n) = 4T(n/2) + n',kind:'uniform',a:4,b:2,combineWork:{coefficient:1,exponent:1,logExponent:0,display:'n'},baseSize:1,baseCost:1},
  {id:'noninteger',title:'Noninteger threshold',display:'T(n) = 3T(n/2) + n',kind:'uniform',a:3,b:2,combineWork:{coefficient:1,exponent:1,logExponent:0,display:'n'},baseSize:1,baseCost:1},
  {id:'coefficient',title:'Irrelevant coefficient',display:'T(n) = 2T(n/2) + 17n',kind:'uniform',a:2,b:2,combineWork:{coefficient:17,exponent:1,logExponent:0,display:'17n'},baseSize:1,baseCost:1},
  {id:'log-work',title:'Logarithmic combine factor',display:'T(n) = 2T(n/2) + n log n',kind:'uniform',a:2,b:2,combineWork:{coefficient:1,exponent:1,logExponent:1,display:'n log n'},baseSize:1,baseCost:1},
  {id:'unequal',title:'Unequal subproblems',display:'T(n) = T(n/5) + T(7n/10) + n',kind:'nonuniform',subproblems:[{scale:.2,multiplicity:1},{scale:.7,multiplicity:1}],combineWork:{display:'n'}},
  {id:'nonconstant-a',title:'Nonconstant number of calls',display:'T(n) = nT(n/2) + n²',kind:'invalid',reason:'The number of subproblems is not constant.'},
  {id:'fractional-a',title:'Invalid recursive coefficient',display:'T(n) = ½T(n/2) + n²',kind:'invalid',reason:'The recursive coefficient is below one.'}
]);
export function recurrenceById(id){return structuredClone(recurrenceInstances.find(item=>item.id===id)??recurrenceInstances[0]);}
