/**
 * ShortsStream — Minimalist YouTube Shorts Channel Player
 */

// Presets for instant zero-config playback
const PRESET_CHANNELS = {
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
  '@TEDx': {
    name: 'TEDx Talks',
    shorts: [
      { id: '5qap5aO4i9A', title: 'How To Stop Overthinking in 3 Steps' },
      { id: 'fA8xQ6w1L8Y', title: 'The Power of Deep Work & Focus' },
      { id: 'v8s3H_v7Z9o', title: 'The Secret to Building Lasting Habits' }
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

// Application State
const state = {
  currentChannel: 'Veritasium',
  shortsQueue: [],
  currentIndex: 0,
  isPlaying: false,
  isMuted: false,
  autoAdvance: true,
  loopCurrent: false,
  ytPlayer: null,
  isPlayerReady: false,
  apiKey: localStorage.getItem('yt_shorts_api_key') || ''
};

// DOM Elements
const elements = {
  channelForm: document.getElementById('channel-form'),
  channelInput: document.getElementById('channel-input'),
  loadBtn: document.getElementById('load-btn'),
  shortsCard: document.getElementById('shorts-card'),
  playerLoader: document.getElementById('player-loader'),
  loaderStatus: document.getElementById('loader-status'),
  channelName: document.getElementById('current-channel-name'),
  channelAvatar: document.getElementById('channel-avatar-icon'),
  videoTitle: document.getElementById('current-video-title'),
  counterPill: document.getElementById('counter-pill'),
  ytExternalLink: document.getElementById('yt-external-link'),
  prevBtn: document.getElementById('prev-btn'),
  nextBtn: document.getElementById('next-btn'),
  playPauseBtn: document.getElementById('play-pause-btn'),
  playIcon: document.getElementById('play-icon'),
  pauseIcon: document.getElementById('pause-icon'),
  muteBtn: document.getElementById('mute-btn'),
  volumeIcon: document.getElementById('volume-icon'),
  mutedIcon: document.getElementById('muted-icon'),
  copyBtn: document.getElementById('copy-btn'),
  toggleQueueBtn: document.getElementById('toggle-queue-btn'),
  closeQueueBtn: document.getElementById('close-queue-btn'),
  queueDrawer: document.getElementById('queue-drawer'),
  queueList: document.getElementById('queue-list'),
  queueCount: document.getElementById('queue-count'),
  shuffleBtn: document.getElementById('shuffle-btn'),
  clearQueueBtn: document.getElementById('clear-queue-btn'),
  presetChips: document.querySelectorAll('.chip'),
  settingsBtn: document.getElementById('settings-btn'),
  settingsModal: document.getElementById('settings-modal'),
  closeSettingsBtn: document.getElementById('close-settings-btn'),
  autoAdvanceToggle: document.getElementById('auto-advance-toggle'),
  loopToggle: document.getElementById('loop-toggle'),
  apiKeyInput: document.getElementById('yt-api-key'),
  saveApiKeyBtn: document.getElementById('save-api-key-btn'),
  toast: document.getElementById('toast')
};

// Initialize YouTube Iframe API Callback
window.onYouTubeIframeAPIReady = function() {
  initPlayer();
};

function initPlayer() {
  state.ytPlayer = new YT.Player('yt-player', {
    height: '100%',
    width: '100%',
    videoId: '',
    playerVars: {
      autoplay: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      fs: 0,
      playsinline: 1,
      iv_load_policy: 3,
      disablekb: 1,
      origin: window.location.origin || 'http://localhost'
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError
    }
  });
}

function onPlayerReady(event) {
  state.isPlayerReady = true;
  // Load initial preset channel
  loadPresetChannel('@veritasium');
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.PLAYING) {
    state.isPlaying = true;
    updatePlayPauseUI();
    hideLoader();
  } else if (event.data === YT.PlayerState.PAUSED) {
    state.isPlaying = false;
    updatePlayPauseUI();
  } else if (event.data === YT.PlayerState.ENDED) {
    if (state.loopCurrent) {
      state.ytPlayer.seekTo(0);
      state.ytPlayer.playVideo();
    } else if (state.autoAdvance) {
      playNext();
    } else {
      state.isPlaying = false;
      updatePlayPauseUI();
    }
  } else if (event.data === YT.PlayerState.BUFFERING) {
    // Buffering
  }
}

function onPlayerError(event) {
  console.warn('YouTube Player Error:', event.data);
  showToast('Video restricted or unavailable. Advancing...');
  setTimeout(() => {
    if (state.shortsQueue.length > 1) {
      playNext();
    }
  }, 1200);
}

// Controls Logic
function playVideoAtIndex(index) {
  if (!state.shortsQueue.length) return;
  if (index < 0) index = 0;
  if (index >= state.shortsQueue.length) index = state.shortsQueue.length - 1;

  state.currentIndex = index;
  const currentShort = state.shortsQueue[index];

  showLoader(`Loading short ${index + 1} of ${state.shortsQueue.length}...`);

  // Update UI Elements
  elements.videoTitle.textContent = currentShort.title || 'YouTube Short';
  elements.channelName.textContent = currentShort.channel || state.currentChannel;
  elements.channelAvatar.textContent = (currentShort.channel || state.currentChannel).charAt(0).toUpperCase();
  elements.counterPill.textContent = `${index + 1} / ${state.shortsQueue.length}`;
  elements.ytExternalLink.href = `https://www.youtube.com/shorts/${currentShort.id}`;

  if (state.isPlayerReady && state.ytPlayer && state.ytPlayer.loadVideoById) {
    state.ytPlayer.loadVideoById({
      videoId: currentShort.id,
      startSeconds: 0
    });
    if (state.isMuted) {
      state.ytPlayer.mute();
    } else {
      state.ytPlayer.unMute();
    }
  }

  updateQueueActiveItem();
  updatePlayPauseUI();
}

function playNext() {
  if (state.currentIndex < state.shortsQueue.length - 1) {
    playVideoAtIndex(state.currentIndex + 1);
  } else {
    // Loop back to start if at the end
    playVideoAtIndex(0);
    showToast('Replayed from the beginning');
  }
}

function playPrev() {
  if (state.currentIndex > 0) {
    playVideoAtIndex(state.currentIndex - 1);
  } else {
    showToast('Already at the first short');
  }
}

function togglePlayPause() {
  if (!state.isPlayerReady || !state.ytPlayer) return;

  if (state.isPlaying) {
    state.ytPlayer.pauseVideo();
  } else {
    state.ytPlayer.playVideo();
  }
}

function toggleMute() {
  if (!state.isPlayerReady || !state.ytPlayer) return;
  
  if (state.isMuted) {
    state.ytPlayer.unMute();
    state.isMuted = false;
    elements.volumeIcon.classList.remove('hidden');
    elements.mutedIcon.classList.add('hidden');
    showToast('Unmuted');
  } else {
    state.ytPlayer.mute();
    state.isMuted = true;
    elements.volumeIcon.classList.add('hidden');
    elements.mutedIcon.classList.remove('hidden');
    showToast('Muted');
  }
}

function updatePlayPauseUI() {
  if (state.isPlaying) {
    elements.playIcon.classList.add('hidden');
    elements.pauseIcon.classList.remove('hidden');
  } else {
    elements.playIcon.classList.remove('hidden');
    elements.pauseIcon.classList.add('hidden');
  }
}

function showLoader(text = 'Loading...') {
  elements.loaderStatus.textContent = text;
  elements.playerLoader.classList.remove('hidden');
}

function hideLoader() {
  elements.playerLoader.classList.add('hidden');
}

// Queue Rendering
function renderQueue() {
  elements.queueList.innerHTML = '';
  elements.queueCount.textContent = state.shortsQueue.length;

  state.shortsQueue.forEach((short, idx) => {
    const item = document.createElement('div');
    item.className = `queue-item ${idx === state.currentIndex ? 'active' : ''}`;
    item.dataset.index = idx;
    
    const thumbUrl = `https://i.ytimg.com/vi/${short.id}/hqdefault.jpg`;

    item.innerHTML = `
      <img src="${thumbUrl}" class="queue-thumb" alt="thumbnail" loading="lazy">
      <div class="queue-meta">
        <h4 class="queue-item-title">${escapeHTML(short.title || 'YouTube Short')}</h4>
        <span class="queue-item-channel">${escapeHTML(short.channel || state.currentChannel)}</span>
      </div>
    `;

    item.addEventListener('click', () => {
      playVideoAtIndex(idx);
    });

    elements.queueList.appendChild(item);
  });
}

function updateQueueActiveItem() {
  const items = elements.queueList.querySelectorAll('.queue-item');
  items.forEach((item, idx) => {
    if (idx === state.currentIndex) {
      item.classList.add('active');
      item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      item.classList.remove('active');
    }
  });
}

// URL Parsing and Loading
async function handleChannelInput(inputStr) {
  inputStr = inputStr.trim();
  if (!inputStr) return;

  showLoader('Resolving channel & shorts...');

  // 1. Check if user pasted a direct Short URL or standard Watch URL
  const directVideoId = extractVideoId(inputStr);
  if (directVideoId) {
    const customShort = {
      id: directVideoId,
      title: 'Direct Short / Video',
      channel: 'Custom Video'
    };
    state.shortsQueue = [customShort, ...state.shortsQueue];
    state.currentChannel = 'Custom Queue';
    renderQueue();
    playVideoAtIndex(0);
    showToast('Short added to queue!');
    return;
  }

  // 2. Normalize channel handle / name
  let cleanHandle = inputStr;
  const handleMatch = inputStr.match(/(?:youtube\.com\/|@)(@?[\w.-]+)/i);
  if (handleMatch) {
    cleanHandle = handleMatch[1].startsWith('@') ? handleMatch[1] : '@' + handleMatch[1];
  } else if (!cleanHandle.startsWith('@') && !cleanHandle.includes('/')) {
    cleanHandle = '@' + cleanHandle;
  }

  // 3. Check preset cache first
  const normalizedKey = Object.keys(PRESET_CHANNELS).find(
    k => k.toLowerCase() === cleanHandle.toLowerCase()
  );

  if (normalizedKey) {
    loadPresetChannel(normalizedKey);
    return;
  }

  // 4. If custom channel and user has an API Key
  if (state.apiKey) {
    const fetched = await fetchViaYouTubeAPI(cleanHandle);
    if (fetched) return;
  }

  // 5. Try live public RSS feed scraper
  const rssFetched = await fetchViaPublicRSS(cleanHandle);
  if (rssFetched) return;

  // Fallback if not directly resolvable via CORS
  hideLoader();
  showToast(`Could not auto-fetch ${cleanHandle}. Paste direct shorts links or add YouTube API key!`);
}

function loadPresetChannel(handleKey) {
  const preset = PRESET_CHANNELS[handleKey];
  if (!preset) return;

  state.currentChannel = preset.name;
  state.shortsQueue = preset.shorts.map(s => ({
    ...s,
    channel: preset.name
  }));

  // Update active pill styling
  elements.presetChips.forEach(chip => {
    if (chip.dataset.channel.toLowerCase() === handleKey.toLowerCase()) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  renderQueue();
  playVideoAtIndex(0);
}

// Fetch YouTube Data API v3 (when user supplies optional API key in settings)
async function fetchViaYouTubeAPI(handleOrId) {
  try {
    showLoader('Querying YouTube API...');
    const searchChannelUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(handleOrId)}&type=channel&key=${state.apiKey}`;
    const channelRes = await fetch(searchChannelUrl);
    const channelData = await channelRes.json();

    if (!channelData.items || !channelData.items.length) {
      return false;
    }

    const channelId = channelData.items[0].id.channelId;
    const channelTitle = channelData.items[0].snippet.title;

    // Fetch shorts (duration=short)
    const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&videoDuration=short&order=date&maxResults=20&key=${state.apiKey}`;
    const videosRes = await fetch(videosUrl);
    const videosData = await videosRes.json();

    if (videosData.items && videosData.items.length) {
      state.currentChannel = channelTitle;
      state.shortsQueue = videosData.items.map(item => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: channelTitle
      }));
      renderQueue();
      playVideoAtIndex(0);
      showToast(`Loaded ${state.shortsQueue.length} shorts from ${channelTitle}`);
      return true;
    }
  } catch (err) {
    console.error('YouTube API error:', err);
  }
  return false;
}

// Fetch using public RSS-to-JSON proxies
async function fetchViaPublicRSS(handleOrId) {
  try {
    showLoader('Discovering channel feed...');
    // Attempt with rss2json
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/${handleOrId}/shorts`)}`;
    const res = await fetch(proxyUrl);
    const data = await res.json();

    if (data.contents) {
      // Extract video IDs from the channel HTML
      const matches = [...data.contents.matchAll(/\/shorts\/([a-zA-Z0-9_-]{11})/g)];
      const uniqueIds = Array.from(new Set(matches.map(m => m[1])));

      if (uniqueIds.length > 0) {
        state.currentChannel = handleOrId;
        state.shortsQueue = uniqueIds.slice(0, 15).map((id, i) => ({
          id: id,
          title: `Short #${i + 1}`,
          channel: handleOrId
        }));
        renderQueue();
        playVideoAtIndex(0);
        showToast(`Loaded ${state.shortsQueue.length} shorts for ${handleOrId}!`);
        return true;
      }
    }
  } catch (e) {
    console.warn('CORS / RSS fallback failed:', e);
  }
  return false;
}

function extractVideoId(url) {
  // Matches /shorts/ID, /watch?v=ID, youtu.be/ID
  const shortsRegex = /\/shorts\/([a-zA-Z0-9_-]{11})/;
  const watchRegex = /[?&]v=([a-zA-Z0-9_-]{11})/;
  const shareRegex = /youtu\.be\/([a-zA-Z0-9_-]{11})/;
  const rawIdRegex = /^[a-zA-Z0-9_-]{11}$/;

  let m = url.match(shortsRegex) || url.match(watchRegex) || url.match(shareRegex);
  if (m) return m[1];
  if (rawIdRegex.test(url)) return url;
  return null;
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
  );
}

function showToast(msg) {
  elements.toast.textContent = msg;
  elements.toast.classList.remove('hidden');
  clearTimeout(elements.toastTimeout);
  elements.toastTimeout = setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 2400);
}

// Event Listeners
function setupEventListeners() {
  // Channel form submit
  elements.channelForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleChannelInput(elements.channelInput.value);
  });

  // Preset chips
  elements.presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const channel = chip.dataset.channel;
      loadPresetChannel(channel);
    });
  });

  // Navigation Buttons
  elements.nextBtn.addEventListener('click', playNext);
  elements.prevBtn.addEventListener('click', playPrev);
  elements.playPauseBtn.addEventListener('click', togglePlayPause);
  elements.muteBtn.addEventListener('click', toggleMute);

  // Copy Short URL
  elements.copyBtn.addEventListener('click', () => {
    if (!state.shortsQueue.length) return;
    const current = state.shortsQueue[state.currentIndex];
    const url = `https://www.youtube.com/shorts/${current.id}`;
    navigator.clipboard.writeText(url).then(() => {
      showToast('Copied short URL to clipboard!');
    }).catch(() => {
      showToast('Failed to copy link');
    });
  });

  // Queue Drawer Toggle
  elements.toggleQueueBtn.addEventListener('click', () => {
    elements.queueDrawer.classList.toggle('open');
  });

  elements.closeQueueBtn.addEventListener('click', () => {
    elements.queueDrawer.classList.remove('open');
  });

  // Shuffle Queue
  elements.shuffleBtn.addEventListener('click', () => {
    if (state.shortsQueue.length <= 1) return;
    const current = state.shortsQueue[state.currentIndex];
    const rest = state.shortsQueue.filter((_, i) => i !== state.currentIndex);
    
    // Fisher-Yates shuffle
    for (let i = rest.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rest[i], rest[j]] = [rest[j], rest[i]];
    }

    state.shortsQueue = [current, ...rest];
    state.currentIndex = 0;
    renderQueue();
    showToast('Queue shuffled');
  });

  // Clear Queue
  elements.clearQueueBtn.addEventListener('click', () => {
    if (confirm('Clear the current shorts queue?')) {
      state.shortsQueue = [];
      state.currentIndex = 0;
      renderQueue();
      elements.videoTitle.textContent = 'Queue is empty';
      elements.channelName.textContent = 'None';
      elements.counterPill.textContent = '0 / 0';
      if (state.ytPlayer && state.ytPlayer.stopVideo) {
        state.ytPlayer.stopVideo();
      }
      showToast('Queue cleared');
    }
  });

  // Keyboard Shortcuts (Arrow Up/Down, J/K, Space, M)
  window.addEventListener('keydown', (e) => {
    // Avoid capturing inputs when typing in search or API key field
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (e.key === 'ArrowDown' || e.key.toLowerCase() === 'j') {
      e.preventDefault();
      playNext();
    } else if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'k') {
      e.preventDefault();
      playPrev();
    } else if (e.key === ' ' || e.code === 'Space') {
      e.preventDefault();
      togglePlayPause();
    } else if (e.key.toLowerCase() === 'm') {
      e.preventDefault();
      toggleMute();
    }
  });

  // Mouse Wheel Debounced Scroll over player
  let wheelTimeout = null;
  elements.shortsCard.addEventListener('wheel', (e) => {
    e.preventDefault();
    if (wheelTimeout) return;
    
    if (e.deltaY > 20) {
      playNext();
    } else if (e.deltaY < -20) {
      playPrev();
    }
    
    wheelTimeout = setTimeout(() => {
      wheelTimeout = null;
    }, 600);
  }, { passive: false });

  // Touch Swipe for mobile/tablets
  let touchStartY = 0;
  elements.shortsCard.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  elements.shortsCard.addEventListener('touchend', (e) => {
    const touchEndY = e.changedTouches[0].screenY;
    const diff = touchStartY - touchEndY;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        // Swiped up -> Next
        playNext();
      } else {
        // Swiped down -> Prev
        playPrev();
      }
    }
  }, { passive: true });

  // Settings Modal
  elements.settingsBtn.addEventListener('click', () => {
    elements.settingsModal.classList.remove('hidden');
    if (state.apiKey) elements.apiKeyInput.value = state.apiKey;
  });

  elements.closeSettingsBtn.addEventListener('click', () => {
    elements.settingsModal.classList.add('hidden');
  });

  elements.settingsModal.addEventListener('click', (e) => {
    if (e.target === elements.settingsModal) {
      elements.settingsModal.classList.add('hidden');
    }
  });

  elements.autoAdvanceToggle.addEventListener('change', (e) => {
    state.autoAdvance = e.target.checked;
    if (state.autoAdvance) {
      elements.loopToggle.checked = false;
      state.loopCurrent = false;
    }
  });

  elements.loopToggle.addEventListener('change', (e) => {
    state.loopCurrent = e.target.checked;
    if (state.loopCurrent) {
      elements.autoAdvanceToggle.checked = false;
      state.autoAdvance = false;
    }
  });

  elements.saveApiKeyBtn.addEventListener('click', () => {
    const key = elements.apiKeyInput.value.trim();
    state.apiKey = key;
    localStorage.setItem('yt_shorts_api_key', key);
    showToast('API Key saved!');
    elements.settingsModal.classList.add('hidden');
  });
}

// Kickoff
setupEventListeners();
