const express = require('express');
const cors = require('cors');
const https = require('https');

const app = express();
const PORT = 5500;

app.use(cors());
app.use(express.json());

// --- LIVE DATA STORAGE ---
let livePosts = [];
let liveUsers = [];
let chatHistories = {};

// --- FETCH LIVE DATA FROM DUMMYJSON ---
const fetchData = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });
};

async function seedData() {
  try {
    const userData = await fetchData('https://dummyjson.com/users?limit=20');
    const postData = await fetchData('https://dummyjson.com/posts?limit=10');
    
    liveUsers = userData.users.map(u => ({
      id: u.id.toString(),
      name: `${u.firstName} ${u.lastName}`,
      avatar: u.image,
      username: u.username
    }));

    livePosts = postData.posts.map((p, i) => ({
      id: p.id,
      userId: p.userId,
      text: p.body,
      image: `https://picsum.photos/seed/${p.id}/600/400`,
      likes: p.reactions.likes,
      user: liveUsers.find(u => u.id == p.userId) || liveUsers[0]
    }));

    // Initialize Chat
    liveUsers.forEach(u => {
      chatHistories[u.id] = [
        { id: `init-${u.id}`, sender: 'bot', text: `Hi! I'm ${u.name}. How can I help?`, timestamp: new Date() }
      ];
    });

    console.log("🚀 Live Data Seeded Successfully");
  } catch (err) {
    console.error("Failed to seed live data", err);
  }
}

seedData();

// --- API ROUTES ---
app.get('/users', (req, res) => res.json(liveUsers));
app.get('/posts', (req, res) => res.json(livePosts));
app.get('/messages/:userId', (req, res) => res.json(chatHistories[req.params.userId] || []));

app.post('/chat/send', (req, res) => {
    const { userId, text } = req.body;
    if (!chatHistories[userId]) chatHistories[userId] = [];
    chatHistories[userId].push({ id: Date.now(), sender: 'user', text, timestamp: new Date() });
    
    setTimeout(() => {
        const reply = (text.toLowerCase().trim() === 'hi') ? "Hi, how can I help you?" : "That's interesting!";
        chatHistories[userId].push({ id: Date.now()+1, sender: 'bot', text: reply, timestamp: new Date() });
    }, 800);
    res.json({ success: true });
});

app.listen(PORT, '0.0.0.0', () => console.log(`Live Data Engine running on http://localhost:${PORT}`));
