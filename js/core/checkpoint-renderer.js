export function renderCheckpoint(container, checkpoint, handlers = {}) {
  const language = handlers.language ?? 'en';
  container.innerHTML = '';
  container.classList.add('checkpoint-card');
  container.tabIndex = -1;
  const heading = element('h3', 'h5', text(checkpoint.prompt, language));
  const form = element('form', 'checkpoint-form');
  form.dataset.responseType = checkpoint.responseType;
  form.append(renderResponse(checkpoint, language));
  const actions = element('div', 'checkpoint-actions');
  const submit = button('Submit decision', 'btn btn-primary');
  submit.type = 'submit';
  const hint = button('Hint', 'btn btn-outline-secondary');
  const reveal = button('Reveal', 'btn btn-outline-secondary');
  actions.append(submit, hint, reveal); form.append(actions);
  const feedback = element('div', 'checkpoint-feedback mt-3'); feedback.setAttribute('aria-live','polite');
  form.addEventListener('submit', event => { event.preventDefault(); handlers.onSubmit?.(readCheckpointResponse(form, checkpoint), feedback); });
  hint.addEventListener('click', () => handlers.onHint?.(feedback)); reveal.addEventListener('click', () => handlers.onReveal?.(feedback));
  container.append(heading, projectState(checkpoint, language), form, feedback);
  requestAnimationFrame(() => { container.focus(); form.querySelector('input, textarea, button')?.focus(); });
  return { form, feedback };
}

export function readCheckpointResponse(form, checkpoint) {
  const type = checkpoint.responseType;
  if (type === 'multiple-choice') return [...form.querySelectorAll('[name=checkpoint-option]:checked')].map(input => input.value);
  if (type === 'order-items') return [...form.querySelectorAll('[data-order-id]')].map(item => item.dataset.orderId);
  if (type === 'numeric') return Number(form.querySelector('[name=checkpoint-number]').value);
  if (type === 'short-justification') return form.querySelector('[name=checkpoint-text]').value;
  return form.querySelector('[name=checkpoint-option]:checked')?.value ?? null;
}

export function renderCheckpointFeedback(container, feedback, language = 'en') {
  const style = feedback.level === 'correct' ? 'success' : feedback.level === 'retry' ? 'warning' : feedback.level === 'hint' ? 'info' : feedback.level === 'recorded' ? 'info' : 'secondary';
  const detail = feedback.hint || feedback.explanation || '';
  const answer = feedback.validAnswers ? `<br><strong>Accepted answer:</strong> ${escape(feedback.validAnswers.flat().join(', '))}` : '';
  container.innerHTML = `<div class="alert alert-${style} mb-0"><strong>${escape(feedback.message ?? feedback.level)}</strong>${detail ? `<br>${escape(text(detail,language))}` : ''}${answer}</div>`;
}

function renderResponse(checkpoint, language) {
  if (checkpoint.responseType === 'numeric') { const input=element('input','form-control'); input.type='number'; input.step='any'; input.name='checkpoint-number'; input.required=true; input.setAttribute('aria-label','Numeric response'); return input; }
  if (checkpoint.responseType === 'short-justification') { const input=element('textarea','form-control'); input.name='checkpoint-text'; input.rows=3; input.required=true; input.placeholder='The greedy choice is safe because...'; return input; }
  if (checkpoint.responseType === 'order-items') return renderOrder(checkpoint.options,language);
  const wrapper=element('div',checkpoint.responseType==='select-visual-object'?'visual-object-options':'checkpoint-options');
  checkpoint.options.forEach(option => { const label=element('label',checkpoint.responseType==='select-visual-object'?'visual-object-option':'checkpoint-option'); const input=document.createElement('input'); input.type=checkpoint.responseType==='multiple-choice'?'checkbox':'radio'; input.name='checkpoint-option'; input.value=option.id; label.append(input,document.createTextNode(` ${text(option.label,language)}`)); wrapper.append(label); });
  return wrapper;
}
function renderOrder(options, language) { const list=element('ol','checkpoint-order'); options.forEach(option => { const item=element('li','checkpoint-order-item'); item.dataset.orderId=option.id; item.append(element('span','',text(option.label,language)),moveButton('↑','Move up',-1),moveButton('↓','Move down',1)); list.append(item); }); return list; }
function moveButton(symbol,label,direction){const control=button(symbol,'btn btn-sm btn-light');control.setAttribute('aria-label',label);control.addEventListener('click',()=>{const item=control.closest('li'),sibling=direction<0?item.previousElementSibling:item.nextElementSibling;if(sibling)direction<0?item.parentElement.insertBefore(item,sibling):item.parentElement.insertBefore(sibling,item);});return control;}
function projectState(checkpoint, language){const projection=checkpoint.stateProjection,box=element('div','checkpoint-projection');if(!projection)return box;const variables=projection.values??projection.variables;if(Array.isArray(variables))box.innerHTML=variables.map(name=>`<span><code>${escape(name)}</code></span>`).join('');else if(variables&&typeof variables==='object')box.innerHTML=Object.entries(variables).map(([key,value])=>`<span><code>${escape(key)}</code> = <strong>${escape(String(value))}</strong></span>`).join('');if(projection.description)box.append(element('p','mb-0',text(projection.description,language)));return box;}
function element(tag,className='',content=''){const node=document.createElement(tag);node.className=className;if(content)node.textContent=content;return node;}
function button(label,className){const node=element('button',className,label);node.type='button';return node;}
function text(value,language='en'){return typeof value==='object'?(value?.[language]??value?.en??value?.es??''):String(value??'');}
function escape(value){return String(value).replace(/[&<>'"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));}
