const fs = require('fs');
const path = require('path');
const http = require('http');

let app, server, io;
let isExpressAvailable = false;

try {
  const express = require('express');
  const { Server } = require('socket.io');
  const cors = require('cors');

  app = express();
  server = http.createServer(app);
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  app.use(cors());
  app.use(express.json());
  app.use(express.static(path.join(__dirname)));
  isExpressAvailable = true;
} catch (err) {
  console.log('---------------------------------------------------------');
  console.log('ℹ️ Module express/socket.io belum di-install.');
  console.log('⚡ Mengaktifkan Native Zero-Dependency Node.js Server...');
  console.log('---------------------------------------------------------');
}

// Real Data Store (Mulai dari Kosong tanpa Data Dummy)
let messages = [];
let connectedUsersCount = 1;
const PORT = process.env.PORT || 3000;

if (isExpressAvailable && io) {
  // Express + Socket.io Server Mode
  io.on('connection', (socket) => {
    connectedUsersCount++;
    socket.emit('init_data', { messages, userCount: connectedUsersCount });
    io.emit('user_count_update', connectedUsersCount);

    socket.on('send_message', (data) => {
      const newMessage = {
        id: 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
        user: (data.user || 'ANONYMOUS_PLAYER').toUpperCase(),
        avatar: data.avatar || 'star',
        text: data.text,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString('id-ID', { hour12: false }),
        highlighted: false
      };
      messages.push(newMessage);
      io.emit('message_added', newMessage);
    });

    socket.on('approve_message', (id) => {
      const msg = messages.find(m => m.id === id);
      if (msg) {
        msg.status = 'approved';
        io.emit('message_approved', msg);
      }
    });

    socket.on('reject_message', (id) => {
      const msgIndex = messages.findIndex(m => m.id === id);
      if (msgIndex !== -1) {
        messages.splice(msgIndex, 1);
        io.emit('message_rejected', id);
      }
    });

    socket.on('toggle_highlight', (id) => {
      messages.forEach(m => {
        m.highlighted = (m.id === id) ? !m.highlighted : false;
      });
      const activeHighlight = messages.find(m => m.highlighted) || null;
      io.emit('highlight_updated', activeHighlight);
    });

    socket.on('disconnect', () => {
      connectedUsersCount = Math.max(1, connectedUsersCount - 1);
      io.emit('user_count_update', connectedUsersCount);
    });
  });

  server.listen(PORT, () => {
    printServerBanner('EXPRESS + SOCKET.IO');
  });
} else {
  // Native Zero-Dependency HTTP Static & API Server Mode
  const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon'
  };

  server = http.createServer((req, res) => {
    if (req.url === '/api/data' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
      return res.end(JSON.stringify({ messages, userCount: connectedUsersCount }));
    }

    if (req.url === '/api/send' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        try {
          const data = JSON.parse(body);
          const newMessage = {
            id: 'msg-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            user: (data.user || 'ANONYMOUS_PLAYER').toUpperCase(),
            avatar: data.avatar || 'star',
            text: data.text,
            status: 'pending',
            timestamp: new Date().toLocaleTimeString('id-ID', { hour12: false }),
            highlighted: false
          };
          messages.push(newMessage);
          res.writeHead(200, { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });
          res.end(JSON.stringify({ success: true, message: newMessage }));
        } catch (e) {
          res.writeHead(400);
          res.end('Invalid JSON');
        }
      });
      return;
    }

    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url.split('#')[0].split('?')[0]);
    let extname = String(path.extname(filePath)).toLowerCase();
    let contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
      if (error) {
        if (error.code === 'ENOENT') {
          fs.readFile(path.join(__dirname, 'index.html'), (err, indexContent) => {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(indexContent, 'utf-8');
          });
        } else {
          res.writeHead(500);
          res.end('Server Error: ' + error.code);
        }
      } else {
        res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
        res.end(content, 'utf-8');
      }
    });
  });

  server.listen(PORT, () => {
    printServerBanner('NATIVE NODE.JS HTTP (ZERO-DEPENDENCY)');
  });
}

function printServerBanner(mode) {
  console.log(`=================================================`);
  console.log(` 🎮 RETRO LIVE CHAT WALL SERVER RUNNING `);
  console.log(` 🚀 Mode: ${mode}`);
  console.log(` 🌐 Akses Lokal: http://localhost:${PORT}`);
  console.log(` 📱 Layar Peserta (Controller): http://localhost:${PORT}/#controller`);
  console.log(` 🛡️ Dashboard Moderator (Admin): http://localhost:${PORT}/#admin`);
  console.log(` 📺 Layar Proyektor (Stage): http://localhost:${PORT}/#stage`);
  console.log(`=================================================`);
}
