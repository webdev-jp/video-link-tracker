(function () {
  const slug = window.__SLUG;
  const videoId = window.__VIDEO_ID;
  const sentEvents = new Set();

  function track(type) {
    if (sentEvents.has(type)) return;
    sentEvents.add(type);
    fetch(`/api/track/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type }),
      keepalive: true,
    }).catch(() => {});
  }

  let progressInterval = null;

  window.onYouTubeIframeAPIReady = function () {
    new YT.Player('player', {
      videoId,
      playerVars: {
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        iv_load_policy: 3,
        fs: 1,
      },
      events: {
        onStateChange: function (event) {
          if (event.data === YT.PlayerState.PLAYING) {
            track('play');
            if (!progressInterval) {
              progressInterval = setInterval(() => {
                const player = event.target;
                const duration = player.getDuration();
                const current = player.getCurrentTime();
                if (!duration) return;
                const pct = (current / duration) * 100;
                if (pct >= 25) track('progress_25');
                if (pct >= 50) track('progress_50');
                if (pct >= 75) track('progress_75');
              }, 3000);
            }
          } else if (event.data === YT.PlayerState.ENDED) {
            track('complete');
            clearInterval(progressInterval);
          } else if (event.data === YT.PlayerState.PAUSED) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
        },
      },
    });
  };
})();
