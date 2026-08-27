const round=(value)=>Math.max(1,Math.round(value));
const values=(ns,model,factor,noise=[0,0,0,0])=>ns.map((n,index)=>({n,operations:round(factor*model(n)*(1+noise[index]))}));
const models={log:n=>Math.log2(n),linear:n=>n,nlogn:n=>n*Math.log2(n),quadratic:n=>n**2,cubic:n=>n**3,exponential:n=>2**n};

export const detectiveCases=[
  {id:'log-01',title:'Mystery Algorithm 1',complexity:'log',values:values([16,256,4096,65536],models.log,25,[0,.02,-.01,.01]),explanation:'The observations are consistent with logarithmic growth: multiplying n many times adds a roughly constant amount of work.'},
  {id:'log-02',title:'Mystery Algorithm 2',complexity:'log',values:values([10,100,1000,10000],models.log,80,[.01,-.02,.02,0]),explanation:'The operation count grows slowly and increases by a similar amount whenever n is multiplied by 10.'},
  {id:'log-03',title:'Mystery Algorithm 3',complexity:'log',values:values([32,1024,32768,1048576],models.log,12,[0,.01,0,-.01]),explanation:'Large multiplicative changes in n produce small, nearly additive changes in the observations.'},
  {id:'linear-01',title:'Mystery Algorithm 4',complexity:'linear',values:values([100,1000,10000,100000],models.linear,3,[.01,0,-.01,.01]),explanation:'When n is multiplied by 10, the number of operations is also multiplied by approximately 10.'},
  {id:'linear-02',title:'Mystery Algorithm 5',complexity:'linear',values:values([50,500,5000,50000],models.linear,7,[0,-.02,.01,0]),explanation:'The ratio operations/n stays approximately constant, which suggests linear growth.'},
  {id:'linear-03',title:'Mystery Algorithm 6',complexity:'linear',values:values([200,2000,20000,200000],models.linear,.75,[.02,0,-.01,.01]),explanation:'The observations scale in direct proportion to the input size.'},
  {id:'nlogn-01',title:'Mystery Algorithm 7',complexity:'nlogn',values:[{n:100,operations:664},{n:1000,operations:9966},{n:10000,operations:132877},{n:100000,operations:1660964}],explanation:'The observations are consistent with n log₂ n growth.'},
  {id:'nlogn-02',title:'Mystery Algorithm 8',complexity:'nlogn',values:values([64,640,6400,64000],models.nlogn,2,[0,.01,-.01,.015]),explanation:'The work grows a little more than 10× when n grows 10×, consistent with the additional logarithmic factor.'},
  {id:'nlogn-03',title:'Mystery Algorithm 9',complexity:'nlogn',values:values([128,1280,12800,128000],models.nlogn,.5,[.01,-.01,.01,0]),explanation:'Operations/n increases slowly rather than remaining constant, suggesting n log n rather than linear growth.'},
  {id:'quadratic-01',title:'Mystery Algorithm 10',complexity:'quadratic',values:values([10,100,1000,10000],models.quadratic,2,[0,.01,-.01,0]),explanation:'Multiplying n by 10 multiplies the observed work by approximately 100, consistent with quadratic growth.'},
  {id:'quadratic-02',title:'Mystery Algorithm 11',complexity:'quadratic',values:values([20,200,2000,20000],models.quadratic,.25,[.02,0,-.01,.01]),explanation:'The operation count is approximately proportional to n².'},
  {id:'quadratic-03',title:'Mystery Algorithm 12',complexity:'quadratic',values:values([50,500,5000,50000],models.quadratic,3,[0,-.01,.015,0]),explanation:'A tenfold input increase produces close to a hundredfold operation increase.'},
  {id:'cubic-01',title:'Mystery Algorithm 13',complexity:'cubic',values:values([10,20,40,80],models.cubic,1,[0,.01,-.01,.005]),explanation:'Doubling n multiplies the work by approximately 8, which is characteristic of cubic growth.'},
  {id:'cubic-02',title:'Mystery Algorithm 14',complexity:'cubic',values:values([25,50,100,200],models.cubic,.4,[.01,-.01,0,.01]),explanation:'The observations are approximately proportional to n³.'},
  {id:'exponential-01',title:'Mystery Algorithm 15',complexity:'exponential',values:values([5,8,11,14],models.exponential,10,[0,.01,-.01,0]),explanation:'Adding 3 to n multiplies the work by approximately 8, consistent with 2ⁿ growth.'},
  {id:'exponential-02',title:'Mystery Algorithm 16',complexity:'exponential',values:values([6,10,14,18],models.exponential,3,[.01,-.01,.01,0]),explanation:'Equal additive increases in n cause repeated multiplicative increases in work, suggesting exponential growth.'}
];
