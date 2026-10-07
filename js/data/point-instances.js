export const pointInstances=Object.freeze([
  {id:'cross-strip',name:'Cross-strip winner',concepts:['strip','crossing-pair'],allowsMultipleSolutions:false,points:[{id:'A',x:8,y:18},{id:'B',x:22,y:72},{id:'C',x:43,y:45},{id:'D',x:48,y:47},{id:'E',x:72,y:20},{id:'F',x:88,y:78}]},
  {id:'left-winner',name:'Left-half winner',concepts:['left-result'],allowsMultipleSolutions:false,points:[{id:'A',x:10,y:12},{id:'B',x:14,y:15},{id:'C',x:30,y:70},{id:'D',x:62,y:18},{id:'E',x:78,y:58},{id:'F',x:91,y:84}]},
  {id:'right-winner',name:'Right-half winner',concepts:['right-result'],allowsMultipleSolutions:false,points:[{id:'A',x:7,y:15},{id:'B',x:24,y:76},{id:'C',x:38,y:38},{id:'D',x:70,y:70},{id:'E',x:74,y:73},{id:'F',x:92,y:18}]},
  {id:'ties',name:'Tied closest pairs',concepts:['ties','multiple-solutions'],allowsMultipleSolutions:true,points:[{id:'A',x:15,y:20},{id:'B',x:25,y:20},{id:'C',x:65,y:70},{id:'D',x:75,y:70},{id:'E',x:45,y:45}]},
  {id:'equal-x',name:'Equal x coordinates',concepts:['stable-partition','strip-boundary'],allowsMultipleSolutions:false,points:[{id:'A',x:30,y:10},{id:'B',x:30,y:35},{id:'C',x:30,y:80},{id:'D',x:55,y:42},{id:'E',x:80,y:15},{id:'F',x:84,y:19}]}
]);
export function clonePointInstance(id='cross-strip'){return structuredClone(pointInstances.find(item=>item.id===id)??pointInstances[0]);}
