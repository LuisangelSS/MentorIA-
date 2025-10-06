document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const res = await fetch('/progress/summary', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    if (!res.ok) return;

    document.getElementById('m-quizzes').textContent = data.quizzes_count ?? 0;
    document.getElementById('m-attempts').textContent = data.attempts_count ?? 0;
    document.getElementById('m-avg').textContent = data.avg_score ?? 0;

    const list = document.getElementById('recent-attempts');
    list.innerHTML = (data.recentAttempts || []).map(a => `
      <div class="bg-secondary p-4 rounded-lg">
        <div class="text-text font-bold text-xl mb-1">${escapeHtml(a.topic)}</div>
        <div class="text-text/80">Puntaje: ${a.score}/${a.total} (${Math.round((a.score/a.total)*100)}%)</div>
        <div class="text-text/60 text-sm">${formatDate(a.completed_at)}</div>
      </div>
    `).join('');
  } catch (err) {
    console.error(err);
  }
});

function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch {
    return iso;
  }
}
