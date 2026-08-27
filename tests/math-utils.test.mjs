import assert from 'node:assert/strict';
import { parseFunction,safeEvaluate,factorial,logFactorial,generateRange,formatLargeNumber,findCrossover,findMaxN,ExpressionError } from '../js/math-utils.js';
const approx=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
assert.equal(safeEvaluate('n^2',5),25); assert.equal(safeEvaluate('2*n+1',5),11); approx(safeEvaluate('n*log2(n)',8),24); assert.equal(safeEvaluate('2^n',10),1024); assert.equal(safeEvaluate('factorial(n)',5),120); assert.equal(safeEvaluate('-n^2',3),-9);
assert.equal(factorial(0),1); assert.equal(factorial(171),Infinity); approx(logFactorial(5),Math.log(120)); assert.deepEqual(generateRange(1,5,20),[1,2,3,4,5]); assert.equal(formatLargeNumber(1234),new Intl.NumberFormat('es-CO').format(1234)); assert.match(formatLargeNumber(1e12),/10¹²/);
assert.deepEqual(findCrossover(parseFunction('n'),parseFunction('n^2'),100),{n:1,type:'equal'});
assert.equal(findMaxN(n=>n,1000),1000); assert.equal(findMaxN(n=>n*n,1000),31); assert.equal(findMaxN(n=>2**n,1024),10); assert.equal(findMaxN(n=>factorial(n),120),5);
assert.throws(()=>parseFunction('window.alert(1)'),ExpressionError); assert.throws(()=>parseFunction('2n'),ExpressionError); assert.throws(()=>parseFunction('n+'),ExpressionError); assert.throws(()=>parseFunction('sqrt n'),ExpressionError);
console.log('math-utils: all tests passed');
