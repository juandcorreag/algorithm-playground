import { validateCheckpointDefinition, validateCheckpointResponse } from './checkpoint-validation.js';

export function createCheckpointSession(checkpoint, policy = {}) {
  validateCheckpointDefinition(checkpoint);
  const settings = { allowRetry: true, revealAfterAttempts: 2, ...policy };
  let attempts = 0, status = 'pending', history = [];
  return {
    get checkpoint() { return checkpoint; }, get attempts() { return attempts; }, get status() { return status; }, get history() { return structuredClone(history); },
    submit(response) {
      if (status === 'correct' || status === 'revealed') return feedback(status, attempts, checkpoint);
      attempts += 1;
      const validation = validateCheckpointResponse(checkpoint, response, settings);
      history.push({ response: structuredClone(response), validation });
      if (validation.graded === false) { status = 'recorded'; return { level:'recorded', attempts, validation, message:'Response recorded without automatic grading.' }; }
      if (validation.correct) { status = 'correct'; return feedback('correct', attempts, checkpoint, validation); }
      if (!settings.allowRetry || attempts >= settings.revealAfterAttempts) { status = 'revealed'; return feedback('revealed', attempts, checkpoint, validation); }
      status = 'retry'; return feedback('retry', attempts, checkpoint, validation);
    },
    hint() { return { level:'hint', attempts, hint: localized(checkpoint.hints?.[Math.min(attempts, (checkpoint.hints?.length ?? 1) - 1)] ?? checkpoint.hints?.[0]) }; },
    reveal() { status = 'revealed'; return feedback('revealed', attempts, checkpoint); },
    reset() { attempts = 0; status = 'pending'; history = []; }
  };
}

export function selectCheckpoints(trace, policy = {}, seed = 1) {
  const settings = { mode:'selected', eventTypes:[], frequency:1, maximum:Infinity, ...policy };
  let eligible = trace.map((step, stepIndex) => ({ step, stepIndex })).filter(({ step }) => {
    const eventIsAllowed = settings.eventTypes.length === 0 || settings.eventTypes.includes(step.type);
    return eventIsAllowed && Boolean(step.checkpointId);
  });
  if (settings.mode === 'manual') return [];
  if (settings.mode === 'selected') eligible = eligible.filter((_, index) => index % Math.max(1, settings.frequency) === 0);
  if (settings.mode === 'random') eligible = seededShuffle(eligible, seed);
  return eligible.slice(0, settings.maximum).map(({ step, stepIndex }) => ({ checkpointId:step.checkpointId, stepIndex, eventType:step.type }));
}

export function restoreCheckpointState(traceStep) {
  return structuredClone({ variables:traceStep.variables ?? {}, structures:traceStep.structures ?? {}, visualization:traceStep.visualization ?? {}, counters:traceStep.counters ?? {} });
}

export function createTemporaryBranch(traceStep, proposedChanges = {}) {
  const branch = restoreCheckpointState(traceStep);
  return deepMerge(branch, structuredClone(proposedChanges));
}

function feedback(level, attempts, checkpoint, validation) {
  const messages = { correct:'Correct. The prediction matches the greedy decision.', retry:'Not quite. Reconsider the visible state and greedy rule.', revealed:'The algorithm decision has been revealed.' };
  return { level, attempts, validation, message:messages[level], explanation:level==='correct'||level==='revealed'?localized(checkpoint.explanation):null, validAnswers:level==='revealed'?structuredClone(checkpoint.validAnswers):undefined };
}
function localized(value) { return value?.en ?? value?.es ?? value ?? ''; }
function seededShuffle(items, seed) { const copy=[...items], random=mulberry32(Number(seed)||1); for(let i=copy.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];} return copy; }
function mulberry32(seed) { return () => { seed|=0; seed=seed+0x6D2B79F5|0; let t=Math.imul(seed^seed>>>15,1|seed); t=t+Math.imul(t^t>>>7,61|t)^t; return ((t^t>>>14)>>>0)/4294967296; }; }
function deepMerge(target, changes) { for(const [key,value] of Object.entries(changes)){if(value&&typeof value==='object'&&!Array.isArray(value))target[key]=deepMerge(target[key]??{},value);else target[key]=value;} return target; }
