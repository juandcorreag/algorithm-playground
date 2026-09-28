const RESPONSE_TYPES = new Set(['choice', 'single-choice', 'multiple-choice', 'numeric', 'select-visual-object', 'order-items', 'accept-reject', 'short-justification']);

export function validateCheckpointDefinition(checkpoint) {
  if (!checkpoint?.id || !checkpoint.prompt || !RESPONSE_TYPES.has(checkpoint.responseType)) throw new TypeError('Invalid checkpoint definition.');
  if (checkpoint.responseType !== 'short-justification' && !Array.isArray(checkpoint.validAnswers)) throw new TypeError(`Checkpoint ${checkpoint.id} requires validAnswers.`);
  if (['choice','single-choice','multiple-choice','select-visual-object','accept-reject'].includes(checkpoint.responseType) && !Array.isArray(checkpoint.options)) throw new TypeError(`Checkpoint ${checkpoint.id} requires options.`);
  return checkpoint;
}

export function validateCheckpointResponse(checkpoint, response, { numericTolerance } = {}) {
  validateCheckpointDefinition(checkpoint);
  const type = checkpoint.responseType;
  if (type === 'short-justification') return { correct: null, graded: false, reason: String(response ?? '').trim() ? 'recorded' : 'empty' };
  if (type === 'multiple-choice') return result(matchesSetAnswer(checkpoint.validAnswers, normalizeArray(response)));
  if (type === 'order-items') return result(matchesOrderedAnswer(checkpoint.validAnswers, normalizeArray(response)));
  if (type === 'numeric') {
    const value = Number(response), tolerance = numericTolerance ?? checkpoint.numericTolerance ?? 0;
    return result(Number.isFinite(value) && checkpoint.validAnswers.some(answer => Math.abs(value - Number(answer)) <= tolerance));
  }
  return result(checkpoint.validAnswers.map(String).includes(String(response)));
}

function matchesSetAnswer(validAnswers, response) {
  const validSets = Array.isArray(validAnswers[0]) ? validAnswers : [validAnswers];
  const actual = [...new Set(response.map(String))].sort();
  return validSets.some(valid => JSON.stringify([...new Set(valid.map(String))].sort()) === JSON.stringify(actual));
}
function matchesOrderedAnswer(validAnswers, response) {
  const validOrders = Array.isArray(validAnswers[0]) ? validAnswers : [validAnswers];
  return validOrders.some(valid => valid.map(String).join('\u0000') === response.map(String).join('\u0000'));
}
function normalizeArray(response) { return Array.isArray(response) ? response : response == null ? [] : [response]; }
function result(correct) { return { correct, graded: true, reason: correct ? 'match' : 'mismatch' }; }
