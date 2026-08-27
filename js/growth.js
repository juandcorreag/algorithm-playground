import { ExpressionError, parseFunction, safeEvaluate, generateRange, formatLargeNumber, findCrossover } from './math-utils.js';

const $=id=>document.getElementById(id);
const presets={
  'quadratic-cubic':['100*n^2 + 17*n + 4','n^3',1,150], 'linear-nlogn':['10*n','n*log2(n)',1,2048], 'nlogn-quadratic':['n*log2(n)','n^2',1,100], 'cubic-exponential':['n^3','2^n',1,30], 'exponential-factorial':['2^n','factorial(n)',1,25]
};
let chart=null, parsedA=null, parsedB=null, hasRun=false;

function showMessage(kind,text){ const box=$('message'); box.className=`alert alert-${kind}`; box.textContent=text; }
function clearMessage(){ $('message').className='alert d-none'; $('message').textContent=''; }
function readConfiguration(){ const min=Number($('minN').value), max=Number($('maxN').value), points=Number($('points').value); if(!Number.isInteger(min)||!Number.isInteger(max)||min<0||max<=min) throw new RangeError('Use enteros con 0 ≤ n mínimo < n máximo.'); if(!Number.isInteger(points)||points<20||points>500) throw new RangeError('El número de puntos debe estar entre 20 y 500.'); return {min,max,points}; }
function parseInputs(){ try { parsedA=parseFunction($('functionA').value); parsedB=parseFunction($('functionB').value); return true; } catch(error) { showMessage('danger',error instanceof ExpressionError ? `No fue posible interpretar la expresión. ${error.message}` : error.message); return false; } }
function run(){ clearMessage(); if(!parseInputs()) return; let config; try{ config=readConfiguration(); }catch(error){ showMessage('danger',error.message); return; }
  const ns=generateRange(config.min,config.max,config.points); let omitted=0;
  const seriesFor=(parsed)=>ns.map(n=>{const value=safeEvaluate(parsed,n); const valid=Number.isFinite(value)&&($('scale').value!=='log'||value>0); if(!valid) omitted++; return [n,valid?value:null];});
  const a=seriesFor(parsedA), b=seriesFor(parsedB); if(!a.some(x=>x[1]!==null)&&!b.some(x=>x[1]!==null)){showMessage('warning','Ninguna función produce valores representables en este rango.');return;}
  $('chartEmpty').classList.add('d-none'); $('chart').classList.remove('d-none'); $('results').classList.remove('d-none'); $('explain').classList.remove('d-none');
  if(!chart) chart=echarts.init($('chart'));
  chart.setOption({animation:false,color:['#2457c5','#d2642a'],tooltip:{trigger:'axis'},legend:{top:4,data:['Function A','Function B']},grid:{left:72,right:30,top:50,bottom:70},xAxis:{type:'value',name:'n',nameLocation:'middle',nameGap:34,min:config.min,max:config.max},yAxis:{type:$('scale').value==='log'?'log':'value',name:'valor',nameGap:50},dataZoom:[{type:'inside'},{type:'slider',bottom:12}],series:[{name:'Function A',type:'line',showSymbol:false,connectNulls:false,data:a},{name:'Function B',type:'line',showSymbol:false,connectNulls:false,data:b}]},true);
  $('nSlider').min=config.min; $('nSlider').max=config.max; $('nSlider').value=Math.min(config.max,Math.max(config.min,10)); $('crossoverButton').disabled=false; hasRun=true; updatePoint();
  if(omitted) showMessage('warning',`${omitted} valores no definidos, demasiado grandes o incompatibles con la escala fueron omitidos.`); else showMessage('success','Experimento ejecutado. Compara la gráfica con tu predicción.');
  localStorage.setItem('algorithmPlayground.scale',$('scale').value); localStorage.setItem('algorithmPlayground.lastModule','growth');
}
function updatePoint(){ if(!hasRun)return; const n=Number($('nSlider').value), a=safeEvaluate(parsedA,n), b=safeEvaluate(parsedB,n); $('nOutput').value=n; $('valueA').textContent=formatLargeNumber(a); $('valueB').textContent=formatLargeNumber(b); $('winner').textContent=!Number.isFinite(a)||!Number.isFinite(b)?'No comparable':a===b?'Tie':a<b?'Function A':'Function B'; }
function crossover(){ if(!parseInputs())return; const result=findCrossover(parsedA,parsedB); $('crossoverResult').innerHTML=result?`<div class="alert alert-info mb-0"><strong>Approximate crossover:</strong> ${result.type==='equal'?`A(${result.n}) = B(${result.n})`:`el ganador cambia entre n = ${result.from} y n = ${result.n}`}.</div>`:'<div class="alert alert-secondary mb-0">No se encontró igualdad ni cambio de ganador para 1 ≤ n ≤ 100,000. Esto no demuestra que no exista fuera del rango.</div>'; }
function reset(){ $('preset').value='quadratic-cubic'; applyPreset(); document.querySelectorAll('[name=prediction]').forEach(x=>x.checked=false); $('runButton').disabled=true; $('crossoverButton').disabled=true; $('results').classList.add('d-none'); $('explain').classList.add('d-none'); $('chart').classList.add('d-none'); $('chartEmpty').classList.remove('d-none'); $('crossoverResult').innerHTML=''; if(chart){chart.dispose();chart=null;} hasRun=false; clearMessage(); }
function applyPreset(){ const [a,b,min,max]=presets[$('preset').value]; $('functionA').value=a; $('functionB').value=b; $('minN').value=min; $('maxN').value=max; $('points').value=Math.min(200,max-min+1); }
function applyUrl(){ const params=new URLSearchParams(location.search); if(params.has('f')) $('functionA').value=params.get('f').slice(0,160); if(params.has('g')) $('functionB').value=params.get('g').slice(0,160); }
document.querySelectorAll('[name=prediction]').forEach(input=>input.addEventListener('change',()=>{$('runButton').disabled=false;$('predictionHint').textContent='Predicción registrada. Ya puedes ejecutar el experimento.';}));
$('runButton').addEventListener('click',run); $('crossoverButton').addEventListener('click',crossover); $('resetButton').addEventListener('click',reset); $('nSlider').addEventListener('input',updatePoint); $('preset').addEventListener('change',applyPreset); window.addEventListener('resize',()=>chart?.resize());
$('scale').value=localStorage.getItem('algorithmPlayground.scale')||'linear'; applyUrl();
