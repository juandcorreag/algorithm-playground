export function bruteForceInversions(values){const pairs=[];let checks=0;for(let i=0;i<values.length;i++)for(let j=i+1;j<values.length;j++){checks++;if(values[i]>values[j])pairs.push({i,j,left:values[i],right:values[j]});}return {count:pairs.length,pairs,checks};}
export function classifyPair(values,splitIndex,i,j){if(i>=j||i<0||j>=values.length)return 'not';if(values[i]<=values[j])return 'not';if(j<splitIndex)return 'left';if(i>=splitIndex)return 'right';return 'crossing';}
export function permutationFromOrder(order){return order.map(Number);}
