// State Store & Multi-Channel Real-time Synchronizer

class RetroStore {
  constructor() {
    this.messages = this.loadFromStorage();
    this.activePlayers = [];
    this.userCount = 0;
    this.socket = null;
    this.listeners = [];
    this.channel = new BroadcastChannel('retro_chat_wall_channel');
    this.blockedWords = this.loadBlockedWords();
    this.autoRejectProfanity = true;
    this.useFirebase = false;

    // =====================================================
    // SPOTLIGHT SYSTEM: Variabel terpisah yang TIDAK PERNAH
    // bisa ditimpa oleh Firebase onSnapshot atau sync lainnya.
    // Ini SATU-SATUNYA sumber kebenaran sorotan.
    // =====================================================
    this._spotlight = null; // { id, user, avatar, text } atau null

    this.cleanLocalStorageDemoData();

    // BroadcastChannel sync across local tabs
    this.channel.onmessage = (event) => {
      const { type, data } = event.data;
      if (type === 'SYNC_STATE') {
        this.messages = data.messages || [];
        this.activePlayers = data.activePlayers || [];
        this.userCount = data.userCount || 1;
        this.notify();
      } else if (type === 'REGISTER_PLAYER') {
        this.addActivePlayer(data.username, data.avatar);
      } else if (type === 'ADD_MESSAGE') {
        const exists = this.messages.some(m => m.id === data.id);
        if (!exists) {
          this.messages.push(data);
          this.saveToStorage();
          this.notify('message_added', data);
        }
      } else if (type === 'APPROVE_MESSAGE') {
        const msg = this.messages.find(m => m.id === data);
        if (msg) {
          msg.status = 'approved';
          this.saveToStorage();
          this.notify('message_approved', msg);
        }
      } else if (type === 'REJECT_MESSAGE') {
        this.messages = this.messages.filter(m => m.id !== data);
        this.saveToStorage();
        this.notify('message_rejected', data);
      } else if (type === 'SPOTLIGHT_ON') {
        // Data spotlight langsung dikirim — tidak bergantung pada messages[]
        this._spotlight = data; // { id, user, avatar, text }
        this.notify('spotlight_changed', this._spotlight);
      } else if (type === 'SPOTLIGHT_OFF') {
        this._spotlight = null;
        this.notify('spotlight_changed', null);
      } else if (type === 'CLEAR_ALL_DATA') {
        this.messages = [];
        this.activePlayers = [];
        this.userCount = 0;
        this._spotlight = null;
        localStorage.removeItem('retro_messages');
        this.notify();
        this.notify('players_updated', []);
      }
    };

    // Firebase Firestore Listener Initialization
    if (window.firebaseSync) {
      window.firebaseSync.init(
        (firebaseMessages) => {
          this.useFirebase = true;
          if (Array.isArray(firebaseMessages)) {
            if (firebaseMessages.length === 0) {
              // Jika Firebase cloud kosong (setelah reset/clear), kosongkan pesan lokal secara mutlak!
              this.messages = [];
            } else {
              firebaseMessages.forEach(fm => {
                // 1. Match by exact Firebase ID
                const idxById = this.messages.findIndex(m => m.id === fm.id);
                if (idxById !== -1) {
                  this.messages[idxById] = fm;
                  return;
                }

                // 2. Match by content with temporary local message (id starts with 'msg-')
                const localMatchIdx = this.messages.findIndex(
                  m => m.id.startsWith('msg-') && m.user === fm.user && 
                       (m.text === fm.text || m.originalText === fm.originalText || m.originalText === fm.text || m.text === fm.originalText)
                );
                if (localMatchIdx !== -1) {
                  this.messages[localMatchIdx] = fm; // Ganti pesan temp lokal dengan pesan sah dari Firebase
                  return;
                }

                // 3. Jika belum ada sama sekali, tambahkan
                const existsContent = this.messages.some(
                  m => m.user === fm.user && (m.text === fm.text || m.originalText === fm.text) && m.timestamp === fm.timestamp
                );
                if (!existsContent) {
                  this.messages.push(fm);
                }
              });

              // Hapus pesan temp lokal yang sudah terwakili di Firebase
              const firebaseIds = new Set(firebaseMessages.map(m => m.id));
              this.messages = this.messages.filter(m => {
                if (m.id.startsWith('msg-')) {
                  const hasCloudVersion = firebaseMessages.some(fm => fm.user === m.user && (fm.text === m.text || fm.originalText === m.originalText || fm.originalText === m.text));
                  return !hasCloudVersion;
                }
                return firebaseIds.has(m.id);
              });
            }

            this.saveToStorage();
            this.notify();
          }
        },
        (firebasePlayers) => {
          if (firebasePlayers) {
            this.activePlayers = firebasePlayers;
            this.userCount = Math.max(1, firebasePlayers.length);
            this.notify('players_updated', this.activePlayers);
          }
        }
      );
    }

    if (window.io) {
      try {
        this.socket = window.io();
        this.initSocketEvents();
      } catch (e) {
        console.log('[STORE] Running in BroadcastChannel local mode.');
      }
    }
  }

  loadBlockedWords() {
    const saved = localStorage.getItem('retro_blocked_words');
    const defaultWords = ['kasar', 'spam', 'promosi', 'toxic', 'anjing', 'babi', 'kontol', 'memek', 'jancok', 'bangsat', 'kampret', 'goblok', 'tolol'];
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch(e) {}
    }
    return defaultWords;
  }

  saveBlockedWords() {
    localStorage.setItem('retro_blocked_words', JSON.stringify(this.blockedWords));
    this.reEvaluateAllMessagesProfanity();
  }

  reEvaluateAllMessagesProfanity() {
    this.messages.forEach(m => {
      const lowerText = (m.originalText || m.text || '').toLowerCase();
      const detectedWords = this.blockedWords.filter(w => w && w.trim() !== '' && lowerText.includes(w.toLowerCase().trim()));
      const hasProfanity = detectedWords.length > 0;
      if (hasProfanity) {
        m.flagged = true;
        m.flagReason = `TERSENSOR (${detectedWords.join(', ').toUpperCase()})`;
        m.text = this.censorText(m.originalText || m.text);
        if (this.autoRejectProfanity && m.status === 'pending') {
          m.status = 'rejected';
        }
      }
    });
    this.saveToStorage();
    this.notify();
  }

  censorText(text) {
    let cleanText = text;
    this.blockedWords.forEach(word => {
      if (!word || !word.trim()) return;
      const cleanWord = word.trim().toLowerCase();
      const regex = new RegExp(cleanWord.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      cleanText = cleanText.replace(regex, (match) => {
        if (match.length <= 2) return '*'.repeat(match.length);
        return match[0] + '*'.repeat(match.length - 2) + match[match.length - 1];
      });
    });
    return cleanText;
  }

  cleanLocalStorageDemoData() {
    // Purge demo items and remove any duplicates by user + text
    const seen = new Set();
    this.messages = this.messages.filter(m => {
      if (!m.id || m.id.startsWith('msg-demo-')) return false;
      const key = `${m.user}_${m.text}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    this.saveToStorage();
  }

  loadFromStorage() {
    const saved = localStorage.getItem('retro_messages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(m => m.id && !m.id.startsWith('msg-demo-'));
        }
      } catch (e) {}
    }
    return [];
  }

  saveToStorage() {
    localStorage.setItem('retro_messages', JSON.stringify(this.messages));
  }

  getDeviceId() {
    let id = localStorage.getItem('pixelcast_device_id');
    if (!id) {
      id = 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
      localStorage.setItem('pixelcast_device_id', id);
    }
    return id;
  }

  getUserSession() {
    const saved = localStorage.getItem('pixelcast_user_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username) return parsed;
      } catch (e) {}
    }
    return null;
  }

  // Cek apakah nama sudah dipakai oleh perangkat/HP lain
  isNameTaken(username) {
    if (!username) return false;
    const cleanName = username.trim().toUpperCase();
    const myDeviceId = this.getDeviceId();
    
    // Cek di daftar pemain aktif lokal
    const taken = this.activePlayers.some(p => 
      p.username.toUpperCase() === cleanName && p.deviceId !== myDeviceId
    );
    return taken;
  }

  registerPlayer(username, avatar) {
    const deviceId = this.getDeviceId();
    const cleanName = (username || 'ANONYMOUS_PLAYER').trim();
    
    // Simpan sesi perangkat lokal
    const session = { deviceId, username: cleanName, avatar: avatar || 'star', lastActive: Date.now() };
    localStorage.setItem('pixelcast_user_session', JSON.stringify(session));

    this.addActivePlayer(cleanName, avatar, deviceId);

    if (window.firebaseSync && window.firebaseSync.isInitialized) {
      window.firebaseSync.registerPlayer(cleanName, avatar, deviceId);
    } else {
      this.channel.postMessage({ type: 'REGISTER_PLAYER', data: { username: cleanName, avatar, deviceId } });
    }
  }

  addActivePlayer(username, avatar, deviceId) {
    const devId = deviceId || (username ? 'dev_' + username.toLowerCase().replace(/\s+/g, '_') : 'dev_anon');
    const existingIndex = this.activePlayers.findIndex(p => (p.deviceId && p.deviceId === devId) || p.username.toLowerCase() === username.toLowerCase());

    const playerData = {
      deviceId: devId,
      username: username,
      avatar: avatar || 'star',
      timeJoined: new Date().toLocaleTimeString('id-ID', { hour12: false }),
      lastActive: Date.now()
    };

    if (existingIndex !== -1) {
      // Update data pemain yang sudah ada (tidak bikin baris duplikat)
      this.activePlayers[existingIndex] = { ...this.activePlayers[existingIndex], ...playerData };
    } else {
      this.activePlayers.unshift(playerData);
    }

    this.userCount = this.activePlayers.length;
    this.notify('players_updated', this.activePlayers);
  }

  initSocketEvents() {
    this.socket.on('init_data', (data) => {
      const rawMsgs = data.messages || [];
      const cleanMsgs = rawMsgs.filter(m => m.id && !m.id.startsWith('msg-demo-'));
      cleanMsgs.forEach(m => {
        if (!this.messages.some(existing => existing.id === m.id)) {
          this.messages.push(m);
        }
      });
      this.userCount = data.userCount || this.userCount;
      this.saveToStorage();
      this.notify();
    });

    this.socket.on('message_added', (msg) => {
      const exists = this.messages.some(m => m.id === msg.id);
      if (!exists) {
        this.messages.push(msg);
        this.saveToStorage();
        this.notify('message_added', msg);
      }
    });

    this.socket.on('message_approved', (msg) => {
      const target = this.messages.find(m => m.id === msg.id);
      if (target) {
        target.status = 'approved';
      } else {
        this.messages.push(msg);
      }
      this.saveToStorage();
      this.notify('message_approved', msg);
    });

    this.socket.on('message_rejected', (id) => {
      this.messages = this.messages.filter(m => m.id !== id);
      this.saveToStorage();
      this.notify('message_rejected', id);
    });

    this.socket.on('user_count_update', (count) => {
      this.userCount = count;
      this.notify('user_count_update', count);
    });
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notify(eventType = 'state_change', payload = null) {
    this.listeners.forEach(fn => fn(eventType, payload));
  }

  sendMessage(user, text, avatar) {
    this.registerPlayer(user, avatar);

    const formattedUser = (user || 'ANONYMOUS_PLAYER').toUpperCase();
    const lowerText = text.toLowerCase();
    
    // DETEKSI KATA SENSOR
    const detectedWords = this.blockedWords.filter(w => w && w.trim() !== '' && lowerText.includes(w.toLowerCase().trim()));
    const hasProfanity = detectedWords.length > 0;
    const censoredText = hasProfanity ? this.censorText(text) : text;

    // GUARD: Cegah pesan ganda persis dari pemain yang sama dalam kurun waktu 3 detik
    const now = Date.now();
    const duplicate = this.messages.find(m => 
      m.user === formattedUser && 
      m.text === text &&
      (now - (m._createdAt || 0)) < 3000
    );
    if (duplicate) {
      console.log('[STORE] Duplicate message blocked');
      return duplicate;
    }

    const newMessage = {
      id: 'msg-' + now + '-' + Math.floor(Math.random() * 1000),
      user: formattedUser,
      avatar: avatar || 'star',
      text: censoredText,
      originalText: text,
      status: (hasProfanity && this.autoRejectProfanity) ? 'rejected' : 'pending',
      timestamp: new Date().toLocaleTimeString('id-ID', { hour12: false }),
      highlighted: false,
      flagged: hasProfanity,
      flagReason: hasProfanity ? `TERSENSOR (${detectedWords.join(', ').toUpperCase()})` : null,
      _createdAt: now
    };

    this.messages.push(newMessage);
    this.autoPruneMessages();
    this.saveToStorage();
    this.notify('message_added', newMessage);

    this.channel.postMessage({ type: 'ADD_MESSAGE', data: newMessage });

    if (window.firebaseSync && window.firebaseSync.isInitialized) {
      window.firebaseSync.sendMessage(user, censoredText, avatar, hasProfanity, newMessage.flagReason, newMessage.status, text);
    }

    if (this.socket && this.socket.connected) {
      this.socket.emit('send_message', { user, text, avatar });
    }

    if (window.soundFX) window.soundFX.playCoin();
    return newMessage;
  }

  autoPruneMessages() {
    if (this.messages.length > 50) {
      this.messages = this.messages.slice(-50);
      this.saveToStorage();
    }
  }

  async clearAllData() {
    this.messages = [];
    this.activePlayers = [];
    this.userCount = 0;
    this._spotlight = null;
    localStorage.removeItem('retro_messages');
    this.saveToStorage();
    this.notify();
    this.notify('players_updated', []);

    // Broadcast reset ke seluruh tab (Stage, Controller, Admin)
    this.channel.postMessage({ type: 'CLEAR_ALL_DATA' });

    // Hapus total semua pesan & daftar pemain di Cloud Database Firestore Firebase
    if (window.firebaseSync && window.firebaseSync.isInitialized) {
      await window.firebaseSync.clearAllMessages();
      await window.firebaseSync.clearAllPlayers();
    }
    if (window.soundFX) window.soundFX.playReject();
  }

  deleteOwnMessage(id) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.saveToStorage();
    this.notify('message_rejected', id);

    this.channel.postMessage({ type: 'REJECT_MESSAGE', data: id });

    if (window.firebaseSync && window.firebaseSync.isInitialized) {
      window.firebaseSync.rejectMessage(id);
    }
    if (window.soundFX) window.soundFX.playReject();
  }

  approveMessage(id) {
    const msg = this.messages.find(m => m.id === id);
    if (msg) {
      msg.status = 'approved';
      this.saveToStorage();
      this.notify('message_approved', msg);

      this.channel.postMessage({ type: 'APPROVE_MESSAGE', data: id });

      if (window.firebaseSync && window.firebaseSync.isInitialized) {
        window.firebaseSync.approveMessage(id);
      }
      if (this.socket && this.socket.connected) {
        this.socket.emit('approve_message', id);
      }
    }
    if (window.soundFX) window.soundFX.playApprove();
  }

  rejectMessage(id) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.saveToStorage();
    this.notify('message_rejected', id);

    this.channel.postMessage({ type: 'REJECT_MESSAGE', data: id });

    if (window.firebaseSync && window.firebaseSync.isInitialized) {
      window.firebaseSync.rejectMessage(id);
    }
    if (this.socket && this.socket.connected) {
      this.socket.emit('reject_message', id);
    }
    if (window.soundFX) window.soundFX.playReject();
  }

  spotlightOn(msgData) {
    const msg = this.messages.find(m => m.id === msgData.id);
    if (msg) msg.status = 'approved';

    this._spotlight = {
      id: msgData.id,
      user: msgData.user,
      avatar: msgData.avatar || 'star',
      text: msgData.text
    };

    this.saveToStorage();
    this.notify('spotlight_changed', this._spotlight);

    this.channel.postMessage({ type: 'SPOTLIGHT_ON', data: this._spotlight });

    if (window.firebaseSync && window.firebaseSync.isInitialized && msg) {
      window.firebaseSync.approveMessage(msgData.id);
    }

    if (window.soundFX) window.soundFX.playBoom();
  }

  spotlightOff() {
    this._spotlight = null;
    this.notify('spotlight_changed', null);

    this.channel.postMessage({ type: 'SPOTLIGHT_OFF', data: null });

    if (window.soundFX) window.soundFX.playClick();
  }

  getSpotlight() {
    return this._spotlight;
  }

  getPendingMessages() {
    // Re-evaluate pending messages against current blockedWords list dynamically
    this.messages.forEach(m => {
      if (m.status === 'pending') {
        const lowerText = (m.originalText || m.text || '').toLowerCase();
        const detectedWords = this.blockedWords.filter(w => w && w.trim() !== '' && lowerText.includes(w.toLowerCase().trim()));
        const hasProfanity = detectedWords.length > 0;
        if (hasProfanity) {
          m.flagged = true;
          m.flagReason = `TERSENSOR (${detectedWords.join(', ').toUpperCase()})`;
          m.text = this.censorText(m.originalText || m.text);
          if (this.autoRejectProfanity) {
            m.status = 'rejected';
          }
        }
      }
    });
    return this.messages.filter(m => m.status === 'pending');
  }

  getApprovedMessages() {
    return this.messages.filter(m => m.status === 'approved');
  }
}

window.retroStore = new RetroStore();
