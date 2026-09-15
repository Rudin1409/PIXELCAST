// Admin View (Command Center / Moderator Dashboard) Logic

class AdminView {
  constructor() {
    this.container = null;
    this.currentTab = 'komando';
    this.autoFilterActive = true;
  }

  render(container) {
    this.container = container;
    container.innerHTML = `
      <div class="bg-background text-on-background font-body-md text-sm overflow-hidden h-screen flex flex-col selection:bg-tertiary selection:text-on-tertiary">
        <!-- Admin Header -->
        <header class="flex justify-between items-center w-full px-6 h-16 z-40 bg-background border-b-4 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] shrink-0">
          <div class="flex items-center gap-6">
            <h1 class="font-headline text-xl italic tracking-tighter text-black bg-cyan-neon px-3 py-1 font-extrabold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              🎮 PIXELCAST ADMIN
            </h1>
            <nav class="hidden md:flex gap-4" id="admin-top-nav">
              <button data-tab="komando" class="nav-tab-btn font-label-sm text-xs uppercase tracking-widest px-3 py-1 font-bold transition-all ${this.currentTab === 'komando' ? 'text-tertiary underline underline-offset-4' : 'text-on-surface hover:text-tertiary'}">
                🎮 PUSAT KOMANDO
              </button>
              <button data-tab="filter" class="nav-tab-btn font-label-sm text-xs uppercase tracking-widest px-3 py-1 font-bold transition-all ${this.currentTab === 'filter' ? 'text-tertiary underline underline-offset-4' : 'text-on-surface hover:text-tertiary'}">
                ⚡ FILTER SENSOR
              </button>
              <button data-tab="log" class="nav-tab-btn font-label-sm text-xs uppercase tracking-widest px-3 py-1 font-bold transition-all ${this.currentTab === 'log' ? 'text-tertiary underline underline-offset-4' : 'text-on-surface hover:text-tertiary'}">
                📜 LOG & ARSIP
              </button>
              <button data-tab="pengaturan" class="nav-tab-btn font-label-sm text-xs uppercase tracking-widest px-3 py-1 font-bold transition-all ${this.currentTab === 'pengaturan' ? 'text-tertiary underline underline-offset-4' : 'text-on-surface hover:text-tertiary'}">
                ⚙️ PENGATURAN
              </button>
            </nav>
          </div>
          <div class="flex items-center gap-3 pr-32 sm:pr-0">
            <button id="btn-toggle-admin-audio" class="px-2.5 py-1 text-xs border font-bold flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${window.soundFX && window.soundFX.adminMuted ? 'bg-red-950/80 text-red-400 border-red-500 hover:bg-red-900' : 'bg-emerald-950/80 text-emerald-400 border-emerald-500 hover:bg-emerald-900'}">
              <span class="material-symbols-outlined text-sm">${window.soundFX && window.soundFX.adminMuted ? 'volume_off' : 'volume_up'}</span>
              <span>${window.soundFX && window.soundFX.adminMuted ? 'SUARA ADMIN: SILENT (OFF)' : 'SUARA ADMIN: UNMUTE (ON)'}</span>
            </button>
            <div class="flex items-center gap-2 bg-error-container/40 border border-error px-2.5 py-1 text-xs font-label-sm text-white font-bold">
              <span class="w-2 h-2 bg-error rounded-full animate-ping"></span>
              <span>PANEL ADMIN MODERATOR</span>
            </div>
          </div>
        </header>

        <div class="flex flex-1 overflow-hidden">
          <!-- SideNavBar -->
          <aside class="hidden lg:flex flex-col h-full w-64 p-4 gap-3 bg-surface-container border-r-4 border-on-background shadow-[8px_0px_0px_0px_rgba(0,0,0,1)] z-30 shrink-0">
            <div class="mb-1">
              <p class="font-headline text-lg text-secondary font-bold">MODERATOR_01</p>
              <p class="font-label-sm text-[11px] uppercase tracking-widest text-tertiary font-bold">HEAD MODERATOR ACARA</p>
            </div>
            
            <div class="flex flex-col gap-2" id="admin-side-nav">
              <button data-tab="komando" class="side-tab-btn w-full text-left p-3 font-label-sm text-xs uppercase tracking-widest border-2 border-on-background transition-all font-bold ${this.currentTab === 'komando' ? 'bg-tertiary text-on-tertiary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'text-on-surface-variant hover:bg-primary-container'}">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">videogame_asset</span> PUSAT KOMANDO</span>
              </button>
              <button data-tab="filter" class="side-tab-btn w-full text-left p-3 font-label-sm text-xs uppercase tracking-widest border-2 border-on-background transition-all font-bold ${this.currentTab === 'filter' ? 'bg-tertiary text-on-tertiary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'text-on-surface-variant hover:bg-primary-container'}">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">shield</span> FILTER SENSOR</span>
              </button>
              <button data-tab="log" class="side-tab-btn w-full text-left p-3 font-label-sm text-xs uppercase tracking-widest border-2 border-on-background transition-all font-bold ${this.currentTab === 'log' ? 'bg-tertiary text-on-tertiary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'text-on-surface-variant hover:bg-primary-container'}">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">history</span> LOG & ARSIP</span>
              </button>
              <button data-tab="pengaturan" class="side-tab-btn w-full text-left p-3 font-label-sm text-xs uppercase tracking-widest border-2 border-on-background transition-all font-bold ${this.currentTab === 'pengaturan' ? 'bg-tertiary text-on-tertiary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'text-on-surface-variant hover:bg-primary-container'}">
                <span class="flex items-center gap-2"><span class="material-symbols-outlined text-sm">settings</span> PENGATURAN</span>
              </button>
            </div>

            <!-- Spotlight Status Indicator -->
            <div id="spotlight-status-box" class="mt-2 p-3 border-2 border-on-background bg-surface-container-high text-xs">
              <div class="text-yellow-neon font-bold flex justify-between items-center">
                <span>SPOTLIGHT:</span>
                <span id="spotlight-status-text" class="text-on-surface-variant font-bold">MATI</span>
              </div>
            </div>

            <div class="mt-auto">
              <div class="p-3 bg-surface-container-high border-2 border-on-background text-xs mb-3">
                <div class="text-cyan-neon font-bold flex justify-between">
                  <span>FIREBASE:</span>
                  <span class="text-emerald-400 font-bold">ONLINE 🔥</span>
                </div>
                <div class="text-on-surface-variant font-mono text-[10px] mt-1 font-bold">retro-live-chat-wall</div>
              </div>
            </div>
          </aside>

          <!-- Dynamic Panel Content Mount -->
          <main class="flex-1 flex flex-col overflow-hidden p-4 md:p-6 bg-surface-dim scanline-overlay relative" id="admin-main-panel">
          </main>
        </div>

        <!-- Floating System Notice -->
        <div id="system-notice" class="fixed bottom-4 right-4 w-80 md:w-96 bg-yellow-neon text-black border-4 border-black p-3.5 z-40 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <div class="flex justify-between items-center mb-1">
            <span class="font-label-sm text-[10px] text-black/70 uppercase font-bold">💡 CARA MENYOROT PESAN</span>
            <span id="close-notice" class="material-symbols-outlined text-black text-sm cursor-pointer font-bold">close</span>
          </div>
          <p class="font-body-md text-xs leading-tight font-bold">
            Klik tombol kuning <span class="bg-black text-yellow-neon px-1">★ SOROT KE PANGGUNG</span> pada kartu pesan di bawah. Pesan langsung membesar di layar proyektor!
          </p>
        </div>
      </div>
    `;

    this.bindNavigation();
    this.renderCurrentTabPanel();
    this.bindStore();

    const toggleAudioBtn = container.querySelector('#btn-toggle-admin-audio');
    if (toggleAudioBtn) {
      toggleAudioBtn.addEventListener('click', () => {
        if (window.soundFX) {
          const isMuted = window.soundFX.toggleAdminMute();
          toggleAudioBtn.className = `px-2.5 py-1 text-xs border font-bold flex items-center gap-1.5 transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${isMuted ? 'bg-red-950/80 text-red-400 border-red-500 hover:bg-red-900' : 'bg-emerald-950/80 text-emerald-400 border-emerald-500 hover:bg-emerald-900'}`;
          toggleAudioBtn.innerHTML = `
            <span class="material-symbols-outlined text-sm">${isMuted ? 'volume_off' : 'volume_up'}</span>
            <span>${isMuted ? 'SUARA ADMIN: SILENT (OFF)' : 'SUARA ADMIN: UNMUTE (ON)'}</span>
          `;
        }
      });
    }

    const closeNotice = container.querySelector('#close-notice');
    if (closeNotice) {
      closeNotice.addEventListener('click', () => {
        container.querySelector('#system-notice').classList.add('hidden');
      });
    }
  }

  bindNavigation() {
    const topTabBtns = this.container.querySelectorAll('#admin-top-nav button');
    const sideTabBtns = this.container.querySelectorAll('#admin-side-nav button');

    const handleTabChange = (tab) => {
      this.currentTab = tab;
      topTabBtns.forEach(btn => {
        const isCurrent = btn.getAttribute('data-tab') === tab;
        btn.className = `nav-tab-btn font-label-sm text-xs uppercase tracking-widest px-3 py-1 font-bold transition-all ${isCurrent ? 'text-tertiary underline underline-offset-4' : 'text-on-surface hover:text-tertiary'}`;
      });
      sideTabBtns.forEach(btn => {
        const isCurrent = btn.getAttribute('data-tab') === tab;
        btn.className = `side-tab-btn w-full text-left p-3 font-label-sm text-xs uppercase tracking-widest border-2 border-on-background transition-all font-bold ${isCurrent ? 'bg-tertiary text-on-tertiary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' : 'text-on-surface-variant hover:bg-primary-container'}`;
      });
      this.renderCurrentTabPanel();
      if (window.soundFX) window.soundFX.playClick();
    };

    topTabBtns.forEach(btn => btn.addEventListener('click', () => handleTabChange(btn.getAttribute('data-tab'))));
    sideTabBtns.forEach(btn => btn.addEventListener('click', () => handleTabChange(btn.getAttribute('data-tab'))));
  }

  renderCurrentTabPanel() {
    const mainPanel = this.container.querySelector('#admin-main-panel');
    if (!mainPanel) return;

    if (this.currentTab === 'filter') {
      this.renderFilterPanel(mainPanel);
    } else if (this.currentTab === 'log') {
      this.renderLogPanel(mainPanel);
    } else if (this.currentTab === 'pengaturan') {
      this.renderPengaturanPanel(mainPanel);
    } else {
      this.renderKomandoPanel(mainPanel);
    }
  }

  renderKomandoPanel(mainPanel) {
    mainPanel.innerHTML = `
      <div class="flex-1 flex flex-col md:flex-row overflow-hidden gap-6 h-full">
        <!-- Column 1: Incoming Queue (Pending Messages) -->
        <section class="flex-1 flex flex-col h-full gap-4 min-w-0">
          <div class="flex items-center justify-between border-b-4 border-on-background pb-2 shrink-0">
            <h2 class="font-headline text-xl md:text-2xl uppercase font-bold text-primary">ANTREAN MASUK</h2>
            <span id="pending-count-badge" class="px-3 py-1 bg-error-container text-on-error-container font-label-sm text-xs border-2 border-on-background font-bold">0 TERTUNDA</span>
          </div>
          <div id="pending-list" class="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 custom-scrollbar"></div>
        </section>

        <!-- Column 2: Live On Screen (Approved Messages) -->
        <section class="flex-1 flex flex-col h-full gap-4 min-w-0">
          <div class="flex items-center justify-between border-b-4 border-on-background pb-2 shrink-0">
            <h2 class="font-headline text-xl md:text-2xl uppercase font-bold text-yellow-neon">SEDANG TAYANG</h2>
            <div class="flex items-center gap-2">
              <button id="btn-spotlight-off" class="px-2.5 py-1 bg-error text-white font-label-sm text-xs border-2 border-on-background font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 transition-colors flex items-center gap-1">
                <span class="material-symbols-outlined text-sm">visibility_off</span>
                MATIKAN SOROTAN
              </button>
              <span class="flex items-center gap-1.5 bg-black px-2 py-1 border border-on-background">
                <span class="w-2.5 h-2.5 bg-error rounded-full animate-pulse"></span>
                <span class="font-label-sm text-xs font-bold text-on-surface">LIVE</span>
              </span>
            </div>
          </div>
          
          <div id="approved-list" class="flex-1 bg-black border-4 border-on-background p-4 md:p-6 flex flex-col gap-4 relative overflow-y-auto custom-scrollbar">
            <div id="approved-items" class="flex flex-col gap-4 relative z-10"></div>
          </div>
        </section>
      </div>
    `;

    this.updateUI();

    const spotlightOffBtn = mainPanel.querySelector('#btn-spotlight-off');
    if (spotlightOffBtn) {
      spotlightOffBtn.addEventListener('click', () => {
        window.retroStore.spotlightOff();
        this.updateSpotlightStatus();
      });
    }
  }

  renderFilterPanel(mainPanel) {
    mainPanel.innerHTML = `
      <div class="flex-1 bg-surface-container border-4 border-on-background p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        <div class="border-b-4 border-on-background pb-4 flex justify-between items-center">
          <div>
            <h2 class="font-headline text-2xl uppercase font-bold text-tertiary flex items-center gap-2">
              <span class="material-symbols-outlined text-2xl">shield</span> FILTER SENSOR
            </h2>
            <p class="text-xs text-on-surface-variant mt-1 font-label-sm">Kelola kata-kata terlarang untuk menyaring pesan otomatis.</p>
          </div>
          <button id="toggle-autofilter" class="px-4 py-2 border-2 border-on-background font-label-sm text-xs font-bold uppercase transition-all ${this.autoFilterActive ? 'bg-emerald-600 text-white' : 'bg-surface-variant text-on-surface'} shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            ${this.autoFilterActive ? '✓ AUTO-REJECT AKTIF' : '✗ AUTO-REJECT MATI'}
          </button>
        </div>
        <div class="bg-surface-container-high border-2 border-on-background p-4 flex gap-4 items-center">
          <input id="new-word-input" class="flex-1 bg-[#0c0d14] border-4 border-cyan-neon p-3 text-sm font-mono font-bold text-yellow-neon uppercase focus:outline-none placeholder:text-gray-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]" placeholder="Ketik kata terlarang baru..." type="text" />
          <button id="btn-add-word" class="px-6 py-3 bg-tertiary text-on-tertiary font-label-sm text-xs font-bold uppercase border-2 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95">+ TAMBAH KATA</button>
        </div>
        <div>
          <h3 class="font-headline text-lg uppercase font-bold text-cyan-neon mb-3">DAFTAR KATA DIBLOKIR:</h3>
          <div id="blocked-words-tags" class="flex flex-wrap gap-3">
            ${window.retroStore.blockedWords.map(word => `
              <div class="bg-surface-container-highest border-2 border-on-background px-3 py-1.5 flex items-center gap-2 font-mono text-xs text-white font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <span>⛔ ${word.toUpperCase()}</span>
                <span data-word="${word}" class="btn-remove-word material-symbols-outlined text-xs cursor-pointer text-error hover:scale-125 transition-transform font-bold">close</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    const addBtn = mainPanel.querySelector('#btn-add-word');
    const input = mainPanel.querySelector('#new-word-input');
    const toggleBtn = mainPanel.querySelector('#toggle-autofilter');

    if (addBtn && input) {
      const addWord = () => {
        const val = input.value.trim().toLowerCase();
        if (val && !window.retroStore.blockedWords.includes(val)) {
          window.retroStore.blockedWords.push(val);
          window.retroStore.saveBlockedWords();
          input.value = '';
          this.renderFilterPanel(mainPanel);
          if (window.soundFX) window.soundFX.playApprove();
        }
      };
      addBtn.addEventListener('click', addWord);
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') addWord(); });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.autoFilterActive = !this.autoFilterActive;
        window.retroStore.autoRejectProfanity = this.autoFilterActive;
        this.renderFilterPanel(mainPanel);
      });
    }

    mainPanel.querySelectorAll('.btn-remove-word').forEach(btn => {
      btn.addEventListener('click', () => {
        window.retroStore.blockedWords = window.retroStore.blockedWords.filter(w => w !== btn.getAttribute('data-word'));
        window.retroStore.saveBlockedWords();
        this.renderFilterPanel(mainPanel);
      });
    });
  }

  renderLogPanel(mainPanel) {
    const allMsgs = window.retroStore.messages || [];
    const approvedCount = allMsgs.filter(m => m.status === 'approved').length;
    const rejectedCount = allMsgs.filter(m => m.status === 'rejected' || m.flagged).length;
    const pendingCount = allMsgs.filter(m => m.status === 'pending' && !m.flagged).length;

    mainPanel.innerHTML = `
      <div class="flex-1 bg-surface-container border-4 border-on-background p-6 flex flex-col gap-5 overflow-hidden">
        
        <!-- Header & Export Action Bar -->
        <div class="border-b-4 border-on-background pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
          <div>
            <h2 class="font-headline text-2xl uppercase font-bold text-cyan-neon flex items-center gap-2">
              <span class="material-symbols-outlined text-2xl">history_edu</span> LOG & ARSIP PESAN EVENT
            </h2>
            <p class="text-xs text-on-surface-variant font-label-sm mt-0.5">Riwayat lengkap aktivitas obrolan, status moderasi, dan audit sensor.</p>
          </div>
          
          <button id="btn-export-csv" class="px-5 py-2.5 bg-yellow-neon hover:bg-yellow-400 text-black font-label-sm text-xs font-bold uppercase border-2 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all flex items-center gap-2 cursor-pointer">
            <span class="material-symbols-outlined text-base">download_for_offline</span>
            <span>📥 EKSPOR LAPORAN CSV (EXCEL)</span>
          </button>
        </div>

        <!-- Summary Statistics Bar -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 shrink-0">
          <div class="bg-surface-container-high border-2 border-on-background p-3 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span class="font-label-sm text-[10px] text-cyan-neon font-bold uppercase">TOTAL CHAT</span>
            <span class="font-mono text-xl font-extrabold text-white mt-1">${allMsgs.length} PESAN</span>
          </div>
          <div class="bg-surface-container-high border-2 border-on-background p-3 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span class="font-label-sm text-[10px] text-emerald-400 font-bold uppercase">DISETUJUI (LIVE)</span>
            <span class="font-mono text-xl font-extrabold text-emerald-400 mt-1">${approvedCount} PESAN</span>
          </div>
          <div class="bg-surface-container-high border-2 border-on-background p-3 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span class="font-label-sm text-[10px] text-error font-bold uppercase">DITOLAK / SENSOR</span>
            <span class="font-mono text-xl font-extrabold text-error mt-1">${rejectedCount} PESAN</span>
          </div>
          <div class="bg-surface-container-high border-2 border-on-background p-3 flex flex-col justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <span class="font-label-sm text-[10px] text-yellow-neon font-bold uppercase">TERTUNDA</span>
            <span class="font-mono text-xl font-extrabold text-yellow-neon mt-1">${pendingCount} PESAN</span>
          </div>
        </div>

        <!-- Real-time Filter & Search Input -->
        <div class="flex flex-col md:flex-row gap-3 items-center shrink-0 bg-surface-container-high border-2 border-on-background p-3">
          <div class="flex-1 w-full relative">
            <span class="material-symbols-outlined absolute left-3 top-2.5 text-cyan-neon text-base">search</span>
            <input id="log-search-input" type="text" placeholder="Cari nama pemain atau kata pesan..." class="w-full bg-[#0c0d14] border-2 border-cyan-neon p-2 pl-9 text-xs font-mono font-bold text-yellow-neon uppercase focus:outline-none placeholder:text-gray-500" />
          </div>
          <div class="flex gap-1.5 w-full md:w-auto" id="log-filter-tabs">
            <button data-filter="all" class="btn-log-filter px-3 py-1.5 border-2 border-on-background font-label-sm text-[11px] font-bold uppercase bg-tertiary text-on-tertiary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">SEMUA</button>
            <button data-filter="approved" class="btn-log-filter px-3 py-1.5 border-2 border-on-background font-label-sm text-[11px] font-bold uppercase bg-surface-variant text-on-surface hover:bg-emerald-950 hover:text-emerald-400">DISETUJUI</button>
            <button data-filter="rejected" class="btn-log-filter px-3 py-1.5 border-2 border-on-background font-label-sm text-[11px] font-bold uppercase bg-surface-variant text-on-surface hover:bg-red-950 hover:text-red-400">SENSOR/DITOLAK</button>
          </div>
        </div>

        <!-- Log Data Table -->
        <div class="flex-1 overflow-y-auto border-2 border-on-background custom-scrollbar bg-black">
          <table class="w-full text-left border-collapse font-mono text-xs" id="log-table">
            <thead class="bg-surface-container-highest border-b-2 border-on-background sticky top-0 font-bold text-tertiary z-10 shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              <tr>
                <th class="p-3 w-16 text-center">NO</th>
                <th class="p-3 w-24">WAKTU</th>
                <th class="p-3 w-36">PEMAIN</th>
                <th class="p-3">PESAN PUBLIK</th>
                <th class="p-3 w-44">AUDIT SENSOR</th>
                <th class="p-3 w-28 text-center">STATUS</th>
              </tr>
            </thead>
            <tbody id="log-table-body" class="divide-y divide-on-background/20 bg-[#07080d] text-on-surface">
              ${this.renderLogTableRows(allMsgs)}
            </tbody>
          </table>
        </div>

      </div>
    `;

    // Handlers
    const searchInput = mainPanel.querySelector('#log-search-input');
    const filterBtns = mainPanel.querySelectorAll('.btn-log-filter');
    const tableBody = mainPanel.querySelector('#log-table-body');
    const exportBtn = mainPanel.querySelector('#btn-export-csv');

    let currentFilter = 'all';

    const filterAndRenderTable = () => {
      const query = (searchInput ? searchInput.value : '').trim().toLowerCase();
      let filtered = allMsgs;

      if (currentFilter === 'approved') {
        filtered = filtered.filter(m => m.status === 'approved');
      } else if (currentFilter === 'rejected') {
        filtered = filtered.filter(m => m.status === 'rejected' || m.flagged);
      }

      if (query) {
        filtered = filtered.filter(m => 
          m.user.toLowerCase().includes(query) || 
          m.text.toLowerCase().includes(query) ||
          (m.originalText && m.originalText.toLowerCase().includes(query))
        );
      }

      if (tableBody) tableBody.innerHTML = this.renderLogTableRows(filtered);
    };

    if (searchInput) {
      searchInput.addEventListener('input', filterAndRenderTable);
    }

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.className = 'btn-log-filter px-3 py-1.5 border-2 border-on-background font-label-sm text-[11px] font-bold uppercase bg-surface-variant text-on-surface hover:text-cyan-neon');
        btn.className = 'btn-log-filter px-3 py-1.5 border-2 border-on-background font-label-sm text-[11px] font-bold uppercase bg-tertiary text-on-tertiary shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]';
        currentFilter = btn.getAttribute('data-filter');
        filterAndRenderTable();
      });
    });

    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        this.exportLogToCSV(allMsgs);
      });
    }
  }

  renderLogTableRows(msgs) {
    if (!msgs || msgs.length === 0) {
      return `<tr><td colspan="6" class="p-8 text-center text-on-surface-variant font-label-sm uppercase font-bold">TIDAK ADA DATA PESAN TERDOKUMENTASI</td></tr>`;
    }

    return msgs.map((m, index) => {
      const statusTag = m.status === 'approved'
        ? '<span class="px-2 py-0.5 border text-[10px] font-bold uppercase bg-emerald-950 text-emerald-400 border-emerald-500">LIVE ACC</span>'
        : (m.status === 'rejected' || m.flagged
          ? '<span class="px-2 py-0.5 border text-[10px] font-bold uppercase bg-red-950 text-red-400 border-red-500">REJECTED</span>'
          : '<span class="px-2 py-0.5 border text-[10px] font-bold uppercase bg-yellow-950 text-yellow-400 border-yellow-500">PENDING</span>');

      const auditTag = m.flagged
        ? `<span class="text-red-400 font-bold text-[11px]">⚠️ ${m.flagReason || 'KATA SENSOR'}</span>`
        : `<span class="text-emerald-400/60 text-[11px]">✓ BERSIH</span>`;

      return `
        <tr class="hover:bg-surface-container-high transition-colors ${m.flagged ? 'bg-red-950/10' : ''}">
          <td class="p-3 text-center text-on-surface-variant font-bold">${index + 1}</td>
          <td class="p-3 text-on-surface-variant font-mono">${m.timestamp}</td>
          <td class="p-3 font-bold text-cyan-neon flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm text-yellow-neon">${m.avatar || 'star'}</span>
            ${m.user}
          </td>
          <td class="p-3 font-mono font-bold text-white max-w-xs break-words">"${m.text}"</td>
          <td class="p-3">${auditTag}</td>
          <td class="p-3 text-center">${statusTag}</td>
        </tr>
      `;
    }).join('');
  }

  exportLogToCSV(msgs) {
    if (!msgs || msgs.length === 0) {
      alert('ℹ️ Belum ada data log obrolan untuk diekspor!');
      return;
    }

    const AVATAR_NAMES = {
      'sports_esports': 'GAMER',
      'swords': 'WARRIOR',
      'star': 'CHAMPION',
      'smart_toy': 'ROBOT',
      'local_fire_department': 'FIRE MAGE',
      'skull': 'SHADOW NINJA'
    };

    const cleanCell = (val) => {
      if (val === null || val === undefined) return '';
      // Bersihkan enter & karakter titik koma agar tidak merusak struktur sel Excel
      let str = String(val).replace(/[\r\n]+/g, ' ').replace(/"/g, '""').trim();
      // Jika mengandung titik koma atau spasi, bungkus dengan kutip
      if (str.includes(';') || str.includes('"')) {
        return `"${str}"`;
      }
      return str;
    };

    // Gunakan Delimiter Titik Koma (;) - Standar Utama Microsoft Excel Indonesia
    // Tanpa BOM \uFEFF agar tidak muncul karakter aneh ï»¿ di sel A1!
    // Langsung mulai dari Judul Kolom di Baris 1 agar Excel langsung membuat Tabel Rapi!
    let csvContent = "";

    // Baris 1: Judul Kolom (Header Tabel)
    const headers = [
      "NO",
      "WAKTU KIRIM",
      "NAMA PEMAIN",
      "AVATAR KARAKTER",
      "STATUS MODERASI",
      "PESAN PUBLIK",
      "TEKS ASLI",
      "CATATAN SENSOR"
    ];
    csvContent += headers.join(";") + "\n";

    // Baris 2+: Data Log Obrolan
    msgs.forEach((m, idx) => {
      const avatarName = AVATAR_NAMES[m.avatar] || (m.avatar ? m.avatar.toUpperCase() : 'CHAMPION');
      const statusText = m.status === 'approved' ? 'DISETUJUI' : (m.status === 'rejected' || m.flagged ? 'DITOLAK / SENSOR' : 'PENDING');
      const auditNote = m.flagged ? (m.flagReason || 'KATA SENSOR') : 'BERSIH';

      const row = [
        idx + 1,
        cleanCell(m.timestamp),
        cleanCell(m.user),
        cleanCell(avatarName),
        cleanCell(statusText),
        cleanCell(m.text),
        cleanCell(m.originalText || m.text),
        cleanCell(auditNote)
      ];
      csvContent += row.join(";") + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestampStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '_');
    link.setAttribute("href", url);
    link.setAttribute("download", `Log_Obrolan_PixelCast_${timestampStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    if (window.soundFX) window.soundFX.playApprove();
  }

  renderPengaturanPanel(mainPanel) {
    mainPanel.innerHTML = `
      <div class="flex-1 bg-surface-container border-4 border-on-background p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        <div class="border-b-4 border-on-background pb-4">
          <h2 class="font-headline text-2xl uppercase font-bold text-yellow-neon flex items-center gap-2">
            <span class="material-symbols-outlined text-2xl">settings</span> PENGATURAN
          </h2>
        </div>
        <!-- PIN Security Settings -->
        <div class="bg-surface-container-high border-2 border-on-background p-5 flex flex-col gap-3">
          <h3 class="font-headline text-base font-bold text-yellow-neon uppercase flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">lock</span> KODE PIN KEAMANAN OPERATOR ADMIN:
          </h3>
          <p class="text-xs text-on-surface-variant font-label-sm leading-relaxed">
            Ubah PIN Keamanan Admin untuk mencegah peserta atau pihak luar membuka Dashboard Admin tanpa izin.
          </p>
          <form id="change-pin-form" class="flex flex-col sm:flex-row gap-3 mt-1">
            <input id="new-pin-input" type="password" maxlength="8" placeholder="Ketik PIN Baru (misal: 8888)..." class="flex-1 bg-[#0c0d14] border-2 border-cyan-neon p-2.5 text-xs font-mono font-bold text-yellow-neon focus:outline-none placeholder:text-gray-500" />
            <button type="submit" class="px-5 py-2.5 bg-cyan-neon text-black font-label-sm text-xs font-bold uppercase border-2 border-on-background shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-cyan-300 active:scale-95 transition-all cursor-pointer">
              💾 SIMPAN PIN BARU
            </button>
          </form>
          <div id="pin-change-status" class="hidden text-xs font-mono font-bold text-emerald-400">
            ✓ PIN Keamanan Operator Berhasil Diperbarui!
          </div>
        </div>

        <div class="bg-surface-container-high border-2 border-on-background p-5 flex flex-col gap-3">
          <h3 class="font-headline text-base font-bold text-error uppercase flex items-center gap-2">
            <span class="material-symbols-outlined text-lg">delete_forever</span> RESET DATA EVENT (LOKAL & FIREBASE CLOUD):
          </h3>
          <p class="text-xs text-on-surface-variant font-label-sm leading-relaxed">
            Hapus total seluruh pesan di antrean, layar panggung utama, memori browser, dan <strong>Database Cloud Firebase Firestore</strong> secara bersamaan untuk memulai sesi acara baru.
          </p>
          <button id="btn-reset-messages" class="py-3 bg-error hover:bg-red-600 text-white font-label-sm text-xs font-bold uppercase border-2 border-on-background shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:scale-95 flex items-center justify-center gap-2 mt-2 transition-colors cursor-pointer">
            <span class="material-symbols-outlined text-sm">delete_forever</span> 💣 BERSIHKAN SEMUA DATA (RESET CLOUD & LOKAL)
          </button>
        </div>
      </div>
    `;

    const changePinForm = mainPanel.querySelector('#change-pin-form');
    const newPinInput = mainPanel.querySelector('#new-pin-input');
    const pinStatus = mainPanel.querySelector('#pin-change-status');

    if (changePinForm && newPinInput) {
      changePinForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const val = newPinInput.value.trim();
        if (val.length < 4) {
          alert('⚠️ PIN minimal harus 4 karakter/angka!');
          return;
        }
        localStorage.setItem('pixelcast_admin_pin', val);
        newPinInput.value = '';
        if (pinStatus) {
          pinStatus.classList.remove('hidden');
          setTimeout(() => pinStatus.classList.add('hidden'), 3000);
        }
        if (window.soundFX) window.soundFX.playApprove();
      });
    }
    const resetBtn = mainPanel.querySelector('#btn-reset-messages');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (confirm('⚠️ PERINGATAN BERSAMA:\n\nApakah Anda yakin ingin MENGHAPUS TOTAL SEMUA PESAN?\n\nTindakan ini akan mengosongkan layar panggung, antrean admin, dan seluruh dokumen di Cloud Database Firebase Firestore.')) {
          await window.retroStore.clearAllData();
          alert('✅ Sukses! Semua data pesan di lokal & Cloud Database Firebase Firestore telah dibersihkan total.');
          this.renderCurrentTabPanel();
        }
      });
    }
  }

  bindStore() {
    window.retroStore.subscribe((eventType, payload) => {
      if (this.currentTab === 'komando') {
        // HANYA render ulang kartu pesan, BUKAN spotlight
        if (eventType !== 'spotlight_changed') {
          this.updateUI();
        }
      }
      // Update spotlight status indicator di sidebar
      this.updateSpotlightStatus();
    });
  }

  updateSpotlightStatus() {
    const statusText = this.container.querySelector('#spotlight-status-text');
    if (!statusText) return;
    const spotlight = window.retroStore.getSpotlight();
    if (spotlight) {
      statusText.textContent = '🔆 AKTIF: ' + spotlight.user;
      statusText.className = 'text-yellow-neon font-bold animate-pulse';
    } else {
      statusText.textContent = 'MATI';
      statusText.className = 'text-on-surface-variant font-bold';
    }
  }

  updateUI() {
    if (!this.container || this.currentTab !== 'komando') return;

    const pendingList = this.container.querySelector('#pending-list');
    const approvedItems = this.container.querySelector('#approved-items');
    const pendingCountBadge = this.container.querySelector('#pending-count-badge');

    if (!pendingList || !approvedItems) return;

    const pendingMsgs = window.retroStore.getPendingMessages();
    const approvedMsgs = window.retroStore.getApprovedMessages();
    const currentSpotlight = window.retroStore.getSpotlight();

    pendingCountBadge.textContent = `${pendingMsgs.length} TERTUNDA`;

    // === PENDING LIST ===
    if (pendingMsgs.length === 0) {
      pendingList.innerHTML = `
        <div class="bg-surface-container-high border-4 border-on-background p-8 text-center text-on-surface-variant font-label-sm">
          <span class="material-symbols-outlined text-4xl mb-2 text-cyan-neon">check_circle</span>
          <p class="uppercase font-bold text-sm">TIDAK ADA ANTREAN TERTUNDA</p>
          <p class="text-xs opacity-70 mt-1">Pesan baru dari peserta akan muncul secara real-time.</p>
        </div>
      `;
    } else {
      pendingList.innerHTML = pendingMsgs.map(msg => `
        <div class="bg-surface-container-high border-4 ${msg.flagged ? 'border-red-500 bg-red-950/40' : 'border-on-background'} p-4 relative hover:bg-surface-container-highest transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <div class="flex justify-between items-start mb-2">
            <span class="font-label-sm text-xs font-bold text-tertiary flex items-center gap-1.5">
              <span class="material-symbols-outlined text-xs text-cyan-neon">${msg.avatar || 'star'}</span>
              ${msg.user}
            </span>
            <span class="font-label-sm text-[11px] text-on-surface-variant font-mono">${msg.timestamp}</span>
          </div>

          ${msg.flagged ? `
            <div class="flex flex-col gap-1.5 mb-3 bg-red-950/80 border-2 border-red-500 p-2.5 rounded">
              <div class="text-red-300 font-mono text-xs font-bold uppercase flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm text-red-400">warning</span>
                <span>⚠️ TERDETEKSI KATA TERLARANG: <strong class="text-white underline">${msg.flagReason || 'SENSOR'}</strong></span>
              </div>
              <p class="font-mono text-xs text-red-300 font-bold">TEKS PESAN: "${msg.originalText || msg.text}"</p>
            </div>
            <div class="flex gap-2">
              <button data-action="reject" data-id="${msg.id}" class="w-full py-2.5 bg-red-700 hover:bg-red-600 text-white font-label-sm text-xs border-2 border-on-background flex items-center justify-center gap-1.5 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95">
                <span class="material-symbols-outlined text-sm">block</span> ⛔ TOLAK / HAPUS PESAN SENSOR
              </button>
            </div>
          ` : `
            <p class="font-body-md text-sm text-on-surface leading-snug mb-3.5 font-mono font-bold">"${msg.text}"</p>
            <div class="flex gap-2">
              <button data-action="approve" data-id="${msg.id}" class="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-label-sm text-xs border-2 border-on-background flex items-center justify-center gap-1 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95">
                <span class="material-symbols-outlined text-sm">check_circle</span> SETUJUI
              </button>
              <button data-action="spotlight" data-id="${msg.id}" class="py-2 px-3 bg-yellow-neon hover:bg-yellow-400 text-black font-label-sm text-xs border-2 border-on-background flex items-center justify-center gap-1 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95">
                <span class="material-symbols-outlined text-sm">star</span> ★ SOROT KE PANGGUNG
              </button>
              <button data-action="reject" data-id="${msg.id}" class="py-2 px-3 bg-error hover:bg-red-600 text-white font-label-sm text-xs border-2 border-on-background flex items-center justify-center gap-1 font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95">
                <span class="material-symbols-outlined text-sm">cancel</span> TOLAK
              </button>
            </div>
          `}
        </div>
      `).join('');
    }

    // === APPROVED LIST ===
    if (approvedMsgs.length === 0) {
      approvedItems.innerHTML = `<div class="p-6 text-center text-on-surface-variant font-label-sm text-xs border-2 border-dashed border-on-background/40">BELUM ADA PESAN DIPUBLIKASIKAN</div>`;
    } else {
      const isSpotlit = (id) => currentSpotlight && currentSpotlight.id === id;

      approvedItems.innerHTML = approvedMsgs.map(msg => `
        <div class="flex flex-col gap-2.5 bg-[#0c0d14] border-2 ${isSpotlit(msg.id) ? 'border-yellow-neon bg-yellow-neon/15 shadow-[0_0_15px_rgba(234,234,0,0.3)]' : 'border-on-background/70'} p-3.5 relative hover:border-cyan-neon transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
          <!-- Header: User Avatar & Name + Timestamp -->
          <div class="flex justify-between items-center pb-1.5 border-b border-on-background/20">
            <span class="font-label-sm text-xs font-bold ${isSpotlit(msg.id) ? 'text-yellow-neon' : 'text-cyan-neon'} flex items-center gap-1.5">
              <span class="material-symbols-outlined text-sm text-yellow-neon">${msg.avatar || 'star'}</span>
              @${msg.user}:
            </span>
            <div class="flex items-center gap-2">
              ${isSpotlit(msg.id) ? '<span class="text-[9px] font-bold text-black bg-yellow-neon px-1.5 py-0.5 animate-pulse uppercase">★ DISOROT ★</span>' : ''}
              <span class="font-label-sm text-[10px] text-on-surface-variant font-mono">${msg.timestamp || ''}</span>
            </div>
          </div>

          <!-- Message Body -->
          <p class="font-headline text-base text-white uppercase italic font-bold leading-snug">"${msg.text}"</p>

          <!-- Action Toolbar: SOROT, TARIK KEMBALI, HAPUS -->
          <div class="flex flex-wrap gap-2 pt-1 border-t border-on-background/20 mt-1">
            <!-- 1. Tombol Sorot Panggung -->
            <button data-action="spotlight" data-id="${msg.id}" class="flex-1 py-1.5 px-2.5 ${isSpotlit(msg.id) ? 'bg-error text-white animate-pulse' : 'bg-yellow-neon hover:bg-yellow-400 text-black'} border-2 border-on-background flex items-center justify-center gap-1 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all">
              <span class="material-symbols-outlined text-sm">${isSpotlit(msg.id) ? 'visibility_off' : 'star'}</span>
              <span>${isSpotlit(msg.id) ? '✖ MATIKAN SOROTAN' : '★ SOROT KE PANGGUNG'}</span>
            </button>

            <!-- 2. Tombol Tarik (Turunkan dari Tayang / Batal Tayang) -->
            <button data-action="unapprove" data-id="${msg.id}" class="py-1.5 px-3 bg-surface-container-high hover:bg-surface-variant text-yellow-neon hover:text-white border-2 border-yellow-neon/80 flex items-center justify-center gap-1 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all" title="Tarik pesan dari panggung kembali ke Antrean Masuk">
              <span class="material-symbols-outlined text-sm">undo</span>
              <span>↩ TARIK</span>
            </button>

            <!-- 3. Tombol Hapus Langsung -->
            <button data-action="reject" data-id="${msg.id}" class="py-1.5 px-2.5 bg-red-950/80 hover:bg-red-600 text-red-300 hover:text-white border-2 border-red-500 flex items-center justify-center gap-1 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:scale-95 transition-all" title="Hapus pesan permanen">
              <span class="material-symbols-outlined text-sm">delete</span>
              <span>✖ HAPUS</span>
            </button>
          </div>
        </div>
      `).join('');
    }

    // === BIND CLICK HANDLERS ===
    this.container.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        const id = btn.getAttribute('data-id');

        if (action === 'approve') {
          window.retroStore.approveMessage(id);
          this.updateUI();
        } else if (action === 'unapprove') {
          window.retroStore.unapproveMessage(id);
          this.updateUI();
        } else if (action === 'reject') {
          window.retroStore.rejectMessage(id);
          this.updateUI();
        } else if (action === 'spotlight') {
          const spotlight = window.retroStore.getSpotlight();
          if (spotlight && spotlight.id === id) {
            // Sudah nyala untuk pesan ini → matikan
            window.retroStore.spotlightOff();
          } else {
            // Nyalakan spotlight dengan DATA PESAN LENGKAP
            const msg = window.retroStore.messages.find(m => m.id === id);
            if (msg) {
              window.retroStore.spotlightOn(msg);
            }
          }
          this.updateSpotlightStatus();
          this.updateUI(); // Refresh tampilan tombol
        }
      });
    });
  }
}

window.AdminView = AdminView;
