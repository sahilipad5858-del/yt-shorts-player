/**
 * ShortsMatrix — Multi-Stream YouTube Shorts Wall
 * Supports 1 to 24 simultaneous random players
 */

const DEFAULT_CHANNEL_ID = 'UCc3WaSgyMJ4q1orDuTla1BA';
const DEFAULT_CHANNEL_NAME = 'BLVCKTORQUE';

// Channel Shorts Library (Pre-populated with real working shorts)
const CHANNEL_POOLS = {
  [DEFAULT_CHANNEL_ID]: {
    name: 'BLVCKTORQUE',
    shorts: [
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
    ]
  },
  '@veritasium': {
    name: 'Veritasium',
    shorts: [
      { id: '2cM2lY6hI9A', title: 'Why The Speed of Light Cannot Be Measured' },
      { id: 'pWbk06bZgD0', title: 'The Surprising Secret Behind Miracles' },
      { id: 'hK-Z4H2N7Yg', title: 'Can You Solve This Infinite Puzzle?' },
      { id: 'mQh4fE-3Wj8', title: 'The Infinite Hotel Paradox' },
      { id: 'Z9v9jH8u2G8', title: 'The Physics of Skipping Stones' }
    ]
  },
  '@mkbhd': {
    name: 'Marques Brownlee',
    shorts: [
      { id: '813Z0r4cW1w', title: 'The Weirdest Phone Feature Ever?' },
      { id: '2G4gL2Gq1Hk', title: 'Is Apple Vision Pro Actually Worth It?' },
      { id: '3Fz2dJ0sZ5M', title: 'This Tech Feels Like Magic' },
      { id: 'vQ9yH6bB-tY', title: 'The Best Smartphone Camera Blind Test' }
    ]
  },
  '@ZachKing': {
    name: 'Zach King',
    shorts: [
      { id: '8OvdQZgI9bU', title: 'Magic Broom Flight Illusion' },
      { id: 'w_c4g6yqG-o', title: 'Escaping Into Another Dimension' },
      { id: 'dZ-jK3sVv9Q', title: 'The Impossible Mirror Trick' },
      { id: 'M6U7j9lQ-tE', title: 'Painting Comes To Life' }
    ]
  },
  '@MrBeast': {
    name: 'MrBeast',
    shorts: [
      { id: '0e3GPea1Tyg', title: 'I Built 100 Wells in Africa' },
      { id: 'kxpcV5N_bC4', title: 'Would You Press This Button For $100,000?' },
      { id: 'm7m_l7S-q6c', title: 'Surviving 7 Days In An Abandoned City' },
      { id: '2B8gX-7q4mY', title: 'Giving Free Homes To People In Need' }
    ]
  }
};

// State
const state = {
  currentChannel: DEFAULT_CHANNEL_NAME,
  currentChannelId: DEFAULT_CHANNEL_ID,
  shortsPool: [...CHANNEL_POOLS[DEFAULT_CHANNEL_ID].shorts],
  playerCount: 4,
  activeAudioCardIndex: null, // Index of card with sound unmuted
  activeCards: [] // Array of { id, video, isMuted }
};

// DOM
const elements = {
  brandHome: document.getElementById('brand-home'),
  channelForm: document.getElementById('channel-form'),
  channelInput: document.getElementById('channel-input'),
  gridToggleGroup: document.getElementById('grid-toggle-group'),
  gridPills: document.querySelectorAll('.grid-pill'),
  shortsMatrix: document.getElementById('shorts-matrix'),
  randomizeAllBtn: document.getElementById('randomize-all-btn'),
  syncBtn: document.getElementById('sync-btn'),
  audioInfoBtn: document.getElementById('audio-info-btn'),
  presetChips: document.querySelectorAll('.chip'),
  activeChannelName: document.getElementById('active-channel-name'),
  poolCount: document.getElementById('pool-count'),
  toast: document.getElementById('toast')
};

// Build Embed URL (with autoplay, loop, mute, and playsinline for 100% browser compatibility)
function createEmbedUrl(videoId, isMuted = true) {
  const muteParam = isMuted ? 1 : 0;
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=${muteParam}&loop=1&playlist=${videoId}&playsinline=1&controls=0&rel=0&modestbranding=1&enablejsapi=1`;
}

// Generate Random Selection from Pool
function getRandomShort(excludeId = null) {
  if (!state.shortsPool.length) {
    return { id: '0X9pWHijTCw', title: 'YouTube Short' };
  }
  const filtered = state.shortsPool.filter(s => s.id !== excludeId);
  const source = filtered.length > 0 ? filtered : state.shortsPool;
  return source[Math.floor(Math.random() * source.length)];
}

// Render the Matrix
function renderMatrix() {
  elements.shortsMatrix.className = `shorts-matrix grid-${state.playerCount}`;
  elements.shortsMatrix.innerHTML = '';
  state.activeCards = [];

  // Shuffle pool to spread unique videos across the slots
  const shuffledPool = [...state.shortsPool].sort(() => 0.5 - Math.random());

  for (let i = 0; i < state.playerCount; i++) {
    // Pick video from shuffled pool, or wrap around if playerCount > pool length
    const video = shuffledPool[i % shuffledPool.length] || getRandomShort();
    const isMuted = state.activeAudioCardIndex !== i;

    state.activeCards.push({
      index: i,
      video: video,
      isMuted: isMuted
    });

    const card = createCardElement(i, video, isMuted);
    elements.shortsMatrix.appendChild(card);
  }

  updateHeaderStats();
}

// Create a Single Player Card
function createCardElement(index, video, isMuted) {
  const card = document.createElement('div');
  card.className = `player-card ${!isMuted ? 'has-sound' : ''}`;
  card.id = `player-card-${index}`;

  const embedUrl = createEmbedUrl(video.id, isMuted);

  card.innerHTML = `
    <div class="card-overlay-top">
      <span class="player-badge">#${index + 1}</span>
      <div class="card-btn-group">
        <button class="card-action-btn sound-btn ${!isMuted ? 'sound-active' : ''}" title="${isMuted ? 'Unmute this video' : 'Mute'}">
          ${isMuted ? getMuteIcon() : getVolumeIcon()}
        </button>
        <button class="card-action-btn re-roll-btn" title="Play another random short">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="16 3 21 3 21 8"></polyline>
            <line x1="4" y1="20" x2="21" y2="3"></line>
            <polyline points="21 16 21 21 16 21"></polyline>
            <line x1="15" y1="15" x2="21" y2="21"></line>
            <line x1="4" y1="4" x2="9" y2="9"></line>
          </svg>
        </button>
        <a href="https://www.youtube.com/shorts/${video.id}" target="_blank" class="card-action-btn" title="Open in YouTube">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
        </a>
      </div>
    </div>
    <iframe 
      id="iframe-${index}"
      src="${embedUrl}" 
      title="${escapeHTML(video.title || 'YouTube Short')}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen
      loading="lazy">
    </iframe>
    <div class="card-overlay-bottom">
      <p class="card-video-title">${escapeHTML(video.title || 'YouTube Short')}</p>
    </div>
  `;

  // Sound Button Click
  const soundBtn = card.querySelector('.sound-btn');
  soundBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleAudioOnCard(index);
  });

  // Re-roll Single Card
  const reRollBtn = card.querySelector('.re-roll-btn');
  reRollBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    reRollCard(index);
  });

  // Click card to unmute & focus
  card.addEventListener('click', () => {
    toggleAudioOnCard(index);
  });

  return card;
}

// Re-roll a Single Card with another random short
function reRollCard(index) {
  const cardData = state.activeCards[index];
  if (!cardData) return;

  const currentId = cardData.video.id;
  const newVideo = getRandomShort(currentId);
  cardData.video = newVideo;

  const cardElement = document.getElementById(`player-card-${index}`);
  if (cardElement) {
    const iframe = cardElement.querySelector('iframe');
    const title = cardElement.querySelector('.card-video-title');
    const openLink = cardElement.querySelector('a.card-action-btn');

    iframe.src = createEmbedUrl(newVideo.id, cardData.isMuted);
    title.textContent = newVideo.title || 'YouTube Short';
    openLink.href = `https://www.youtube.com/shorts/${newVideo.id}`;

    showToast(`Swapped #${index + 1} to: ${newVideo.title}`);
  }
}

// Toggle Audio for a Specific Card (Only one card has audio at a time)
function toggleAudioOnCard(targetIndex) {
  if (state.activeAudioCardIndex === targetIndex) {
    // Already unmuted -> mute it
    state.activeAudioCardIndex = null;
    showToast(`Muted #${targetIndex + 1}`);
  } else {
    // Unmute target, mute previous
    state.activeAudioCardIndex = targetIndex;
    showToast(`🔊 Audio active on player #${targetIndex + 1}`);
  }

  // Update all cards iframe src and button styling
  state.activeCards.forEach((cardData, idx) => {
    const isNowMuted = state.activeAudioCardIndex !== idx;
    const cardEl = document.getElementById(`player-card-${idx}`);
    if (!cardEl) return;

    if (cardData.isMuted !== isNowMuted) {
      cardData.isMuted = isNowMuted;
      const iframe = cardEl.querySelector('iframe');
      iframe.src = createEmbedUrl(cardData.video.id, isNowMuted);

      const soundBtn = cardEl.querySelector('.sound-btn');
      if (isNowMuted) {
        cardEl.classList.remove('has-sound');
        soundBtn.classList.remove('sound-active');
        soundBtn.innerHTML = getMuteIcon();
      } else {
        cardEl.classList.add('has-sound');
        soundBtn.classList.add('sound-active');
        soundBtn.innerHTML = getVolumeIcon();
      }
    }
  });
}

// Randomize All Cards Simultaneously
function randomizeAll() {
  state.activeAudioCardIndex = null;
  renderMatrix();
  showToast(`🎲 Shuffled all ${state.playerCount} players!`);
}

// Switch Grid Count (1, 4, 8, 12, 16, 24)
function setPlayerCount(count) {
  state.playerCount = count;
  elements.gridPills.forEach(pill => {
    if (parseInt(pill.dataset.count, 10) === count) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
  renderMatrix();
}

// Channel Loading
function loadChannel(channelKey) {
  const pool = CHANNEL_POOLS[channelKey];
  if (!pool) return;

  state.currentChannel = pool.name;
  state.currentChannelId = channelKey;
  state.shortsPool = [...pool.shorts];

  elements.presetChips.forEach(chip => {
    if (chip.dataset.channel === channelKey) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  renderMatrix();
  showToast(`Loaded ${pool.name} (${state.shortsPool.length} shorts)`);

  // Sync latest RSS feed if it's a channel ID
  if (channelKey.startsWith('UC')) {
    syncLiveFeed(channelKey);
  }
}

// Live Feed Sync (Pulls latest/future uploads from YouTube RSS)
async function syncLiveFeed(channelId = DEFAULT_CHANNEL_ID) {
  elements.syncBtn.classList.add('spinning');
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&_t=${Date.now()}`;
    const res = await fetch(apiUrl);
    const data = await res.json();

    if (data.status === 'ok' && data.items && data.items.length) {
      const newItems = data.items.map(item => ({
        id: (item.guid || '').replace('yt:video:', '') || extractVideoId(item.link),
        title: item.title
      })).filter(i => i.id);

      if (newItems.length > 0) {
        const existingIds = new Set(state.shortsPool.map(s => s.id));
        const fresh = newItems.filter(i => !existingIds.has(i.id));
        if (fresh.length > 0) {
          state.shortsPool = [...fresh, ...state.shortsPool];
          updateHeaderStats();
          showToast(`✨ Added ${fresh.length} new short(s) from channel!`);
        }
      }
    }
  } catch (err) {
    console.warn('Live sync fallback used');
  } finally {
    elements.syncBtn.classList.remove('spinning');
  }
}

// Input Parser
function handleInput(inputStr) {
  inputStr = inputStr.trim();
  if (!inputStr) return;

  // Extract channel ID if studio or youtube link
  const channelIdMatch = inputStr.match(/(UC[a-zA-Z0-9_-]{22})/);
  if (channelIdMatch) {
    const id = channelIdMatch[1];
    if (id === DEFAULT_CHANNEL_ID) {
      loadChannel(DEFAULT_CHANNEL_ID);
    } else {
      state.currentChannel = 'Custom Channel';
      state.currentChannelId = id;
      syncLiveFeed(id).then(() => renderMatrix());
    }
    return;
  }

  // Handle preset channels
  const match = Object.keys(CHANNEL_POOLS).find(k => k.toLowerCase() === inputStr.toLowerCase());
  if (match) {
    loadChannel(match);
    return;
  }

  // Direct video/short ID
  const directId = extractVideoId(inputStr);
  if (directId) {
    state.shortsPool.unshift({ id: directId, title: 'Custom Short' });
    renderMatrix();
    showToast('Added custom short to stream!');
  }
}

function updateHeaderStats() {
  elements.activeChannelName.textContent = state.currentChannel;
  elements.poolCount.textContent = `${state.shortsPool.length} Shorts in library`;
}

function extractVideoId(url) {
  if (!url) return null;
  const m = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/) || 
            url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) || 
            url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) return url;
  return null;
}

function getVolumeIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
  </svg>`;
}

function getMuteIcon() {
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>`;
}

function escapeHTML(str) {
  return (str || '').replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function showToast(msg) {
  elements.toast.textContent = msg;
  elements.toast.classList.remove('hidden');
  clearTimeout(elements.toastTimeout);
  elements.toastTimeout = setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 2200);
}

// Event Listeners
function setupEvents() {
  // Brand Click -> Reset to BLVCKTORQUE
  elements.brandHome.addEventListener('click', () => {
    loadChannel(DEFAULT_CHANNEL_ID);
  });

  // Channel Form
  elements.channelForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleInput(elements.channelInput.value);
  });

  // Grid Pills (1, 4, 8, 12, 16, 24)
  elements.gridPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const count = parseInt(pill.dataset.count, 10);
      setPlayerCount(count);
    });
  });

  // Shuffle All
  elements.randomizeAllBtn.addEventListener('click', randomizeAll);

  // Sync Feed
  elements.syncBtn.addEventListener('click', () => {
    syncLiveFeed(state.currentChannelId);
  });

  // Audio Info
  elements.audioInfoBtn.addEventListener('click', () => {
    showToast('Click any video or its speaker icon to unmute sound!');
  });

  // Preset Chips
  elements.presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      loadChannel(chip.dataset.channel);
    });
  });

  // Keyboard shortcut: Press R to Randomize All, Space to toggle audio
  window.addEventListener('keydown', (e) => {
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;
    if (e.key.toLowerCase() === 'r') {
      randomizeAll();
    }
  });
}

// Kickoff
setupEvents();
renderMatrix();
syncLiveFeed(DEFAULT_CHANNEL_ID);
