const FUNCTIONS = new Set(['sqrt', 'log', 'log2', 'factorial']);
const OPERATORS = { '+': [1, 'left'], '-': [1, 'left'], '*': [2, 'left'], '/': [2, 'left'], '^': [4, 'right'], 'u-': [3, 'right'] };

export class ExpressionError extends Error {}

function tokenize(source) {
  if (typeof source !== 'string' || !source.trim() || source.length > 160) throw new ExpressionError('La expresión está vacía o es demasiado larga.');
  const tokens = []; let i = 0;
  while (i < source.length) {
    const rest = source.slice(i); const ws = rest.match(/^\s+/); if (ws) { i += ws[0].length; continue; }
    const number = rest.match(/^(?:\d+(?:\.\d*)?|\.\d+)/); if (number) { tokens.push({ type:'number', value:Number(number[0]) }); i += number[0].length; continue; }
    const name = rest.match(/^[A-Za-z][A-Za-z0-9]*/); if (name) { const value=name[0].toLowerCase(); if (value !== 'n' && !FUNCTIONS.has(value)) throw new ExpressionError(`Nombre no permitido: ${name[0]}.`); tokens.push({ type:value === 'n' ? 'variable':'function', value }); i += name[0].length; continue; }
    const char=source[i]; if ('+-*/^(),'.includes(char)) { tokens.push({ type:char === '(' || char === ')' ? 'paren':'operator', value:char }); i++; continue; }
    throw new ExpressionError(`Símbolo no permitido: ${char}.`);
  }
  return tokens;
}

export function parseFunction(source) {
  const tokens=tokenize(source); const output=[]; const stack=[]; let expectValue=true;
  tokens.forEach((token,index)=>{ if(token.type==='function' && tokens[index+1]?.value!=='(') throw new ExpressionError(`Use paréntesis después de ${token.value}.`); });
  for (const token of tokens) {
    if (token.type === 'number' || token.type === 'variable') { if (!expectValue) throw new ExpressionError('Falta un operador entre dos valores.'); output.push(token); expectValue=false; continue; }
    if (token.type === 'function') { if (!expectValue) throw new ExpressionError('Falta un operador antes de la función.'); stack.push(token); expectValue=true; continue; }
    if (token.type === 'paren' && token.value === '(') { stack.push(token); expectValue=true; continue; }
    if (token.type === 'paren' && token.value === ')') {
      if (expectValue) throw new ExpressionError('Paréntesis vacío o incompleto.');
      while (stack.length && stack.at(-1).value !== '(') output.push(stack.pop());
      if (!stack.length) throw new ExpressionError('Paréntesis desbalanceados.'); stack.pop();
      if (stack.at(-1)?.type === 'function') output.push(stack.pop()); expectValue=false; continue;
    }
    if (token.type === 'operator') {
      if (token.value === ',') throw new ExpressionError('Las funciones admiten un solo argumento.');
      let op=token.value; if (op === '-' && expectValue) op='u-'; else if (expectValue) throw new ExpressionError(`El operador ${op} necesita un valor a la izquierda.`);
      const [precedence, associativity]=OPERATORS[op];
      while (stack.at(-1) && OPERATORS[stack.at(-1).value]) { const [top]=OPERATORS[stack.at(-1).value]; if ((associativity === 'left' && precedence <= top) || (associativity === 'right' && precedence < top)) output.push(stack.pop()); else break; }
      stack.push({type:'operator',value:op}); expectValue=true;
    }
  }
  if (expectValue) throw new ExpressionError('La expresión está incompleta.');
  while (stack.length) { const item=stack.pop(); if (item.type === 'paren') throw new ExpressionError('Paréntesis desbalanceados.'); output.push(item); }
  return { source, rpn:output };
}

export function factorial(n) { if (!Number.isInteger(n) || n < 0) return NaN; if (n > 170) return Infinity; let value=1; for (let i=2;i<=n;i++) value*=i; return value; }
export function logFactorial(n) { if (!Number.isInteger(n) || n < 0) return NaN; let value=0; for (let i=2;i<=n;i++) value+=Math.log(i); return value; }

export function safeEvaluate(parsedOrSource, n) {
  if (!Number.isFinite(n) || n < 0) return NaN;
  const parsed=typeof parsedOrSource === 'string' ? parseFunction(parsedOrSource) : parsedOrSource; const values=[];
  for (const token of parsed.rpn) {
    if (token.type === 'number') values.push(token.value); else if (token.type === 'variable') values.push(n);
    else if (token.type === 'operator') { if (token.value === 'u-') values.push(-values.pop()); else { const b=values.pop(), a=values.pop(); values.push(token.value==='+'?a+b:token.value==='-'?a-b:token.value==='*'?a*b:token.value==='/'?a/b:Math.pow(a,b)); } }
    else { const a=values.pop(); values.push(token.value==='sqrt'?Math.sqrt(a):token.value==='log'?Math.log(a):token.value==='log2'?Math.log2(a):factorial(a)); }
  }
  const result=values[0]; return Number.isNaN(result) ? NaN : result;
}

export function generateRange(min,max,points) { const count=Math.max(2,Math.min(500,Math.floor(points))); if (!Number.isInteger(min)||!Number.isInteger(max)||min<0||max<=min) throw new RangeError('Use enteros con 0 ≤ mínimo < máximo.'); const size=max-min+1; if (size<=count) return Array.from({length:size},(_,i)=>min+i); const result=[]; for(let i=0;i<count;i++) result.push(Math.round(min+(i*(max-min))/(count-1))); return [...new Set(result)]; }
export function formatLargeNumber(value) { if (Number.isNaN(value)) return 'no definido'; if (!Number.isFinite(value)) return 'value too large'; const abs=Math.abs(value); if ((abs>=1e6)||(abs>0&&abs<.001)) { const exponent=Math.floor(Math.log10(abs)); const coefficient=value/10**exponent; return `${coefficient.toFixed(2).replace(/\.00$/,'')} × 10${toSuperscript(exponent)}`; } return new Intl.NumberFormat('es-CO',{maximumFractionDigits:3}).format(value); }
function toSuperscript(value) { const map={'-':'⁻','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'}; return String(value).split('').map(c=>map[c]).join(''); }
export function findCrossover(a,b,limit=100000) { let previous=null; for(let n=1;n<=limit;n++){ const av=safeEvaluate(a,n), bv=safeEvaluate(b,n); if(!Number.isFinite(av)||!Number.isFinite(bv)) continue; const sign=Math.sign(av-bv); if(sign===0) return {n,type:'equal'}; if(previous && sign!==previous.sign) return {n,type:'change',from:previous.n}; previous={sign,n}; } return null; }

export function findMaxN(costFunction,maxOperations,maxN=Number.MAX_SAFE_INTEGER) {
  if(typeof costFunction!=='function'||!Number.isFinite(maxOperations)||maxOperations<0) throw new TypeError('Se requiere una función de costo y un presupuesto no negativo.');
  let low=0,high=1,iterations=0;
  const affordable=n=>{const cost=costFunction(n);return Number.isFinite(cost)&&cost<=maxOperations;};
  if(!affordable(1)) return 0;
  while(high<maxN&&affordable(high)&&iterations++<64){low=high;high=Math.min(maxN,high*2);}
  if(high===maxN&&affordable(high)) return maxN;
  while(low+1<high&&iterations++<128){const mid=low+Math.floor((high-low)/2);if(affordable(mid))low=mid;else high=mid;}
  return low;
}
