// Firebase Real-time Firestore Integration Module (Compat Synchronous Version)

const firebaseConfig = {
  apiKey: "AIzaSyDoKECNdxs6htoAgpTnFMCWJghRQUu04wU",
  authDomain: "retro-live-chat-wall.firebaseapp.com",
  projectId: "retro-live-chat-wall",
  storageBucket: "retro-live-chat-wall.firebasestorage.app",
  messagingSenderId: "507345359383",
  appId: "1:507345359383:web:47c3271ab87b3b0ebb8252",
  measurementId: "G-PGQH2CM80E"
};

class FirebaseSyncService {
  constructor() {
    this.db = null;
    this.isInitialized = false;
    this.statusText = 'OFFLINE';
  }

  // Inisialisasi Firebase & Firestore Listeners secara langsung
  init(onDataUpdate, onPlayersUpdate) {
    if (typeof firebase === 'undefined') {
      console.warn('⚠️ Firebase SDK belum dimuat di browser.');
      return false;
    }

    try {
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }
      this.db = firebase.firestore();
      this.isInitialized = true;
      this.statusText = 'ONLINE 🔥 (retro-live-chat-wall)';
      console.log('⚡ FIREBASE FIRESTORE TERHUBUNG BERHASIL (Project: retro-live-chat-wall)');

      // 1. Real-time Messages Listener
      this.db.collection('messages').onSnapshot((snapshot) => {
        const firebaseMessages = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          firebaseMessages.push({
            id: docSnap.id,
            user: data.user,
            avatar: data.avatar,
            text: data.text,
            status: data.status,
            timestamp: data.timeStr || new Date().toLocaleTimeString('id-ID', { hour12: false }),
            highlighted: !!data.highlighted,
            flagged: !!data.flagged,
            flagReason: data.flagReason || null,
            rawTime: data.createdAt ? (data.createdAt.seconds || 0) : 0
          });
        });
        firebaseMessages.sort((a, b) => a.rawTime - b.rawTime);
        if (onDataUpdate) onDataUpdate(firebaseMessages);
      }, (error) => {
        console.warn('⚠️ Firestore messages listener notice:', error.message);
        if (error.message.includes('permission')) {
          console.error('⛔ ATURAN FIREBASE: Pastikan di Firebase Console -> Firestore Database -> Rules diset "allow read, write: if true;" untuk testing!');
        }
      });

      // 2. Real-time Active Players Listener
      this.db.collection('players').onSnapshot((snapshot) => {
        const activePlayers = [];
        snapshot.forEach((docSnap) => {
          activePlayers.push({ id: docSnap.id, ...docSnap.data() });
        });
        if (onPlayersUpdate) onPlayersUpdate(activePlayers);
      }, (error) => {
        console.warn('⚠️ Firestore players listener notice:', error.message);
      });

      return true;
    } catch (err) {
      console.error('⚠️ Gagal inisialisasi Firestore:', err);
      return false;
    }
  }

  // Register / update active player presence in Firestore keyed by deviceId
  async registerPlayer(username, avatar, deviceId) {
    if (!this.isInitialized || !this.db) return;
    try {
      const docId = deviceId || username.replace(/\s+/g, '_').toLowerCase();
      await this.db.collection('players').doc(docId).set({
        deviceId: docId,
        username: username,
        avatar: avatar || 'star',
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
        timeJoined: new Date().toLocaleTimeString('id-ID', { hour12: false })
      }, { merge: true });
    } catch (e) {
      console.warn('ℹ️ Firestore registerPlayer notice:', e.message);
    }
  }

  // Kirim pesan baru ke Firestore dengan status & text yang sinkron 1-to-1
  async sendMessage(user, text, avatar, flagged = false, flagReason = null, status = 'pending', originalText = null) {
    if (!this.isInitialized || !this.db) return null;
    try {
      const docRef = await this.db.collection('messages').add({
        user: (user || 'ANONYMOUS_PLAYER').toUpperCase(),
        avatar: avatar || 'star',
        text: text,
        originalText: originalText || text,
        status: status,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        timeStr: new Date().toLocaleTimeString('id-ID', { hour12: false }),
        highlighted: false,
        flagged: flagged,
        flagReason: flagReason
      });
      return docRef.id;
    } catch (e) {
      console.warn('ℹ️ Firestore sendMessage notice:', e.message);
      if (e.message.includes('permission')) {
        alert('ℹ️ FIREBASE RULES: Buka Firebase Console -> Firestore Database -> Rules -> Ubah menjadi "allow read, write: if true;" agar data tersimpan ke cloud Firebase!');
      }
      return null;
    }
  }

  // Approve pesan di Firestore
  async approveMessage(id) {
    if (!this.isInitialized || !this.db) return;
    try {
      await this.db.collection('messages').doc(id).update({ status: 'approved' });
    } catch (e) {
      console.warn('ℹ️ Firestore approveMessage notice:', e.message);
    }
  }

  // Reject / hapus pesan di Firestore
  async rejectMessage(id) {
    if (!this.isInitialized || !this.db) return;
    try {
      await this.db.collection('messages').doc(id).delete();
    } catch (e) {
      console.warn('ℹ️ Firestore rejectMessage notice:', e.message);
    }
  }

  // Toggle Highlight / Sorot Bintang di Firestore
  async toggleHighlight(id, currentStatus) {
    if (!this.isInitialized || !this.db) return;
    try {
      await this.db.collection('messages').doc(id).update({ highlighted: !currentStatus });
    } catch (e) {
      console.warn('ℹ️ Firestore toggleHighlight notice:', e.message);
    }
  }

  // Clear all messages from Firestore Cloud Database
  async clearAllMessages() {
    if (!this.isInitialized || !this.db) return;
    try {
      const snapshot = await this.db.collection('messages').get();
      const batch = this.db.batch();
      snapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
      console.log('⚡ FIREBASE: Semua pesan di Cloud Database Firestore telah dibersihkan total!');
    } catch (e) {
      console.warn('ℹ️ Firestore clearAllMessages notice:', e.message);
    }
  }

  // Clear all active players from Firestore Cloud Database
  async clearAllPlayers() {
    if (!this.isInitialized || !this.db) return;
    try {
      const snapshot = await this.db.collection('players').get();
      const batch = this.db.batch();
      snapshot.docs.forEach((docSnap) => {
        batch.delete(docSnap.ref);
      });
      await batch.commit();
      console.log('⚡ FIREBASE: Semua daftar pemain di Cloud Database Firestore telah dibersihkan total!');
    } catch (e) {
      console.warn('ℹ️ Firestore clearAllPlayers notice:', e.message);
    }
  }
}

window.firebaseSync = new FirebaseSyncService();
