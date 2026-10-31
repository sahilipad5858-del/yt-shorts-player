/**
 * BLVCKTORQUE Shorts Multi-Player Wall
 * With automatic video re-shuffle on playback completion (no repeating until cycle finishes)
 */

const DEFAULT_CHANNEL_ID = 'UCc3WaSgyMJ4q1orDuTla1BA';
const DEFAULT_CHANNEL_NAME = 'BLVCKTORQUE';

// Curated library of 15 verified working shorts from BLVCKTORQUE
const BLVCKTORQUE_SHORTS = [
  { id: '0X9pWHijTCw', title: 'Red Bull Athletes In GTA 5 Be Like... 🪂🔥 Extreme Stunts Compilation' },
  { id: 'f9gk9xUtos8', title: 'Top Gun\'s "Best" Pilot Crashes In GTA 5! ✈️💀 Epic Fighter Jet Fail' },
  { id: 'bosSZd6gQNI', title: 'Fortnite Building In GTA 5 Is Actually INSANE! ⛏️🧱 Battle Royale Crossover' },
  { id: 'sq6HhyzE8rg', title: '"Be Safe Out There" ...GTA 5 Public Lobbies: 💥💀 Pure Los Santos Chaos' },
  { id: 'nLJpeCKbGEU', title: 'You Can STILL Do This Glitch In GTA 5 In 2025! 🚀😱 Super Launch Bug' },
  { id: 'yW7PzDevJwg', title: 'The GTA 5 Cave Diver Memes NEED To Stop! 😂🤿 Claustrophobic Tunnel' },
  { id: 'raLXHV__l2o', title: 'Can A BMX Bike Conquer The Hardest Turn In GTA 5?! 🚲🔥 Insane Bicycle Stunt' },
  { id: '4xK9v6xZgbg', title: 'The FASTEST Way To Beat The Hardest Turn In GTA 5! ⚡🏎️ Speedrun Stunt' },
  { id: '7iYmNFKMoJ0', title: 'Cave Divers For Literally No Reason In GTA 5! 🤿🌊 Claustrophobia Meme' },
  { id: '4K7QtmljHl8', title: 'Why Did He Do That In GTA 5?! 🤦‍♂️💥 Heist Teammate Fail' },
  { id: 'gzb8rMK8GTE', title: 'Pizza Delivery Boy VS The Hardest Turn In GTA 5! 🍕🛵 Impossible Run' },
  { id: 'NtNhPmXJJJ0', title: 'I Hope GTA 6 DOESN\'T Have These Physics! 💀🚀 Broken GTA 5 Physics Glitch' },
  { id: 'Ebto1Dwbuw8', title: 'This GTA 5 Clip Is Straight Out Of A James Bond Movie! 🕵️‍♂️💥 007 Car Chase' },
  { id: '2BWmnXi-5gA', title: 'Just A Casual Drift In GTA Online... Wait For It! 🚗💨 Drift Fail' },
  { id: 'GMAtt42y_cw', title: 'All POVs At The Hardest Turn In GTA 5! 🎥🏎️ Multi-Angle Stunt Showcase' }
];

const PRESETS = {
  '@veritasium': [
    { id: '2cM2lY6hI9A', title: 'Why The Speed of Light Cannot Be Measured' },
    { id: 'pWbk06bZgD0', title: 'The Surprising Secret Behind Miracles' },
    { id: 'hK-Z4H2N7Yg', title: 'Can You Solve This Infinite Puzzle?' },
    { id: 'mQh4fE-3Wj8', title: 'The Infinite Hotel Paradox' }
  ],
  '@mkbhd': [
    { id: '813Z0r4cW1w', title: 'The Weirdest Phone Feature Ever?' },
    { id: '2G4gL2Gq1Hk', title: 'Is Apple Vision Pro Actually Worth It?' },
    { id: '3Fz2dJ0sZ5M', title: 'This Tech Feels Like Magic' },
    { id: 'vQ9yH6bB-tY', title: 'The Best Smartphone Camera Blind Test' }
  ],
  '@ZachKing': [
    { id: '8OvdQZgI9bU', title: 'Magic Broom Flight Illusion' },
    { id: 'w_c4g6yqG-o', title: 'Escaping Into Another Dimension' },
    { id: 'dZ-jK3sVv9Q', title: 'The Impossible Mirror Trick' }
  ]
};

// Global App State
window.appState = {
  currentChannelName: DEFAULT_CHANNEL_NAME,
  currentChannelId: DEFAULT_CHANNEL_ID,
  shortsPool: [...BLVCKTORQUE_SHORTS],
  playerCount: 4,
  isPlaying: false,
  activeAudioIndex: null,
  activeCards: [],
  playedHistoryPerSlot: {}, // slotIndex -> Set of videoIds to avoid repeating
  ytPlayers: {} // slotIndex -> YT.Player instance
};

// Build Direct YouTube Embed URL (enablejsapi=1 allows listening for ENDED state)
function buildEmbedUrl(videoId, isMuted = true) {
  const muteVal = isMuted ? 1 : 0;
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${muteVal}&playsinline=1&controls=1&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(window.location.origin || 'http://localhost')}`;
}

// Global: Change Player Count (1, 4, 8, 12, 16, 24)
window.changePlayerCount = function(count) {
  count = parseInt(count, 10);
  window.appState.playerCount = count;

  // Update top pills
  document.querySelectorAll('.grid-pill').forEach(pill => {
    if (parseInt(pill.dataset.count, 10) === count) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  // Update hero pills
  document.querySelectorAll('.hero-pill').forEach(pill => {
    if (pill.textContent.includes(String(count))) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });

  // Update start button text
  const startBtnText = document.getElementById('start-btn-text');
  if (startBtnText) {
    startBtnText.textContent = window.appState.isPlaying 
      ? `Reshuffle All (${count})` 
      : `Start Players (${count})`;
  }

  const heroBtnLabel = document.getElementById('hero-btn-label');
  if (heroBtnLabel) {
    heroBtnLabel.textContent = `Launch ${count} Shorts Players`;
  }

  if (window.appState.isPlaying) {
    renderMatrix();
    showToast(`Switched to ${count} players grid!`);
  } else {
    showToast(`Selected ${count} players`);
  }
};

// Global: Start Playing or Reshuffle
window.startOrShuffleStreams = function() {
  const launchHero = document.getElementById('launch-hero');
  const shortsMatrix = document.getElementById('shorts-matrix');
  const startBtnText = document.getElementById('start-btn-text');
  const startBtnIcon = document.getElementById('start-btn-icon');
  const stopAllBtn = document.getElementById('stop-all-btn');

  window.appState.isPlaying = true;
  window.appState.activeAudioIndex = null;
  window.appState.playedHistoryPerSlot = {};

  if (launchHero) launchHero.classList.add('hidden');
  if (shortsMatrix) shortsMatrix.classList.remove('hidden');
  if (stopAllBtn) stopAllBtn.classList.remove('hidden');

  if (startBtnText) startBtnText.textContent = `Reshuffle All (${window.appState.playerCount})`;
  if (startBtnIcon) startBtnIcon.textContent = '🔄';

  renderMatrix();
  showToast(`Streaming ${window.appState.playerCount} random shorts!`);
};

// Global: Stop All Streams
window.stopAllStreams = function() {
  const launchHero = document.getElementById('launch-hero');
  const shortsMatrix = document.getElementById('shorts-matrix');
  const startBtnText = document.getElementById('start-btn-text');
  const startBtnIcon = document.getElementById('start-btn-icon');
  const stopAllBtn = document.getElementById('stop-all-btn');

  window.appState.isPlaying = false;
  window.appState.activeAudioIndex = null;

  if (shortsMatrix) {
    shortsMatrix.innerHTML = '';
    shortsMatrix.classList.add('hidden');
  }
  if (launchHero) launchHero.classList.remove('hidden');
  if (stopAllBtn) stopAllBtn.classList.add('hidden');

  if (startBtnText) startBtnText.textContent = `Start Players (${window.appState.playerCount})`;
  if (startBtnIcon) startBtnIcon.textContent = '▶';

  showToast('Stopped all video streams');
};

// Get Next Non-Repeated Random Short for a Slot
function getNextNonRepeatedShort(slotIndex, currentVideoId = null) {
  const pool = window.appState.shortsPool;
  if (!window.appState.playedHistoryPerSlot[slotIndex]) {
    window.appState.playedHistoryPerSlot[slotIndex] = new Set();
  }
  const history = window.appState.playedHistoryPerSlot[slotIndex];

  // Candidates not recently played in this slot and not currently playing
  let candidates = pool.filter(v => v.id !== currentVideoId && !history.has(v.id));

  // If all videos in the pool have been seen in this slot, reset history for continuous looping
  if (candidates.length === 0) {
    history.clear();
    candidates = pool.filter(v => v.id !== currentVideoId);
  }

  const selected = candidates.length > 0 
    ? candidates[Math.floor(Math.random() * candidates.length)] 
    : pool[0];

  history.add(selected.id);
  return selected;
}

// Render Matrix
function renderMatrix() {
  const container = document.getElementById('shorts-matrix');
  if (!container) return;

  const count = window.appState.playerCount;
  container.className = `shorts-matrix grid-${count}`;
  container.innerHTML = '';
  window.appState.activeCards = [];
  window.appState.ytPlayers = {};

  for (let i = 0; i < count; i++) {
    const video = getNextNonRepeatedShort(i);
    const isMuted = window.appState.activeAudioIndex !== i;

    window.appState.activeCards.push({
      index: i,
      video: video,
      isMuted: isMuted
    });

    const card = document.createElement('div');
    card.className = `player-card ${!isMuted ? 'has-sound' : ''}`;
    card.id = `card-slot-${i}`;

    const embedUrl = buildEmbedUrl(video.id, isMuted);

    card.innerHTML = `
      <div class="card-header-bar">
        <span class="slot-badge">#${i + 1}</span>
        <div class="slot-actions">
          <button class="card-btn sound-toggle-btn ${!isMuted ? 'sound-on' : ''}" 
                  onclick="toggleAudio(${i})" 
                  title="${isMuted ? 'Unmute this video' : 'Mute'}">
            ${isMuted ? '🔇' : '🔊'}
          </button>
          <button class="card-btn" onclick="reRollVideo(${i})" title="Shuffle this slot without repeating">
            🎲
          </button>
          <a href="https://www.youtube.com/shorts/${video.id}" target="_blank" class="card-btn" title="Open on YouTube">
            ↗
          </a>
        </div>
      </div>
      <iframe 
        id="iframe-slot-${i}"
        src="${embedUrl}" 
        title="${escapeHtml(video.title)}" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
      <div class="card-footer-overlay">
        <p class="slot-title" id="title-slot-${i}">${escapeHtml(video.title)}</p>
      </div>
    `;

    container.appendChild(card);
  }
}

// Global: Toggle Audio for Slot
window.toggleAudio = function(index) {
  if (window.appState.activeAudioIndex === index) {
    window.appState.activeAudioIndex = null;
    showToast(`Muted #${index + 1}`);
  } else {
    window.appState.activeAudioIndex = index;
    showToast(`🔊 Sound active on player #${index + 1}`);
  }

  window.appState.activeCards.forEach((card, i) => {
    const shouldMute = window.appState.activeAudioIndex !== i;
    const cardEl = document.getElementById(`card-slot-${i}`);
    if (!cardEl) return;

    if (card.isMuted !== shouldMute) {
      card.isMuted = shouldMute;
      const iframe = document.getElementById(`iframe-slot-${i}`);
      if (iframe) {
        iframe.src = buildEmbedUrl(card.video.id, shouldMute);
      }
      const soundBtn = cardEl.querySelector('.sound-toggle-btn');
      if (soundBtn) {
        soundBtn.textContent = shouldMute ? '🔇' : '🔊';
        if (shouldMute) {
          soundBtn.classList.remove('sound-on');
          cardEl.classList.remove('has-sound');
        } else {
          soundBtn.classList.add('sound-on');
          cardEl.classList.add('has-sound');
        }
      }
    }
  });
};

// Global: Re-roll single slot (picks non-repeated short)
window.reRollVideo = function(index) {
  const cardData = window.appState.activeCards[index];
  if (!cardData) return;

  const newVideo = getNextNonRepeatedShort(index, cardData.video.id);
  cardData.video = newVideo;

  const iframe = document.getElementById(`iframe-slot-${index}`);
  const title = document.getElementById(`title-slot-${index}`);
  if (iframe) iframe.src = buildEmbedUrl(newVideo.id, cardData.isMuted);
  if (title) title.textContent = newVideo.title;

  showToast(`Shuffled #${index + 1}: ${newVideo.title}`);
};

// Auto-Shuffle on Video Ended Message (YouTube postMessage listener)
window.addEventListener('message', function(event) {
  if (!event.data || typeof event.data !== 'string') return;
  try {
    const data = JSON.parse(event.data);
    // YouTube iframe API sends infoDelivery with playerState
    // playerState 0 = YT.PlayerState.ENDED
    if (data.event === 'infoDelivery' && data.info && data.info.playerState === 0) {
      // Find which iframe sent this message
      window.appState.activeCards.forEach((card, idx) => {
        const iframe = document.getElementById(`iframe-slot-${idx}`);
        if (iframe && iframe.contentWindow === event.source) {
          // Video finished playing: auto-shuffle to next non-repeated short!
          window.reRollVideo(idx);
        }
      });
    }
  } catch (e) {
    // Non-JSON message from other sources, ignore
  }
});

// Global: Reset to BLVCKTORQUE
window.resetToDefaultChannel = function() {
  window.appState.currentChannelName = DEFAULT_CHANNEL_NAME;
  window.appState.currentChannelId = DEFAULT_CHANNEL_ID;
  window.appState.shortsPool = [...BLVCKTORQUE_SHORTS];
  window.appState.playedHistoryPerSlot = {};

  updateChannelInfo();
  document.querySelectorAll('.quick-chip').forEach(c => {
    if (c.textContent.includes('BLVCKTORQUE')) c.classList.add('active');
    else c.classList.remove('active');
  });

  if (window.appState.isPlaying) {
    renderMatrix();
  }
  showToast('Loaded BLVCKTORQUE channel');
  syncChannelFeed(DEFAULT_CHANNEL_ID);
};

// Global: Load Preset
window.loadPreset = function(key) {
  const list = PRESETS[key];
  if (!list) return;

  window.appState.currentChannelName = key;
  window.appState.shortsPool = [...list];
  window.appState.playedHistoryPerSlot = {};

  updateChannelInfo();
  document.querySelectorAll('.quick-chip').forEach(c => {
    if (c.textContent.includes(key.replace('@', ''))) c.classList.add('active');
    else c.classList.remove('active');
  });

  if (window.appState.isPlaying) {
    renderMatrix();
  }
  showToast(`Loaded ${key}`);
};

// Global: Form submit
window.handleChannelSubmit = function(e) {
  e.preventDefault();
  const input = document.getElementById('channel-input');
  if (!input) return;
  const val = input.value.trim();
  if (!val) return;

  const matchId = val.match(/(UC[a-zA-Z0-9_-]{22})/);
  if (matchId) {
    const id = matchId[1];
    window.appState.currentChannelName = 'Custom Channel';
    window.appState.currentChannelId = id;
    syncChannelFeed(id).then(() => {
      if (window.appState.isPlaying) renderMatrix();
      showToast('Loaded custom channel!');
    });
    return;
  }

  const videoMatch = val.match(/\/shorts\/([a-zA-Z0-9_-]{11})/) || val.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (videoMatch) {
    const id = videoMatch[1];
    window.appState.shortsPool.unshift({ id: id, title: 'Custom Short' });
    updateChannelInfo();
    if (window.appState.isPlaying) renderMatrix();
    showToast('Added custom short to stream!');
  }
};

// Live Feed Sync (Pulls any future uploads from YouTube)
async function syncChannelFeed(channelId) {
  try {
    const rss = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const url = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rss)}&_t=${Date.now()}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.status === 'ok' && data.items && data.items.length) {
      const fresh = data.items.map(item => {
        const id = (item.guid || '').replace('yt:video:', '') || 
                   (item.link.match(/\/shorts\/([a-zA-Z0-9_-]{11})/) || [])[1];
        return { id: id, title: item.title };
      }).filter(i => i.id);

      if (fresh.length > 0) {
        const existing = new Set(window.appState.shortsPool.map(s => s.id));
        const newOnes = fresh.filter(i => !existing.has(i.id));
        if (newOnes.length > 0) {
          window.appState.shortsPool = [...newOnes, ...window.appState.shortsPool];
          updateChannelInfo();
          showToast(`✨ Added ${newOnes.length} newly uploaded short(s)!`);
        }
      }
    }
  } catch (e) {
    // Silent fallback
  }
}

function updateChannelInfo() {
  const countEl = document.getElementById('shorts-pool-count');
  if (countEl) countEl.textContent = window.appState.shortsPool.length;
}

function escapeHtml(str) {
  return (str || '').replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => {
    toast.classList.add('hidden');
  }, 2200);
}

// Background sync for BLVCKTORQUE
syncChannelFeed(DEFAULT_CHANNEL_ID);
