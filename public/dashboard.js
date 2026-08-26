document.getElementById('add-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const input = document.getElementById('youtube-url');
  const resultEl = document.getElementById('result');
  resultEl.textContent = 'Creating link...';

  try {
    const res = await fetch('/api/videos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ youtubeUrl: input.value }),
    });

    if (res.status === 401) {
      resultEl.textContent = 'Session expired — reload the page and sign in again.';
      return;
    }

    const data = await res.json();

    if (!res.ok) {
      resultEl.textContent = data.error || 'Something went wrong.';
      return;
    }

    const fullUrl = `${window.location.origin}${data.path}`;
    resultEl.innerHTML = `Created: <a href="${data.path}" target="_blank">${fullUrl}</a>`;
    input.value = '';
    setTimeout(() => window.location.reload(), 1200);
  } catch (err) {
    resultEl.textContent = 'Network error creating link.';
  }
});
