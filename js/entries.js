const KEY = 'journal.entries';
const load = () => JSON.parse(localStorage.getItem(KEY) || '{}');
const list = document.getElementById('list');

function fmtDate(d) {
  return new Date(d + 'T00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
}
function render(q = '') {
  const entries = load();
  const rows = Object.entries(entries)
    .sort((a, b) => b[0].localeCompare(a[0]))
    .filter(([d, e]) => (e.title + e.body).toLowerCase().includes(q.toLowerCase()));
  if (!rows.length) { list.innerHTML = '<div class="empty">No entries yet. Go write one!</div>'; return; }
  list.innerHTML = rows.map(([d, e]) => `
    <div class="entry">
      <button class="del" data-d="${d}">delete</button>
      <div class="d">${fmtDate(d)}</div>
      <h3>${escapeHtml(e.title)}</h3>
      <p>${escapeHtml(e.body).slice(0, 240)}${e.body.length > 240 ? '…' : ''}</p>
    </div>`).join('');
  list.querySelectorAll('.del').forEach(b => b.onclick = () => {
    if (!confirm('Delete this entry?')) return;
    const e = load(); delete e[b.dataset.d]; localStorage.setItem(KEY, JSON.stringify(e)); render(document.getElementById('search').value);
  });
}
function escapeHtml(s) { return s.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
document.getElementById('search').addEventListener('input', e => render(e.target.value));
render();
