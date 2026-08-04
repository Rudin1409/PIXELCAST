// Main Stage View (Projector Display) Logic

class MainStageView {
  constructor() {
    this.container = null;
    this.spawnInterval = null;
    this.activeMessageIds = new Set();  // Pesan yang sedang melayang di panggung saat ini
    this.historySpawnedIds = new Set(); // Catatan semua pesan yang SUDAH pernah tayang 1x
    this.queueIndex = 0;
    this.laneIndex = 0;
  }

  render(container) {
    this.container = container;
    container.innerHTML = `
      <div class="bg-background text-on-background font-body-md overflow-hidden h-screen flex flex-col selection:bg-tertiary selection:text-on-tertiary relative">
        <!-- Top Stage Arcade HUD Header -->
        <header class="bg-background text-primary font-headline fixed top-0 w-full z-40 border-b-4 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex justify-between items-center px-6 h-16 shrink-0">
          <div class="flex items-center gap-4">
            <div class="font-headline text-xl italic tracking-tighter text-black bg-cyan-neon px-3 py-1 border-b-4 border-r-4 border-on-background font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🎮 PIXELCAST
            </div>
            <div class="hidden lg:flex items-center gap-2 bg-black border-2 border-tertiary px-3 py-1 text-tertiary text-xs font-mono font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span class="text-yellow-neon animate-pulse">INSERT TEXT TO PLAY!</span>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <button id="btn-toggle-bgm" class="hidden sm:flex items-center gap-1.5 bg-black border-2 border-yellow-neon px-2.5 py-1 text-xs font-mono font-bold text-yellow-neon hover:bg-yellow-neon hover:text-black transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span class="material-symbols-outlined text-sm">music_note</span>
              <span id="bgm-label">BGM 8-BIT: OFF</span>
            </button>
            <div class="hidden sm:flex items-center gap-2 bg-primary-container px-3 py-1 border-2 border-on-background">
              <span class="text-xs font-label-sm text-cyan-neon font-bold">TOTAL CHAT ACC:</span>
              <span id="approved-count" class="text-white font-mono text-sm font-bold">0</span>
            </div>
            <div class="flex items-center gap-2 bg-primary-container px-3 py-1.5 border-2 border-on-background">
              <span class="w-3 h-3 bg-emerald-400 rounded-full animate-ping"></span>
              <span class="font-label-sm text-xs text-secondary font-bold uppercase tracking-wider">SIARAN PANGGUNG UTAMA</span>
            </div>
          </div>
        </header>

        <!-- Main Stage Canvas -->
        <main class="flex h-screen pt-16 overflow-hidden flex-1 relative">
          <!-- Left: Join the Game & Real-time Player List Zone (25%) -->
          <section class="w-1/4 h-full bg-surface-container-low border-r-4 border-on-background p-5 flex flex-col justify-between relative shrink-0 z-10">
            <div class="absolute inset-0 scanline-overlay z-0 opacity-20"></div>

            <!-- QR Code Section -->
            <div class="z-10 w-full text-center">
              <h2 class="font-headline text-base md:text-lg text-secondary-fixed mb-2.5 tracking-tight leading-none bg-on-background text-background inline-block px-3 py-1.5 border-r-4 border-b-4 border-tertiary font-bold uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                PINDAI UNTUK MAIN!
              </h2>
              <div class="bg-secondary p-3 pixel-border brutal-shadow inline-block">
                <div id="qr-container" class="w-36 h-36 md:w-40 md:h-40 bg-white p-2 flex items-center justify-center relative">
                  <!-- QR Code Image -->
                </div>
              </div>
              <p class="text-[10px] font-label-sm text-cyan-neon mt-2 tracking-wider font-bold uppercase">
                SCAN QR DENGAN HP UNTUK CHAT!
              </p>
            </div>

            <!-- Real-time Connected Players Panel -->
            <div class="z-10 w-full flex-1 flex flex-col my-3 overflow-hidden bg-primary-container border-2 border-on-background p-3 brutal-shadow-sm">
              <div class="font-label-sm text-xs text-primary flex justify-between items-center border-b border-on-background/40 pb-2 mb-2">
                <span class="font-bold text-yellow-neon uppercase flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">groups</span> PEMAIN GABUNG:
                </span>
                <span id="player-count" class="text-white font-bold font-mono text-sm px-2 py-0.5 bg-black border border-on-background">1</span>
              </div>

              <!-- Live Player Ticker List -->
              <div id="active-players-list" class="flex-1 overflow-y-auto space-y-1.5 custom-scrollbar pr-1">
                <div class="text-[11px] text-on-surface-variant font-mono italic text-center py-2">
                  MEMUAT DAFTAR PEMAIN...
                </div>
              </div>
            </div>

            <!-- Dynamic Player Capacity Bar -->
            <div class="mt-auto pt-3 border-t-2 border-on-background/30 flex flex-col gap-1.5">
              <div class="flex justify-between items-center">
                <span class="font-label-sm text-[10px] text-cyan-neon font-bold uppercase flex items-center gap-1">
                  <span class="w-2 h-2 bg-cyan-neon rounded-full animate-ping"></span>
                  STATUS AKTIVITAS ARENA
                </span>
              </div>
              <div class="w-full h-3 bg-surface-container border-2 border-on-background p-0.5 relative overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                <div id="player-capacity-bar" class="h-full bg-gradient-to-r from-cyan-400 via-tertiary to-yellow-neon transition-all duration-500 ease-out" style="width: 0%"></div>
              </div>
            </div>

            <div class="absolute bottom-4 right-4 star-ornament text-secondary opacity-20 select-none pointer-events-none">
              <span class="material-symbols-outlined text-4xl">star</span>
            </div>
          </section>

          <!-- Right: Live Chat Arena (75%) -->
          <section class="w-3/4 h-full bg-[#0c0d1b] arcade-grid-bg relative overflow-hidden flex flex-col">
            <!-- Scanline Overlay for CRT TV Effect -->
            <div class="scanline absolute inset-0 opacity-40 z-10 pointer-events-none crt-screen-flicker"></div>
            <div class="scanline-overlay absolute inset-0 opacity-30 z-10 pointer-events-none"></div>

            <div class="relative z-20 w-full h-full p-8" id="chat-arena-container">
              <div class="relative w-full h-full" id="chat-arena"></div>
            </div>

            <!-- Background Arcade Animated Pixel Ornaments -->
            <div class="absolute top-12 left-12 text-cyan-neon opacity-20 animate-bob pointer-events-none">
              <span class="material-symbols-outlined" style="font-size: 80px;">sports_esports</span>
            </div>
            <div class="absolute bottom-24 right-16 text-yellow-neon opacity-25 animate-coin-spin pointer-events-none">
              <span class="material-symbols-outlined" style="font-size: 90px;">monetization_on</span>
            </div>
            <div class="absolute top-1/3 right-1/4 text-tertiary opacity-15 rotate-12 pointer-events-none">
              <span class="material-symbols-outlined" style="font-size: 140px;">videogame_asset</span>
            </div>
            <div class="absolute bottom-16 left-1/3 text-emerald-400 opacity-20 -rotate-12 animate-bob pointer-events-none" style="animation-delay: 1s;">
              <span class="material-symbols-outlined" style="font-size: 110px;">trophy</span>
            </div>
            <div class="absolute top-10 right-10 text-yellow-neon opacity-30 star-ornament pointer-events-none">
              <span class="material-symbols-outlined text-4xl">stars</span>
            </div>
            <div class="absolute bottom-8 left-10 text-cyan-neon opacity-30 star-ornament pointer-events-none" style="animation-delay: 2s;">
              <span class="material-symbols-outlined text-3xl">hotel_class</span>
            </div>
          </section>
        </main>

        <!-- SPOTLIGHT OVERLAY: Background tetap terlihat, kartu di tengah -->
        <div id="spotlight-overlay" class="hidden fixed inset-0 z-[300] flex items-center justify-center px-6 pointer-events-none">
          <!-- Hanya area kartu yang bisa diklik, background tetap transparan -->
          <div id="spotlight-card" class="pointer-events-auto bg-yellow-neon text-black border-4 border-on-background px-6 py-4 shadow-[8px_8px_0px_0px_rgba(255,171,243,1)] relative max-w-xl w-full z-10 animate-[slideUp_0.3s_ease-out]" style="animation-fill-mode: forwards;">
            <button id="close-spotlight-btn" class="absolute -top-3 -right-3 bg-error text-white w-8 h-8 rounded-full border-2 border-on-background flex items-center justify-center font-bold text-sm hover:scale-110 active:scale-95 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer z-20">
              ✕
            </button>

            <div class="flex items-center gap-2 mt-1 mb-1">
              <span class="material-symbols-outlined text-sm text-primary-container" id="spotlight-avatar-icon">star</span>
              <span class="font-label-sm text-xs text-primary-container font-bold uppercase" id="spotlight-user">@PLAYER_X7:</span>
              <span class="ml-auto animate-pulse text-error font-extrabold text-xs">★ LIVE ★</span>
            </div>
            <div class="font-headline text-xl md:text-2xl font-extrabold text-black uppercase leading-tight tracking-wide" id="spotlight-text">
              "GG EZ MANTEP BANGET!"
            </div>
          </div>
        </div>
      </div>
    `;

    this.renderQRCode();
    this.bindStore();
    this.startAutoSpawner();
    this.syncSpotlightUI();
    this.renderActivePlayersList();
    this.updatePlayerCapacityBar();

    // Toggle BGM 8-Bit Chill Ambient
    const toggleBgmBtn = this.container.querySelector('#btn-toggle-bgm');
    const bgmLabel = this.container.querySelector('#bgm-label');
    if (toggleBgmBtn) {
      toggleBgmBtn.addEventListener('click', () => {
        if (window.soundFX) {
          const isPlaying = window.soundFX.toggleBGM();
          if (bgmLabel) bgmLabel.textContent = isPlaying ? 'BGM 8-BIT: ON 🎵' : 'BGM 8-BIT: OFF';
          toggleBgmBtn.className = `hidden sm:flex items-center gap-1.5 border-2 px-2.5 py-1 text-xs font-mono font-bold transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${isPlaying ? 'bg-yellow-neon text-black border-yellow-400 animate-pulse' : 'bg-black text-yellow-neon border-yellow-neon hover:bg-yellow-neon hover:text-black'}`;
        }
      });
    }

    // Close spotlight button
    const closeSpotlightBtn = this.container.querySelector('#close-spotlight-btn');
    if (closeSpotlightBtn) {
      closeSpotlightBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.retroStore.spotlightOff();
      });
    }

    // Click overlay background to close
    const spotlightOverlay = this.container.querySelector('#spotlight-overlay');
    if (spotlightOverlay) {
      spotlightOverlay.addEventListener('click', (e) => {
        if (e.target === spotlightOverlay) {
          window.retroStore.spotlightOff();
        }
      });
    }
  }

  renderQRCode() {
    const qrContainer = this.container.querySelector('#qr-container');
    if (!qrContainer) return;

    const controllerUrl = window.location.origin + window.location.pathname + '#controller';
    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(controllerUrl)}&color=000000&bgcolor=ffffff`;

    qrContainer.innerHTML = `
      <img src="${qrImgUrl}" alt="Scan QR Controller" class="w-full h-full object-contain" />
    `;
  }

  bindStore() {
    window.retroStore.subscribe((eventType, payload) => {
      const countEl = this.container.querySelector('#player-count');
      const approvedCountEl = this.container.querySelector('#approved-count');
      
      const approvedMsgs = window.retroStore.getApprovedMessages();
      if (approvedCountEl) approvedCountEl.textContent = approvedMsgs.length;
      if (countEl) countEl.textContent = window.retroStore.activePlayers ? window.retroStore.activePlayers.length : 0;

      // Update capacity bar setiap ada perubahan
      this.updatePlayerCapacityBar();

      if (eventType === 'spotlight_changed') {
        this.syncSpotlightUI();
      }

      if (eventType === 'message_approved' && payload && payload.status === 'approved') {
        this.historySpawnedIds.add(payload.id);
        this.spawnSingleMessage(payload);
      } else if (eventType === 'players_updated') {
        this.renderActivePlayersList();
        this.updatePlayerCapacityBar();
      }
    });
  }

  // Update progress bar aktivitas pemain
  updatePlayerCapacityBar() {
    if (!this.container) return;
    const bar = this.container.querySelector('#player-capacity-bar');
    if (!bar) return;

    const currentPlayers = window.retroStore.activePlayers ? window.retroStore.activePlayers.length : 0;
    const percentage = currentPlayers === 0 ? 0 : Math.min(100, Math.max(15, currentPlayers * 5));

    bar.style.width = `${percentage}%`;
  }

  // Sinkronisasi UI Spotlight berdasarkan _spotlight variable
  syncSpotlightUI() {
    if (!this.container) return;
    const spotlightOverlay = this.container.querySelector('#spotlight-overlay');
    if (!spotlightOverlay) return;

    const spotlightCard = this.container.querySelector('#spotlight-card');
    const spotlightUser = this.container.querySelector('#spotlight-user');
    const spotlightText = this.container.querySelector('#spotlight-text');
    const spotlightAvatarIcon = this.container.querySelector('#spotlight-avatar-icon');

    const spotlight = window.retroStore.getSpotlight();
    if (spotlight) {
      const AVATAR_SPOTLIGHT_THEMES = {
        'sports_esports': { name: 'GAMER', bg: 'bg-[#00ffff]', text: 'text-black', shadow: 'shadow-[8px_8px_0px_0px_rgba(0,255,255,1)]' },
        'swords':         { name: 'WARRIOR', bg: 'bg-[#ffabf3]', text: 'text-black', shadow: 'shadow-[8px_8px_0px_0px_rgba(255,171,243,1)]' },
        'star':           { name: 'CHAMPION', bg: 'bg-[#eaea00]', text: 'text-black', shadow: 'shadow-[8px_8px_0px_0px_rgba(234,234,0,1)]' },
        'smart_toy':      { name: 'ROBOT', bg: 'bg-[#34d399]', text: 'text-black', shadow: 'shadow-[8px_8px_0px_0px_rgba(52,211,153,1)]' },
        'local_fire_department': { name: 'FIRE MAGE', bg: 'bg-[#ff5722]', text: 'text-white', shadow: 'shadow-[8px_8px_0px_0px_rgba(255,87,34,1)]' },
        'skull':          { name: 'SHADOW NINJA', bg: 'bg-[#b026ff]', text: 'text-white', shadow: 'shadow-[8px_8px_0px_0px_rgba(176,38,255,1)]' }
      };

      const theme = AVATAR_SPOTLIGHT_THEMES[spotlight.avatar] || AVATAR_SPOTLIGHT_THEMES['star'];

      if (spotlightCard) {
        spotlightCard.className = `pointer-events-auto ${theme.bg} border-4 border-on-background px-6 py-4 ${theme.shadow} relative max-w-xl w-full z-10 transition-all duration-300 ease-out`;

        // POSISI POPUP SEJAJAR PAS DENGAN LOKASI YANG DIKLIK (PENGAMAN TEPI KANAN UNTUK TOMBOL CLOSE '✕')
        if (this.lastClickedBubblePos) {
          const pos = this.lastClickedBubblePos;
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;

          // Ukuran kartu maksimal & pengaman 50px dari tepi kanan layar agar tombol close '✕' TIDAK TERPOTONG!
          const cardWidth = Math.min(576, screenWidth - 80);
          const maxAllowedLeft = screenWidth - cardWidth - 50;
          const maxAllowedTop = Math.max(60, screenHeight - 220);

          let targetLeft = Math.max(30, Math.min(maxAllowedLeft, pos.left - 40));
          let targetTop = Math.max(60, Math.min(maxAllowedTop, pos.top - 150));

          spotlightCard.style.position = 'fixed';
          spotlightCard.style.left = `${targetLeft}px`;
          spotlightCard.style.top = `${targetTop}px`;
          spotlightCard.style.transform = 'none';
        } else {
          spotlightCard.style.position = 'relative';
          spotlightCard.style.left = 'auto';
          spotlightCard.style.top = 'auto';
        }
      }

      if (spotlightAvatarIcon) spotlightAvatarIcon.textContent = spotlight.avatar || 'star';
      if (spotlightUser) spotlightUser.textContent = `@${spotlight.user}:`;
      if (spotlightText) spotlightText.textContent = `"${spotlight.text}"`;
      if (spotlightOverlay.classList.contains('hidden')) {
        if (window.soundFX) window.soundFX.playPowerUp();
      }
      spotlightOverlay.classList.remove('hidden');
    } else {
      spotlightOverlay.classList.add('hidden');
      this.lastClickedBubblePos = null;
    }
  }

  renderActivePlayersList() {
    const listContainer = this.container.querySelector('#active-players-list');
    if (!listContainer) return;

    const players = window.retroStore.activePlayers;
    if (!players || players.length === 0) {
      listContainer.innerHTML = `
        <div class="text-[11px] text-on-surface-variant font-mono italic text-center py-4 border border-dashed border-on-background/30">
          MENUNGGU PEMAIN BERGABUNG...
        </div>
      `;
      return;
    }

    const AVATAR_COLOR_MAP = {
      'sports_esports': 'text-cyan-neon',
      'swords': 'text-tertiary',
      'star': 'text-yellow-neon',
      'smart_toy': 'text-emerald-400',
      'local_fire_department': 'text-orange-400',
      'skull': 'text-purple-400'
    };

    listContainer.innerHTML = players.map(p => {
      const colorClass = AVATAR_COLOR_MAP[p.avatar] || 'text-yellow-neon';
      return `
        <div class="flex items-center gap-2 bg-surface-container-high border border-on-background p-1.5 font-mono text-[11px]">
          <span class="material-symbols-outlined text-sm ${colorClass}">${p.avatar || 'star'}</span>
          <span class="font-bold text-white uppercase truncate flex-1">${p.username || 'PLAYER'}</span>
          <span class="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
        </div>
      `;
    }).join('');
  }

  // Generator Posisi X Organik Semi-Acak (Anti-Overlap & Tidak Kaku Ke Samping)
  getSmartRandomXPosition() {
    const candidatePositions = [6, 42, 20, 58, 12, 48, 32, 66];
    
    let pos;
    let attempts = 0;
    do {
      pos = candidatePositions[Math.floor(Math.random() * candidatePositions.length)];
      attempts++;
    } while (this.lastPositions && this.lastPositions.includes(pos) && attempts < 10);

    if (!this.lastPositions) this.lastPositions = [];
    this.lastPositions.push(pos);
    if (this.lastPositions.length > 3) this.lastPositions.shift();

    // Tambahkan variasi posisi kecil (-3% s/d +3%) agar tampil organik & alami
    const jitter = Math.floor(Math.random() * 7) - 3;
    return Math.max(5, Math.min(68, pos + jitter));
  }

  // =====================================================
  // SMART ORGANIC ANTI-OVERLAP SPAWNER
  // =====================================================
  spawnSingleMessage(msg) {
    if (!msg || msg.status !== 'approved') return;

    // CEK PENGAMAN: Jika pesan ini sedang aktif melayang, JANGAN spawn duplikatnya!
    if (this.activeMessageIds.has(msg.id)) return;

    const arena = this.container.querySelector('#chat-arena');
    if (!arena) return;

    // Catat ID pesan ini sedang aktif melayang
    this.activeMessageIds.add(msg.id);

    // Bunyikan chime 8-bit halus saat pesan baru meluncur di panggung
    if (window.soundFX) window.soundFX.playSpawnChime();

    const bubble = document.createElement('div');
    bubble.className = 'animate-float absolute z-20 cursor-pointer group';
    
    // POSISI X ORGANIK SEMI-ACAK (Tidak kaku berurutan ke samping, tapi tetap teratur & tidak bertumpuk)
    const targetX = this.getSmartRandomXPosition();
    const duration = (Math.random() * 3 + 14).toFixed(1); // 14s - 17s smooth float

    bubble.style.left = `${targetX}%`;
    bubble.style.setProperty('--duration', `${duration}s`);

    const AVATAR_STAGE_THEMES = {
      'sports_esports': { name: 'GAMER', bg: 'bg-[#00ffff]', text: 'text-black', badge: 'bg-black text-cyan-neon' },
      'swords':         { name: 'WARRIOR', bg: 'bg-[#ffabf3]', text: 'text-black', badge: 'bg-black text-tertiary' },
      'star':           { name: 'CHAMPION', bg: 'bg-[#eaea00]', text: 'text-black', badge: 'bg-black text-yellow-neon' },
      'smart_toy':      { name: 'ROBOT', bg: 'bg-[#34d399]', text: 'text-black', badge: 'bg-black text-emerald-400' },
      'local_fire_department': { name: 'FIRE MAGE', bg: 'bg-[#ff5722]', text: 'text-white', badge: 'bg-black text-orange-400' },
      'skull':          { name: 'SHADOW NINJA', bg: 'bg-[#b026ff]', text: 'text-white', badge: 'bg-black text-purple-300' }
    };

    const theme = AVATAR_STAGE_THEMES[msg.avatar] || AVATAR_STAGE_THEMES['star'];

    bubble.innerHTML = `
      <div class="${theme.bg} ${theme.text} p-4 md:p-5 border-4 border-black pixel-box-shadow pixel-corners max-w-md relative transition-all group-hover:scale-110 group-hover:-rotate-1">
        <div class="font-label-sm text-xs mb-1.5 font-bold flex items-center justify-between gap-1.5 border-b border-black/20 pb-1">
          <span class="flex items-center gap-1.5">
            <span class="material-symbols-outlined text-base animate-bounce">${msg.avatar || 'star'}</span>
            <span class="font-headline font-extrabold tracking-wider uppercase">${msg.user}</span>
          </span>
          <span class="text-[9px] px-1.5 py-0.5 border border-black font-mono font-bold uppercase tracking-wider ${theme.badge} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            ★ ${theme.name}
          </span>
        </div>
        <div class="font-body-md text-sm md:text-base font-mono font-extrabold uppercase leading-snug tracking-wide pt-1">
          "${msg.text}"
        </div>
        <!-- 8-Bit RPG Speech Bubble Pointer Tail -->
        <div class="absolute -bottom-2.5 left-6 w-4 h-4 ${theme.bg} border-b-4 border-r-4 border-black rotate-45"></div>
      </div>
    `;

    // Klik pesan melayang untuk menyorot sejajar lokasi diklik
    bubble.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = bubble.getBoundingClientRect();
      this.lastClickedBubblePos = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height
      };
      window.retroStore.spotlightOn(msg);
    });

    arena.appendChild(bubble);

    // Hapus dari activeMessageIds setelah pesan selesai melayang melewai layar
    setTimeout(() => {
      this.activeMessageIds.delete(msg.id);
      if (bubble.parentNode) {
        bubble.parentNode.removeChild(bubble);
      }
    }, parseFloat(duration) * 1000 + 500);
  }

  // Web Worker Auto-Spawner (Jamin 100% TIDAK PERNAH FREEZE/DI-THROTTLE Chrome saat tab di background)
  startAutoSpawner() {
    try {
      const workerScript = `
        let timer = null;
        self.onmessage = function(e) {
          if (e.data === 'start') {
            if (timer) clearInterval(timer);
            timer = setInterval(() => { postMessage('tick'); }, 2800);
          } else if (e.data === 'stop') {
            if (timer) clearInterval(timer);
          }
        };
      `;
      const blob = new Blob([workerScript], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      this.spawnWorker = new Worker(workerUrl);

      this.spawnWorker.onmessage = () => {
        this.tickSpawner();
      };
      this.spawnWorker.postMessage('start');
    } catch (e) {
      // Fallback jika Web Worker diblokir lingkungan browser
      this.spawnInterval = setInterval(() => {
        this.tickSpawner();
      }, 2800);
    }
  }

  tickSpawner() {
    const approvedList = window.retroStore.getApprovedMessages();
    const strictlyApproved = approvedList.filter(m => m.status === 'approved');
    
    if (strictlyApproved.length > 0) {
      // 1. CARI PESAN YANG BELUM PERNAH TAYANG SAMA SEKALI
      const unspawnedMsg = strictlyApproved.find(m => !this.historySpawnedIds.has(m.id));
      
      if (unspawnedMsg) {
        // Tandai pesan ini sudah tayang 1x
        this.historySpawnedIds.add(unspawnedMsg.id);
        this.spawnSingleMessage(unspawnedMsg);
      } else {
        // 2. JIKA SEMUA PESAN APPROVED SUDAH SELESAI TAYANG 1x, BARU PUTAR ULANG DARI PESAN #1!
        const msgToRepeat = strictlyApproved[this.queueIndex % strictlyApproved.length];
        this.queueIndex = (this.queueIndex + 1) % strictlyApproved.length;
        this.spawnSingleMessage(msgToRepeat);
      }
    }
  }

  destroy() {
    if (window.soundFX) {
      window.soundFX.stopBGM();
    }
    if (this.spawnWorker) {
      this.spawnWorker.postMessage('stop');
      this.spawnWorker.terminate();
    }
    if (this.spawnInterval) {
      clearInterval(this.spawnInterval);
    }
  }
}

window.MainStageView = MainStageView;
