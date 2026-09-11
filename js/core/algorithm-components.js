import { COUNTER_KEYS, createCounters } from './algorithm-engine.js';

const counterLabels = {
  comparisons: 'Comparisons', assignments: 'Assignments', arithmeticOperations: 'Arithmetic operations',
  arrayAccesses: 'Array accesses', loopIterations: 'Loop iterations'
};

export function renderPseudocode(container, pseudocode, activeLine = null) {
  container.innerHTML = '';
  for (const line of pseudocode) {
    const item = document.createElement('li');
    item.className = `pseudocode-line${line.id === activeLine ? ' active' : ''}`;
    item.dataset.line = line.id;
    item.setAttribute('aria-current', line.id === activeLine ? 'step' : 'false');
    item.innerHTML = `<span class="line-number">${line.id}</span><code>${escapeHtml(line.text)}</code>${line.id === activeLine ? '<span class="active-step-label">CURRENT</span>' : ''}`;
    container.append(item);
  }
}

export function renderArray(container, visualization = {}) {
  const array = visualization.array ?? [];
  container.innerHTML = '';
  array.forEach((value, index) => {
    const cell = document.createElement('div');
    const states = [];
    if (visualization.activeIndices?.includes(index)) states.push('active');
    if (visualization.comparedIndices?.includes(index)) states.push('compared');
    if (visualization.foundIndices?.includes(index)) states.push('found');
    if (visualization.swappedIndices?.includes(index)) states.push('swapped');
    if (visualization.discardedIndices?.includes(index)) states.push('discarded');
    if (Number.isInteger(visualization.sortedFrom) && index >= visualization.sortedFrom) states.push('sorted');
    cell.className = `array-cell ${states.join(' ')}`;
    cell.innerHTML = `<span class="array-index">${index}</span><strong>${escapeHtml(String(value))}</strong>${states.length ? `<span class="array-state">${states.join(' · ')}</span>` : ''}${visualization.labels?.[index] ? `<span class="array-pointer">▲ ${escapeHtml(visualization.labels[index])}</span>` : ''}`;
    container.append(cell);
  });
}

export function renderCounters(container, counters = createCounters(), selected = COUNTER_KEYS) {
  container.innerHTML = selected.map(key => `<div class="counter-row"><span>${counterLabels[key]}</span><strong>${counters[key] ?? 0}</strong></div>`).join('');
}

export function renderVariables(container, variables = {}) {
  const entries = Object.entries(variables);
  container.innerHTML = entries.length ? entries.map(([name, value]) => `<div class="variable-row"><code>${escapeHtml(name)}</code><strong>${escapeHtml(formatValue(value))}</strong></div>`).join('') : '<p class="text-secondary small mb-0">No variables yet.</p>';
}

export function counterLabel(key) { return counterLabels[key] ?? key; }

function formatValue(value) { return Array.isArray(value) ? `[${value.join(', ')}]` : String(value); }
function escapeHtml(value) { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; }
