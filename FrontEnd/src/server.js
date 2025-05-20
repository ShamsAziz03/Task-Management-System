import fs from 'fs/promises';
import { WebSocketServer } from 'ws';



const HISTORY_FILE = '../chatHistory.json';

const server = new WebSocketServer({ port: 8080 });

const clients = new Map();

// Load chat history from file
async function loadHistory() {
  try {
    const data = await fs.readFile(HISTORY_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Save chat history to file
async function saveHistory(history) {
  await fs.writeFile(HISTORY_FILE, JSON.stringify(history, null, 2));
}

// Generate a unique key for a chat between two users (order independent)
function getChatKey(user1, user2) {
  return [user1, user2].sort().join('|');
}

server.on('connection', async (socket) => {
  console.log('Client connected');
  let currentUser = null;

  socket.on('message', async (data) => {
    try {
      const parsed = JSON.parse(data);
      const { sender, recipient, message, type } = parsed;

      // On first message, register user and send chat history if recipient exists
      if (!currentUser) {
        currentUser = sender;
        clients.set(sender, socket);

        if (recipient) {
          const history = await loadHistory();
          const key = getChatKey(sender, recipient);
          const messages = history[key] || [];
          socket.send(JSON.stringify({ type: 'history', messages }));
        }
        return;
      }

      // Save message in history
      const history = await loadHistory();
      const key = getChatKey(sender, recipient);
      if (!history[key]) history[key] = [];
      history[key].push({ from: sender, message });
      await saveHistory(history);

      // Send message to recipient
      const recipientSocket = clients.get(recipient);
      if (recipientSocket && recipientSocket.readyState === WebSocket.OPEN) {
        recipientSocket.send(JSON.stringify({ type: 'chat', from: sender, message }));
      }

      // Echo message to sender
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'chat', from: sender, message }));
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  socket.on('close', () => {
    console.log('Client disconnected');
    if (currentUser) {
      clients.delete(currentUser);
    }
  });
});

console.log('WebSocket server running on ws://localhost:8080');