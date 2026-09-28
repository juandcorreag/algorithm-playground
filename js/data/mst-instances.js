export const mstInstances=Object.freeze([
  {
    id:'unique-mst',name:'Unique MST',concepts:['cut-property','unique-mst'],difficulty:'introductory',allowsMultipleSolutions:false,directed:false,root:'A',expectedWeight:12,
    vertices:[{id:'A',x:10,y:50},{id:'B',x:35,y:15},{id:'C',x:35,y:82},{id:'D',x:68,y:18},{id:'E',x:70,y:78},{id:'F',x:92,y:48}],
    edges:[{id:'AB',from:'A',to:'B',weight:2},{id:'AC',from:'A',to:'C',weight:4},{id:'BC',from:'B',to:'C',weight:3},{id:'BD',from:'B',to:'D',weight:5},{id:'CD',from:'C',to:'D',weight:8},{id:'CE',from:'C',to:'E',weight:2},{id:'DE',from:'D',to:'E',weight:6},{id:'DF',from:'D',to:'F',weight:4},{id:'EF',from:'E',to:'F',weight:1}]
  },
  {
    id:'multiple-msts',name:'Ties and multiple MSTs',concepts:['ties','multiple-msts','cycle-property'],difficulty:'intermediate',allowsMultipleSolutions:true,directed:false,root:'A',expectedWeight:3,
    vertices:[{id:'A',x:15,y:20},{id:'B',x:70,y:20},{id:'C',x:70,y:80},{id:'D',x:15,y:80}],
    edges:[{id:'AB',from:'A',to:'B',weight:1},{id:'BC',from:'B',to:'C',weight:1},{id:'CD',from:'C',to:'D',weight:1},{id:'DA',from:'D',to:'A',weight:1},{id:'AC',from:'A',to:'C',weight:2},{id:'BD',from:'B',to:'D',weight:2}]
  }
]);
export function cloneMstGraph(id='unique-mst'){return structuredClone(mstInstances.find(item=>item.id===id)??mstInstances[0]);}
