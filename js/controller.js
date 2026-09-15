// Controller View (HP Peserta Interface) Logic

class ControllerView {
  constructor() {
    const session = (window.retroStore && window.retroStore.getUserSession) ? window.retroStore.getUserSession() : null;
    this.selectedAvatar = session ? (session.avatar || 'star') : 'star';
    this.username = session ? session.username : (localStorage.getItem('retro_player_name') || '');
    this.isSending = false;
  }

  render(container) {
    const session = (window.retroStore && window.retroStore.getUserSession) ? window.retroStore.getUserSession() : null;
    if (session && session.username) {
      this.username = session.username;
      this.selectedAvatar = session.avatar || 'star';
    }
    if (!this.username) {
      this.username = localStorage.getItem('retro_player_name') || '';
    }
    const showNameModal = !this.username;

    container.innerHTML = `
      <div class="bg-background text-on-background font-body-md selection:bg-tertiary selection:text-on-tertiary flex flex-col min-h-screen items-center justify-center p-0 md:p-4 bg-surface-dim scanline-overlay relative">
        
        <!-- Mobile Device Wrapper Frame -->
        <div class="w-full max-w-md h-screen md:h-[840px] bg-[#1a1a36] border-0 md:border-4 md:border-cyan-neon shadow-none md:shadow-[12px_12px_0px_0px_rgba(255,171,243,1)] flex flex-col overflow-hidden relative rounded-none md:rounded-2xl">
          
          <!-- Participant Header -->
          <header class="flex justify-between items-center w-full px-4 h-14 shrink-0 bg-[#0f0f23] border-b-4 border-cyan-neon shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] z-30">
            <div class="font-headline text-base italic tracking-tighter text-black bg-cyan-neon px-3 py-1 border-b-2 border-r-2 border-on-background font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🎮 PIXELCAST
            </div>
            <button id="btn-change-name" class="flex items-center gap-1.5 bg-tertiary-container border-2 border-tertiary px-2.5 py-1 text-[11px] font-label-sm text-tertiary font-bold hover:bg-tertiary hover:text-black transition-colors shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <span class="material-symbols-outlined text-xs">edit</span>
              <span id="header-user-name">${this.username || 'SET NAMA'}</span>
            </button>
          </header>

          <!-- Main Console Body -->
          <main class="flex-1 relative flex flex-col p-3 bg-[#1e1e40] overflow-y-auto custom-scrollbar">
            
            <!-- Screen Bezel -->
            <div class="flex-1 bg-[#2a2a5c] border-4 md:border-6 border-on-background p-2.5 rounded-xl shadow-[inset_0_4px_12px_rgba(0,0,0,0.9)] flex flex-col relative min-h-[360px]">
              
              <!-- Console Notch -->
              <div class="flex justify-center mb-1.5">
                <div class="w-16 h-1.5 bg-cyan-neon/40 rounded-full"></div>
              </div>

              <!-- Terminal Screen Area -->
              <div class="flex-1 bg-[#0c0d14] border-4 border-cyan-neon relative flex flex-col p-3 overflow-hidden pixel-corners shadow-[inset_0_0_15px_rgba(0,255,255,0.15)]">
                <div class="scanline absolute inset-0 opacity-30 z-10 pointer-events-none"></div>
                
                <!-- User Status Bar -->
                <div class="flex justify-between items-center mb-2 pb-1.5 border-b border-cyan-neon/40 text-[11px] font-label-sm text-cyan-neon font-bold z-20 shrink-0">
                  <span>PEMAIN: <strong id="user-display-name" class="text-yellow-neon">${this.username || 'BELUM SET NAMA'}</strong></span>
                  <span class="text-emerald-400 flex items-center gap-1">
                    <span class="w-2 h-2 bg-emerald-400 rounded-full animate-ping"></span>
                    [ONLINE]
                  </span>
                </div>

                <!-- Chat Log Terminal (Tampil Otomatis di Layar GameBoy dengan Efek Elastic Pull) -->
                <div id="terminal-chat-log" class="flex-1 font-label-sm text-yellow-neon terminal-glow uppercase tracking-wider overflow-y-auto mb-2 space-y-2 text-xs custom-scrollbar z-20 pr-1 transition-transform">
                  <div class="text-[10px] text-tertiary border-b border-tertiary/40 pb-1 font-mono italic">
                    [SYSTEM]: KONEKSI ARENA ACTIVE_ GUNAKAN ▲/▼ UNTUK EFEK PULL CHAT!
                  </div>
                  <!-- Dynamic Chat Messages Will Load Here -->
                </div>

                <!-- Character Selection Area (6 Color-Coded Game Avatars) -->
                <div class="mt-auto border-t-2 border-cyan-neon/30 pt-2 shrink-0 z-20">
                  <div class="flex justify-between items-center mb-1.5">
                    <span class="font-label-sm text-[10px] text-cyan-neon tracking-widest uppercase font-bold">PILIH AVATAR GAME_</span>
                    <span id="active-avatar-badge" class="font-mono text-[9px] text-yellow-neon font-bold px-1.5 py-0.5 bg-black border border-yellow-neon">★ STAR</span>
                  </div>
                  <div class="grid grid-cols-6 gap-1.5" id="avatar-selector">
                    <button data-avatar="sports_esports" title="GAMER" class="avatar-btn aspect-square bg-[#1a1c38] border-2 border-cyan-neon flex items-center justify-center hover:scale-105 transition-all group">
                      <span class="material-symbols-outlined text-cyan-neon text-lg">sports_esports</span>
                    </button>
                    <button data-avatar="swords" title="WARRIOR" class="avatar-btn aspect-square bg-[#1a1c38] border-2 border-tertiary flex items-center justify-center hover:scale-105 transition-all group">
                      <span class="material-symbols-outlined text-tertiary text-lg">swords</span>
                    </button>
                    <button data-avatar="star" title="CHAMPION" class="avatar-btn aspect-square bg-tertiary border-2 border-on-background flex items-center justify-center group shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                      <span class="material-symbols-outlined text-on-tertiary text-lg">star</span>
                    </button>
                    <button data-avatar="smart_toy" title="ROBOT" class="avatar-btn aspect-square bg-[#1a1c38] border-2 border-emerald-400 flex items-center justify-center hover:scale-105 transition-all group">
                      <span class="material-symbols-outlined text-emerald-400 text-lg">smart_toy</span>
                    </button>
                    <button data-avatar="local_fire_department" title="FIRE MAGE" class="avatar-btn aspect-square bg-[#1a1c38] border-2 border-orange-500 flex items-center justify-center hover:scale-105 transition-all group">
                      <span class="material-symbols-outlined text-orange-500 text-lg">local_fire_department</span>
                    </button>
                    <button data-avatar="skull" title="SHADOW NINJA" class="avatar-btn aspect-square bg-[#1a1c38] border-2 border-purple-400 flex items-center justify-center hover:scale-105 transition-all group">
                      <span class="material-symbols-outlined text-purple-400 text-lg">skull</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Input Field (Retro Terminal Style) -->
              <div class="mt-3 px-0.5">
                <div class="relative">
                  <div class="absolute inset-y-0 left-3 flex items-center text-cyan-neon font-bold text-sm">&gt;&gt;</div>
                  <input id="chat-input" class="w-full bg-[#0c0d14] border-4 border-cyan-neon p-2.5 pl-9 text-yellow-neon font-label-sm focus:outline-none placeholder:text-on-surface/40 uppercase text-xs font-bold shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" placeholder="Ketik pesan di sini..." type="text" maxlength="120" />
                </div>
              </div>
            </div>

            <!-- Tactile Controller Controls -->
            <div class="grid grid-cols-2 gap-4 items-center mt-4 mb-4 px-2 shrink-0">
              <!-- Colorful Retro D-PAD -->
              <div class="relative w-36 h-36 mx-auto flex items-center justify-center select-none">
                <!-- Horizontal Bar -->
                <div class="absolute w-full h-11 bg-[#12142b] border-4 border-cyan-neon shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm flex justify-between px-1.5 items-center">
                  <button id="dpad-left" class="w-8 h-8 flex items-center justify-center text-cyan-neon hover:text-yellow-neon active:scale-75 font-bold transition-all bg-surface-container-high border border-cyan-neon/50 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <span class="font-mono text-base">◄</span>
                  </button>
                  <button id="dpad-right" class="w-8 h-8 flex items-center justify-center text-cyan-neon hover:text-yellow-neon active:scale-75 font-bold transition-all bg-surface-container-high border border-cyan-neon/50 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <span class="font-mono text-base">►</span>
                  </button>
                </div>
                <!-- Vertical Bar -->
                <div class="absolute h-full w-11 bg-[#12142b] border-4 border-cyan-neon shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-sm flex flex-col justify-between py-1.5 items-center">
                  <button id="dpad-up" class="w-8 h-8 flex items-center justify-center text-yellow-neon hover:text-white active:scale-75 font-bold transition-all bg-surface-container-high border border-yellow-neon/50 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <span class="font-mono text-base">▲</span>
                  </button>
                  <button id="dpad-down" class="w-8 h-8 flex items-center justify-center text-yellow-neon hover:text-white active:scale-75 font-bold transition-all bg-surface-container-high border border-yellow-neon/50 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">
                    <span class="font-mono text-base">▼</span>
                  </button>
                </div>
                <!-- Center Cap -->
                <div class="absolute w-8 h-8 bg-tertiary-container border-2 border-tertiary rounded-full z-10 flex items-center justify-center shadow-inner">
                  <div class="w-2.5 h-2.5 bg-tertiary rounded-full animate-ping"></div>
                </div>
              </div>

              <!-- Action Button (KIRIM / PRESS A) -->
              <div class="flex justify-center">
                <button id="btn-send-message" class="nes-button-shadow group relative w-28 h-28 rounded-full bg-tertiary border-4 border-on-background transition-all flex items-center justify-center active:scale-95 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div class="flex flex-col items-center">
                    <span class="font-headline text-xl font-bold text-on-tertiary uppercase tracking-tighter leading-none">KIRIM</span>
                    <span class="text-[9px] text-on-tertiary/80 font-bold mt-1 tracking-widest">PRESS A</span>
                  </div>
                </button>
              </div>
            </div>
          </main>

          <!-- Bottom Console Brand Strip -->
          <footer class="h-10 bg-[#0f0f23] border-t-4 border-cyan-neon flex justify-between items-center px-4 shrink-0 font-label-sm text-[10px]">
            <span class="text-cyan-neon font-bold">PIXELCAST HANDHELD</span>
            <span class="text-yellow-neon font-bold animate-pulse">INSERT TEXT TO PLAY!</span>
          </footer>
        </div>

        <!-- PLAYER NAME REGISTRATION MODAL -->
        <div id="name-modal" class="${showNameModal ? '' : 'hidden'} fixed inset-0 z-[400] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-background/95 backdrop-blur-md"></div>
          <div class="scanline absolute inset-0 opacity-40"></div>
          <div class="relative bg-surface-container border-4 border-on-background p-6 shadow-[10px_10px_0px_0px_rgba(0,255,255,1)] flex flex-col items-center gap-5 text-center pixel-corners max-w-xs w-full">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-yellow-neon text-3xl animate-bounce">videogame_asset</span>
              <span class="font-headline text-xl text-tertiary uppercase font-bold">SELECT PLAYER NAME</span>
            </div>
            
            <p class="text-xs text-on-surface-variant font-label-sm leading-relaxed">
              Masukkan nama / nickname Anda sebelum bergabung ke dalam Arena Chat Live Panggung!
            </p>

            <div class="w-full relative">
              <div class="absolute inset-y-0 left-3 flex items-center text-cyan-neon font-bold text-xs">&gt;&gt;</div>
              <input id="player-name-input" class="w-full bg-black border-4 border-cyan-neon p-3 pl-8 text-yellow-neon font-headline text-sm focus:outline-none placeholder:text-gray-500 uppercase font-bold text-center shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" placeholder="KETIK NAMA ANDA..." type="text" maxlength="20" value="${this.username}" />
            </div>

            <button id="btn-save-name" class="w-full font-label-sm text-xs bg-tertiary text-on-tertiary py-3 border-4 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase font-bold text-sm">
              🎮 MASUK ARENA (START GAME)
            </button>
          </div>
        </div>

        <!-- Success Modal Overlay -->
        <div id="success-overlay" class="hidden fixed inset-0 z-[300] flex items-center justify-center p-4">
          <div class="absolute inset-0 bg-background/95 backdrop-blur-sm"></div>
          <div class="scanline absolute inset-0 opacity-40"></div>
          <div class="relative bg-surface-container border-4 border-on-background p-6 shadow-[8px_8px_0px_0px_rgba(255,171,243,1)] flex flex-col items-center gap-4 text-center pixel-corners max-w-xs w-full">
            <div class="flex gap-2">
              <span class="material-symbols-outlined text-tertiary text-4xl animate-bounce">rocket_launch</span>
            </div>
            <h2 class="font-headline text-xl text-tertiary uppercase leading-tight font-bold">
              PESAN TERKIRIM!<br/><span class="text-cyan-neon text-sm">MENUNGGU MODERASI ADMIN</span>
            </h2>
            <p class="text-[11px] text-on-surface-variant font-label-sm leading-relaxed">
              Pesan Anda telah masuk ke antrean dan akan segera melayang di layar proyektor panggung!
            </p>
            <button id="btn-close-overlay" class="font-label-sm text-xs bg-cyan-neon text-on-background px-5 py-2.5 border-3 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all uppercase font-bold">
              KEMBALI KE GAME
            </button>
          </div>
        </div>
      </div>
    `;

    if (this.username) {
      window.retroStore.registerPlayer(this.username, this.selectedAvatar);
    }
    this.bindEvents(container);
    this.renderTerminalChatLog(container);
    this.bindStoreUpdates(container);
  }

  renderTerminalChatLog(container) {
    const logContainer = container.querySelector('#terminal-chat-log');
    if (!logContainer) return;

    // Ambil username aktif pemain ini
    const currentUsername = (this.username || localStorage.getItem('retro_player_name') || '').trim().toUpperCase();
    const allMessages = window.retroStore.messages || [];

    // Filter HANYA pesan milik user ini sendiri
    const messages = currentUsername
      ? allMessages.filter(msg => msg && msg.user && msg.user.trim().toUpperCase() === currentUsername)
      : [];

    if (!currentUsername) {
      logContainer.innerHTML = `
        <div class="text-[10px] text-tertiary border-b border-tertiary/30 pb-1 font-mono italic">
          [SYSTEM]: SILAKAN SET NAMA PEMAIN TERLEBIH DAHULU!
        </div>
      `;
      return;
    }

    if (messages.length === 0) {
      logContainer.innerHTML = `
        <div class="text-[10px] text-tertiary border-b border-tertiary/30 pb-1 font-mono italic">
          [SYSTEM]: ARENA CHAT ACTIVE_ BELUM ADA PESAN ANDA. KETIK PESAN PERTAMA!
        </div>
      `;
      return;
    }

    const AVATAR_THEMES = {
      'sports_esports': { name: 'GAMER', textClass: 'text-cyan-neon', badgeClass: 'text-cyan-neon border-cyan-400' },
      'swords':         { name: 'WARRIOR', textClass: 'text-tertiary', badgeClass: 'text-tertiary border-tertiary' },
      'star':           { name: 'CHAMPION', textClass: 'text-yellow-neon', badgeClass: 'text-yellow-neon border-yellow-neon' },
      'smart_toy':      { name: 'ROBOT', textClass: 'text-emerald-400', badgeClass: 'text-emerald-400 border-emerald-400' },
      'local_fire_department': { name: 'FIRE MAGE', textClass: 'text-orange-400', badgeClass: 'text-orange-400 border-orange-500' },
      'skull':          { name: 'SHADOW NINJA', textClass: 'text-purple-400', badgeClass: 'text-purple-400 border-purple-400' }
    };

    logContainer.innerHTML = messages.map(msg => {
      const theme = AVATAR_THEMES[msg.avatar] || AVATAR_THEMES['star'];
      const statusBadge = msg.status === 'approved' 
        ? '<span class="text-emerald-400 font-bold text-[9px] px-1 bg-emerald-950/80 border border-emerald-500">[ACC]</span>'
        : (msg.status === 'rejected'
            ? '<span class="text-red-400 font-bold text-[9px] px-1 bg-red-950/80 border border-red-500">[DITOLAK SENSOR]</span>'
            : '<span class="text-yellow-neon font-bold text-[9px] px-1 bg-yellow-950/80 border border-yellow-500">[PENDING]</span>');

      const deleteBtnHtml = `<button data-delete-id="${msg.id}" class="btn-delete-own-msg text-[9px] text-error hover:text-white bg-red-950/60 border border-red-500 px-1 py-0.2 rounded font-bold uppercase transition-colors">✖ HAPUS</button>`;

      return `
        <div class="flex flex-col gap-0.5 border-b border-on-background/20 pb-1.5 text-[11px] font-mono">
          <div class="flex justify-between items-center">
            <span class="${theme.textClass} font-bold flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px]">${msg.avatar || 'star'}</span>
              [${msg.user}]:
            </span>
            <div class="flex items-center gap-1.5">
              ${deleteBtnHtml}
              ${statusBadge}
            </div>
          </div>
          <div class="${theme.textClass} font-bold pl-3 font-mono leading-tight tracking-wide">
            "${msg.text}"
          </div>
        </div>
      `;
    }).join('');

    // Bind click events to delete own messages
    logContainer.querySelectorAll('.btn-delete-own-msg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const msgId = btn.getAttribute('data-delete-id');
        if (msgId) {
          window.retroStore.deleteOwnMessage(msgId);
        }
      });
    });

    // Scroll to bottom automatically
    logContainer.scrollTop = logContainer.scrollHeight;
  }

  bindStoreUpdates(container) {
    window.retroStore.subscribe(() => {
      this.renderTerminalChatLog(container);
    });
  }

  bindEvents(container) {
    const nameModal = container.querySelector('#name-modal');
    const nameInput = container.querySelector('#player-name-input');
    const saveNameBtn = container.querySelector('#btn-save-name');
    const changeNameBtn = container.querySelector('#btn-change-name');
    const headerUserName = container.querySelector('#header-user-name');
    const userDisplayName = container.querySelector('#user-display-name');

    const handleSaveName = () => {
      const val = nameInput.value.trim().toUpperCase();
      if (!val) {
        nameInput.focus();
        return;
      }

      // Cek nama duplikat — apakah nama sudah dipakai HP/perangkat lain?
      if (window.retroStore && window.retroStore.isNameTaken(val)) {
        // Tampilkan peringatan nama duplikat
        let errEl = nameModal.querySelector('#name-taken-error');
        if (!errEl) {
          errEl = document.createElement('div');
          errEl.id = 'name-taken-error';
          errEl.className = 'text-xs font-mono font-bold text-error bg-red-950/80 border-2 border-red-500 p-2.5 mt-2 text-center animate-[popIn_0.2s_ease-out]';
          nameInput.parentElement.after(errEl);
        }
        errEl.innerHTML = '⚠️ NAMA <span class="text-yellow-neon">"' + val + '"</span> SUDAH DIPAKAI PEMAIN LAIN!<br/>Silakan pilih nama yang berbeda.';
        errEl.classList.remove('hidden');
        nameInput.value = '';
        nameInput.focus();
        if (window.soundFX) window.soundFX.playReject();
        return;
      }

      // Hapus error duplikat jika ada
      const errRemove = nameModal.querySelector('#name-taken-error');
      if (errRemove) errRemove.remove();

      this.username = val;
      localStorage.setItem('retro_player_name', val);
      
      headerUserName.textContent = val;
      userDisplayName.textContent = val;
      
      nameModal.classList.add('hidden');
      window.retroStore.registerPlayer(this.username, this.selectedAvatar);
      this.renderTerminalChatLog(container);
      if (window.soundFX) window.soundFX.playCoin();
    };

    saveNameBtn.addEventListener('click', handleSaveName);
    nameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSaveName();
    });

    changeNameBtn.addEventListener('click', () => {
      nameModal.classList.remove('hidden');
      nameInput.focus();
      if (window.soundFX) window.soundFX.playClick();
    });

    // Unified Avatar Configuration
    const AVATAR_CONFIG = {
      'sports_esports':          { name: 'GAMER', icon: 'sports_esports', colorClass: 'text-cyan-neon', borderClass: 'border-cyan-neon', activeBg: 'bg-cyan-400 text-black shadow-[0_0_12px_#00ffff]', idleBg: 'bg-[#0f2436] text-cyan-neon' },
      'swords':                  { name: 'WARRIOR', icon: 'swords', colorClass: 'text-tertiary', borderClass: 'border-tertiary', activeBg: 'bg-fuchsia-400 text-black shadow-[0_0_12px_#ffabf3]', idleBg: 'bg-[#360f2c] text-tertiary' },
      'star':                    { name: 'STAR', icon: 'star', colorClass: 'text-yellow-neon', borderClass: 'border-yellow-neon', activeBg: 'bg-yellow-400 text-black shadow-[0_0_12px_#eaea00]', idleBg: 'bg-[#36320f] text-yellow-neon' },
      'smart_toy':               { name: 'ROBOT', icon: 'smart_toy', colorClass: 'text-emerald-400', borderClass: 'border-emerald-400', activeBg: 'bg-emerald-400 text-black shadow-[0_0_12px_#34d399]', idleBg: 'bg-[#0f3622] text-emerald-400' },
      'local_fire_department':  { name: 'FIRE MAGE', icon: 'local_fire_department', colorClass: 'text-orange-400', borderClass: 'border-orange-500', activeBg: 'bg-orange-500 text-white shadow-[0_0_12px_#ff5722]', idleBg: 'bg-[#36190f] text-orange-400' },
      'skull':                   { name: 'SHADOW NINJA', icon: 'skull', colorClass: 'text-purple-400', borderClass: 'border-purple-400', activeBg: 'bg-purple-500 text-white shadow-[0_0_12px_#b026ff]', idleBg: 'bg-[#280f36] text-purple-400' }
    };

    const avatarBtns = container.querySelectorAll('#avatar-selector button');
    const activeBadge = container.querySelector('#active-avatar-badge');

    const updateActiveAvatarUI = (newAvatarKey) => {
      this.selectedAvatar = newAvatarKey;
      const conf = AVATAR_CONFIG[newAvatarKey] || AVATAR_CONFIG['star'];

      avatarBtns.forEach(btn => {
        const key = btn.getAttribute('data-avatar');
        const itemConf = AVATAR_CONFIG[key] || AVATAR_CONFIG['star'];
        const isCurrent = (key === newAvatarKey);

        btn.className = `avatar-btn aspect-square border-2 ${itemConf.borderClass} flex items-center justify-center transition-all ${
          isCurrent 
            ? `${itemConf.activeBg} scale-110 z-10 border-4` 
            : `${itemConf.idleBg} opacity-80 hover:opacity-100 hover:scale-105`
        }`;

        const icon = btn.querySelector('.material-symbols-outlined');
        if (icon) {
          icon.className = `material-symbols-outlined text-lg ${isCurrent ? 'text-black' : itemConf.colorClass}`;
        }
      });

      if (activeBadge) {
        activeBadge.textContent = `★ ${conf.name}`;
        activeBadge.className = `font-mono text-[9px] font-extrabold px-2 py-0.5 bg-black border ${conf.borderClass} ${conf.colorClass}`;
      }

      if (this.username) {
        window.retroStore.registerPlayer(this.username, this.selectedAvatar);
      }
    };

    // Set initial active state
    updateActiveAvatarUI(this.selectedAvatar || 'star');

    avatarBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-avatar');
        updateActiveAvatarUI(key);
        if (window.soundFX) window.soundFX.playClick();
      });
    });

    const sendBtn = container.querySelector('#btn-send-message');
    const inputField = container.querySelector('#chat-input');
    const successOverlay = container.querySelector('#success-overlay');
    const closeOverlayBtn = container.querySelector('#btn-close-overlay');

    const handleSend = () => {
      if (this.isSending) return;

      if (!this.username) {
        nameModal.classList.remove('hidden');
        nameInput.focus();
        return;
      }

      const text = inputField.value.trim();
      if (!text) {
        inputField.focus();
        return;
      }

      this.isSending = true;
      window.retroStore.sendMessage(this.username, text, this.selectedAvatar);
      inputField.value = '';
      this.renderTerminalChatLog(container);
      successOverlay.classList.remove('hidden');

      setTimeout(() => {
        this.isSending = false;
      }, 1000);
    };

    sendBtn.addEventListener('click', handleSend);
    inputField.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleSend();
      }
    });

    closeOverlayBtn.addEventListener('click', () => {
      successOverlay.classList.add('hidden');
      if (window.soundFX) window.soundFX.playClick();
    });

    // Interactive D-PAD Controls (Up/Down = Scroll Terminal Chat, Left/Right = Switch Avatar)
    const logContainer = container.querySelector('#terminal-chat-log');
    const avatarList = ['sports_esports', 'swords', 'star', 'smart_toy', 'local_fire_department', 'skull'];

    const triggerPullAnimation = (direction) => {
      if (!logContainer) return;
      logContainer.classList.remove('rubberband-up-active', 'rubberband-down-active');
      void logContainer.offsetWidth; // Trigger reflow
      logContainer.classList.add(direction === 'up' ? 'rubberband-up-active' : 'rubberband-down-active');

      setTimeout(() => {
        if (logContainer) logContainer.classList.remove('rubberband-up-active', 'rubberband-down-active');
      }, 500);
    };

    const dpadUp = container.querySelector('#dpad-up');
    const dpadDown = container.querySelector('#dpad-down');
    const dpadLeft = container.querySelector('#dpad-left');
    const dpadRight = container.querySelector('#dpad-right');

    if (dpadUp) {
      dpadUp.addEventListener('click', () => {
        if (logContainer) {
          logContainer.scrollBy({ top: -70, behavior: 'smooth' });
          triggerPullAnimation('up');
        }
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    if (dpadDown) {
      dpadDown.addEventListener('click', () => {
        if (logContainer) {
          logContainer.scrollBy({ top: 70, behavior: 'smooth' });
          triggerPullAnimation('down');
        }
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    if (dpadLeft) {
      dpadLeft.addEventListener('click', () => {
        const currentIdx = avatarList.indexOf(this.selectedAvatar);
        const prevIdx = (currentIdx - 1 + avatarList.length) % avatarList.length;
        updateActiveAvatarUI(avatarList[prevIdx]);
        if (window.soundFX) window.soundFX.playClick();
      });
    }

    if (dpadRight) {
      dpadRight.addEventListener('click', () => {
        const currentIdx = avatarList.indexOf(this.selectedAvatar);
        const nextIdx = (currentIdx + 1) % avatarList.length;
        updateActiveAvatarUI(avatarList[nextIdx]);
        if (window.soundFX) window.soundFX.playClick();
      });
    }
  }
}

window.ControllerView = ControllerView;
