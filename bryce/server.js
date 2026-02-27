const express = require('express');
const { createServer } = require('http');
const WebSocket = require('ws');

const app = express();
const server = createServer(app);
const port = process.env.PORT || 10000;

// Simple HTTP endpoint for Render to check if app is alive
app.get('/', (req, res) => {
  res.send('WebSocket server is running');
});

// WebSocket server
const wss = new WebSocket.Server({ server });
const clients = new Map(); // id -> websocket

wss.on('connection', (ws) => {
  const id = Math.random().toString(36).substring(2, 8);
  clients.set(id, ws);
  console.log(`Client ${id} connected`);

  // Send list of existing users to the new client
  ws.send(JSON.stringify({
    type: 'users',
    users: Array.from(clients.keys())
  }));

  // Broadcast new user to everyone else
  clients.forEach((client, clientId) => {
    if (clientId !== id && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({
        type: 'join',
        id: id
      }));
    }
  });

  ws.on('message', (message) => {
    const data = JSON.parse(message);
    // Broadcast message to all OTHER clients
    clients.forEach((client, clientId) => {
      if (clientId !== id && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on('close', () => {
    clients.delete(id);
    console.log(`Client ${id} disconnected`);
  });
});

server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
