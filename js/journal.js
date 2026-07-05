const $ = id => document.getElementById(id);
const KEY = 'journal.entries';
const load = () => JSON.parse(localStorage.getItem(KEY) || '{}');
const store = e => localStorage.setItem(KEY, JSON.stringify(e));
const today = () => new Date().toISOString().slice(0, 10);

function open(date) {
  const e = load()[date];
  $('title').value = e ? e.title : '';
  $('body').value = e ? e.body : '';
  updateCount();
  $('saved').textContent = e ? 'saved' : '';
}
function updateCount() {
  const w = $('body').value.trim().split(/\s+/).filter(Boolean).length;
  $('count').textContent = w + (w === 1 ? ' word' : ' words');
}
function save() {
  const entries = load();
  const date = $('date').value;
  const title = $('title').value.trim();
  const body = $('body').value.trim();
  if (!title && !body) { delete entries[date]; }
  else entries[date] = { title: title || '(untitled)', body, ts: Date.now() };
  store(entries);
  $('saved').textContent = 'saved ✓';
  setTimeout(() => $('saved').textContent = 'saved', 1200);
}
$('date').value = today();
$('date').addEventListener('change', () => open($('date').value));
$('body').addEventListener('input', () => { updateCount(); $('saved').textContent = 'unsaved…'; });
$('title').addEventListener('input', () => $('saved').textContent = 'unsaved…');
$('save').addEventListener('click', save);
// autosave on blur
$('body').addEventListener('blur', save);
open(today());
