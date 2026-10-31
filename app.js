/**
 * ShortsStream — YouTube Shorts Player
 * Configured with BLVCKTORQUE (UCc3WaSgyMJ4q1orDuTla1BA) live sync support
 */

const DEFAULT_CHANNEL_ID = 'UCc3WaSgyMJ4q1orDuTla1BA';
const DEFAULT_CHANNEL_NAME = 'BLVCKTORQUE';

// Curated Channel Presets (Includes full BLVCKTORQUE library for instant zero-latency start)
const PRESET_CHANNELS = {
  [DEFAULT_CHANNEL_ID]: {
    name: 'BLVCKTORQUE',
    channelId: DEFAULT_CHANNEL_ID,
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

// Application State
const state = {
  currentChannel: DEFAULT_CHANNEL_NAME,
  currentChannelId: DEFAULT_CHANNEL_ID,
  shortsQueue: [],
  currentIndex: 0,
  isPlaying: false,
  isMuted: false,
  autoAdvance: true,
  loopCurrent: false,
  autoSync: true,
  ytPlayer: null,
  isPlayerReady: false,
  apiKey: localStorage.getItem('yt_shorts_api_key') || ''
};

// DOM Elements
const elements = {
  brandHome: document.getElementById('brand-home'),
  channelForm: document.getElementById('channel-form'),
  channelInput: document.getElementById('channel-input'),
  loadBtn: document.getElementById('load-btn'),
  syncBtn: document.getElementById('sync-btn'),
  syncQueueBtn: document.getElementById('sync-queue-btn'),
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
  queueHeaderTitle: document.getElementById('queue-header-title'),
  shuffleBtn: document.getElementById('shuffle-btn'),
  clearQueueBtn: document.getElementById('clear-queue-btn'),
  presetChips: document.querySelectorAll('.chip'),
  settingsBtn: document.getElementById('settings-btn'),
  settingsModal: document.getElementById('settings-modal'),
  closeSettingsBtn: document.getElementById('close-settings-btn'),
  autoAdvanceToggle: document.getElementById('auto-advance-toggle'),
  loopToggle: document.getElementById('loop-toggle'),
  autoSyncToggle: document.getElementById('auto-sync-toggle'),
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
  // Load BLVCKTORQUE channel by default
  loadDefaultChannel();
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
  }
}

function onPlayerError(event) {
  console.warn('YouTube Player Error:', event.data);
  showToast('Short playback issue. Skipping to next...');
  setTimeout(() => {
    if (state.shortsQueue.length > 1) {
      playNext();
    }
  }, 1000);
}

// Playback Logic
function playVideoAtIndex(index) {
  if (!state.shortsQueue.length) return;
  if (index < 0) index = 0;
  if (index >= state.shortsQueue.length) index = state.shortsQueue.length - 1;

  state.currentIndex = index;
  const currentShort = state.shortsQueue[index];

  showLoader(`Loading ${index + 1} of ${state.shortsQueue.length}...`);

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
    // Loop back to beginning
    playVideoAtIndex(0);
    showToast('Replaying from beginning');
  }
}

function playPrev() {
  if (state.currentIndex > 0) {
    playVideoAtIndex(state.currentIndex - 1);
  } else {
    showToast('Already at first short');
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
  elements.queueHeaderTitle.textContent = `${state.currentChannel} Shorts`;

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

// Default Channel Loader (BLVCKTORQUE)
function loadDefaultChannel() {
  state.currentChannel = DEFAULT_CHANNEL_NAME;
  state.currentChannelId = DEFAULT_CHANNEL_ID;

  // 1. Instantly populate pre-cached shorts for zero waiting time
  const preset = PRESET_CHANNELS[DEFAULT_CHANNEL_ID];
  state.shortsQueue = preset.shorts.map(s => ({ ...s, channel: DEFAULT_CHANNEL_NAME }));
  
  elements.presetChips.forEach(chip => {
    if (chip.dataset.channel === DEFAULT_CHANNEL_ID) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  renderQueue();
  playVideoAtIndex(0);

  // 2. Fetch live RSS feed to check for any new uploads published in the future
  syncChannelFeed(DEFAULT_CHANNEL_ID, true);
}

// Live Channel Feed Sync (Fetches new uploads dynamically)
async function syncChannelFeed(channelId, isSilent = false) {
  if (!channelId) channelId = state.currentChannelId || DEFAULT_CHANNEL_ID;

  elements.syncBtn.classList.add('spinning');
  if (!isSilent) showToast('Syncing latest uploads from YouTube...');

  try {
    let newItems = [];

    // Attempt 1: Fetch through rss2json
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}&_t=${Date.now()}`;
    
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      if (data.status === 'ok' && data.items && data.items.length) {
        newItems = data.items.map(item => {
          const videoId = extractVideoId(item.link) || (item.guid ? item.guid.replace('yt:video:', '') : '');
          return {
            id: videoId,
            title: item.title,
            channel: data.feed ? data.feed.title || state.currentChannel : state.currentChannel
          };
        }).filter(item => item.id);
      }
    } catch (e) {
      console.warn('rss2json failed, trying allorigins fallback:', e);
    }

    // Attempt 2: Allorigins fallback if rss2json had issues
    if (!newItems.length) {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
      const res = await fetch(proxyUrl);
      const data = await res.json();
      if (data.contents) {
        const matches = [...data.contents.matchAll(/<yt:videoId>(.*?)<\/yt:videoId>[\s\S]*?<title>(.*?)<\/title>/g)];
        newItems = matches.map(m => ({
          id: m[1],
          title: decodeHTMLEntities(m[2]),
          channel: state.currentChannel
        }));
      }
    }

    // Merge new items with current queue, placing newest on top without duplicates
    if (newItems.length > 0) {
      const existingIds = new Set(state.shortsQueue.map(s => s.id));
      const freshUploads = newItems.filter(item => !existingIds.has(item.id));

      if (freshUploads.length > 0) {
        state.shortsQueue = [...freshUploads, ...state.shortsQueue];
        renderQueue();
        showToast(`✨ Found ${freshUploads.length} new short(s) uploaded!`);
      } else if (!isSilent) {
        showToast('Feed is already up to date!');
      }
    }
  } catch (err) {
    console.error('Sync failed:', err);
    if (!isSilent) showToast('Sync completed (cached queue ready)');
  } finally {
    elements.syncBtn.classList.remove('spinning');
  }
}

// Input parsing (Channel URL, Studio URL, Handle, or Short link)
async function handleChannelInput(inputStr) {
  inputStr = inputStr.trim();
  if (!inputStr) return;

  showLoader('Resolving channel & shorts...');

  // 1. Direct Short or Watch URL / Video ID
  const directVideoId = extractVideoId(inputStr);
  if (directVideoId && !inputStr.includes('/channel/') && !inputStr.includes('studio.youtube.com')) {
    const customShort = {
      id: directVideoId,
      title: 'Direct Short / Video',
      channel: 'Custom Video'
    };
    state.shortsQueue = [customShort, ...state.shortsQueue];
    renderQueue();
    playVideoAtIndex(0);
    showToast('Short added to queue!');
    return;
  }

  // 2. Extract Channel ID if it's studio.youtube.com/channel/UC... or youtube.com/channel/UC...
  const channelIdMatch = inputStr.match(/(UC[a-zA-Z0-9_-]{22})/);
  if (channelIdMatch) {
    const channelId = channelIdMatch[1];
    state.currentChannelId = channelId;
    if (channelId === DEFAULT_CHANNEL_ID) {
      loadDefaultChannel();
    } else {
      state.currentChannel = 'YouTube Channel';
      state.shortsQueue = [];
      renderQueue();
      await syncChannelFeed(channelId, false);
      if (state.shortsQueue.length > 0) {
        playVideoAtIndex(0);
      }
    }
    return;
  }

  // 3. Normalize @handle or channel name
  let cleanHandle = inputStr;
  const handleMatch = inputStr.match(/(?:youtube\.com\/|@)(@?[\w.-]+)/i);
  if (handleMatch) {
    cleanHandle = handleMatch[1].startsWith('@') ? handleMatch[1] : '@' + handleMatch[1];
  } else if (!cleanHandle.startsWith('@') && !cleanHandle.includes('/')) {
    cleanHandle = '@' + cleanHandle;
  }

  // Check preset channels
  const presetKey = Object.keys(PRESET_CHANNELS).find(
    k => k.toLowerCase() === cleanHandle.toLowerCase()
  );

  if (presetKey) {
    loadPresetChannel(presetKey);
    return;
  }

  // API Key fetch if available
  if (state.apiKey) {
    const fetched = await fetchViaYouTubeAPI(cleanHandle);
    if (fetched) return;
  }

  // Fallback RSS scraper
  const rssFetched = await fetchViaPublicRSS(cleanHandle);
  if (rssFetched) return;

  hideLoader();
  showToast(`Could not load ${cleanHandle}. Try pasting channel ID or a short link!`);
}

function loadPresetChannel(handleKey) {
  const preset = PRESET_CHANNELS[handleKey];
  if (!preset) return;

  state.currentChannel = preset.name;
  state.currentChannelId = preset.channelId || null;
  state.shortsQueue = preset.shorts.map(s => ({ ...s, channel: preset.name }));

  elements.presetChips.forEach(chip => {
    if (chip.dataset.channel.toLowerCase() === handleKey.toLowerCase()) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  renderQueue();
  playVideoAtIndex(0);

  if (preset.channelId) {
    syncChannelFeed(preset.channelId, true);
  }
}

// Fetch YouTube Data API v3 (Optional)
async function fetchViaYouTubeAPI(handleOrId) {
  try {
    showLoader('Querying YouTube API...');
    const searchChannelUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(handleOrId)}&type=channel&key=${state.apiKey}`;
    const channelRes = await fetch(searchChannelUrl);
    const channelData = await channelRes.json();

    if (!channelData.items || !channelData.items.length) return false;

    const channelId = channelData.items[0].id.channelId;
    const channelTitle = channelData.items[0].snippet.title;

    const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&videoDuration=short&order=date&maxResults=25&key=${state.apiKey}`;
    const videosRes = await fetch(videosUrl);
    const videosData = await videosRes.json();

    if (videosData.items && videosData.items.length) {
      state.currentChannel = channelTitle;
      state.currentChannelId = channelId;
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

// Fallback HTML Scraper via proxy
async function fetchViaPublicRSS(handleOrId) {
  try {
    showLoader('Discovering channel feed...');
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(`https://www.youtube.com/${handleOrId}/shorts`)}`;
    const res = await fetch(proxyUrl);
    const data = await res.json();

    if (data.contents) {
      const matches = [...data.contents.matchAll(/\/shorts\/([a-zA-Z0-9_-]{11})/g)];
      const uniqueIds = Array.from(new Set(matches.map(m => m[1])));

      if (uniqueIds.length > 0) {
        state.currentChannel = handleOrId;
        state.shortsQueue = uniqueIds.slice(0, 20).map((id, i) => ({
          id: id,
          title: `Short #${i + 1}`,
          channel: handleOrId
        }));
        renderQueue();
        playVideoAtIndex(0);
        showToast(`Loaded ${state.shortsQueue.length} shorts for ${handleOrId}`);
        return true;
      }
    }
  } catch (e) {
    console.warn('Public RSS fallback failed:', e);
  }
  return false;
}

function extractVideoId(url) {
  if (!url) return null;
  const shortsRegex = /\/shorts\/([a-zA-Z0-9_-]{11})/;
  const watchRegex = /[?&]v=([a-zA-Z0-9_-]{11})/;
  const shareRegex = /youtu\.be\/([a-zA-Z0-9_-]{11})/;
  const rawIdRegex = /^[a-zA-Z0-9_-]{11}$/;

  let m = url.match(shortsRegex) || url.match(watchRegex) || url.match(shareRegex);
  if (m) return m[1];
  if (rawIdRegex.test(url)) return url;
  return null;
}

function decodeHTMLEntities(text) {
  const el = document.createElement('textarea');
  el.innerHTML = text;
  return el.value;
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
  // Brand Home click -> Reset to BLVCKTORQUE
  elements.brandHome.addEventListener('click', () => {
    loadDefaultChannel();
    showToast('Loaded BLVCKTORQUE');
  });

  // Channel Form Submit
  elements.channelForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleChannelInput(elements.channelInput.value);
  });

  // Manual Sync Button
  elements.syncBtn.addEventListener('click', () => {
    syncChannelFeed(state.currentChannelId, false);
  });
  elements.syncQueueBtn.addEventListener('click', () => {
    syncChannelFeed(state.currentChannelId, false);
  });

  // Preset Chips
  elements.presetChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const channel = chip.dataset.channel;
      if (channel === DEFAULT_CHANNEL_ID) {
        loadDefaultChannel();
      } else {
        loadPresetChannel(channel);
      }
    });
  });

  // Controls
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
      showToast('Copied short link to clipboard!');
    }).catch(() => {
      showToast('Failed to copy link');
    });
  });

  // Queue Drawer
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

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
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

  // Mouse Wheel Debounce
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
        playNext();
      } else {
        playPrev();
      }
    }
  }, { passive: true });

  // Settings
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

  elements.autoSyncToggle.addEventListener('change', (e) => {
    state.autoSync = e.target.checked;
  });

  elements.saveApiKeyBtn.addEventListener('click', () => {
    const key = elements.apiKeyInput.value.trim();
    state.apiKey = key;
    localStorage.setItem('yt_shorts_api_key', key);
    showToast('API Key saved!');
    elements.settingsModal.classList.add('hidden');
  });

  // Background Auto-sync check every 90 seconds for future uploads
  setInterval(() => {
    if (state.autoSync && state.currentChannelId === DEFAULT_CHANNEL_ID) {
      syncChannelFeed(DEFAULT_CHANNEL_ID, true);
    }
  }, 90000);
}

// Start
setupEventListeners();
