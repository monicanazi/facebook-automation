import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, 
  Video, 
  Store, 
  Users, 
  LayoutGrid, 
  MessageCircle, 
  Bell, 
  Search,
  Image as ImageIcon,
  UserPlus,
  Smile,
  MoreHorizontal,
  ThumbsUp,
  MessageSquare,
  Share2,
  Send,
  Plus
} from 'lucide-react';
import axios from 'axios';

const App = () => {
  const [view, setView] = useState('feed'); // 'feed' or 'chat'
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    axios.get('/users').then(res => setUsers(res.data));
    axios.get('/posts').then(res => setPosts(res.data));
  }, []);

  const fetchMessages = () => {
    if (!selectedUser || view !== 'chat') return;
    axios.get(`/messages/${selectedUser.id}`).then(res => setMessages(res.data));
  };

  useEffect(() => {
    const interval = setInterval(fetchMessages, 2500);
    return () => clearInterval(interval);
  }, [selectedUser, view]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input || !selectedUser) return;
    const text = input; setInput('');
    axios.post('/chat/send', { userId: selectedUser.id, text }).then(() => fetchMessages());
  };

  const openChat = (user) => {
    setSelectedUser(user);
    setView('chat');
  };

  return (
    <div className="fb-hybrid-app">
      {/* NAVBAR */}
      <div className="fb-navbar">
        <div className="fb-nav-left">
          <div className="fb-logo" onClick={() => setView('feed')}>f</div>
          <div className="fb-search"><Search size={18} /><input placeholder="Search Facebook" /></div>
        </div>
        <div className="fb-nav-center">
          <div className={`fb-tab ${view === 'feed' ? 'active' : ''}`} onClick={() => setView('feed')}><Home size={28} /></div>
          <div className="fb-tab"><Video size={28} /></div>
          <div className="fb-tab"><Store size={28} /></div>
          <div className="fb-tab"><Users size={28} /></div>
          <div className="fb-tab"><LayoutGrid size={28} /></div>
        </div>
        <div className="fb-nav-right">
          <div className="fb-icon-btn"><LayoutGrid size={20} /></div>
          <div className="fb-icon-btn" onClick={() => setView('chat')}><MessageCircle size={20} /></div>
          <div className="fb-icon-btn"><Bell size={20} /></div>
          <div className="fb-icon-btn profile"><img src="https://i.pravatar.cc/150?u=me" /></div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="fb-body">
        {/* LEFT SIDEBAR */}
        <div className="fb-sidebar-left">
          <div className="fb-side-item active"><img src="https://i.pravatar.cc/150?u=me" /> Josephine Williams</div>
          <div className="fb-side-item"><Users color="#1877f2" /> Friends</div>
          <div className="fb-side-item"><Video color="#1877f2" /> Watch</div>
          <div className="fb-side-item"><MessageCircle color="#1877f2" /> Memories</div>
          <div className="fb-side-item"><Store color="#1877f2" /> Marketplace</div>
        </div>

        {/* MIDDLE COLUMN - DYNAMIC */}
        <div className="fb-main-feed">
          {view === 'feed' ? (
            <>
              {/* STORIES */}
              <div className="fb-stories">
                <div className="fb-story create">
                  <img src="https://i.pravatar.cc/150?u=me" />
                  <div className="fb-story-add"><Plus size={20} /></div>
                  <span>Create Story</span>
                </div>
                {users.slice(0, 4).map(u => (
                  <div key={u.id} className="fb-story" onClick={() => openChat(u)}>
                    <img src={`https://picsum.photos/seed/${u.id}/200/300`} className="fb-story-bg" />
                    <img src={u.avatar} className="fb-story-avatar" />
                    <span>{u.name}</span>
                  </div>
                ))}
              </div>

              {/* COMPOSER */}
              <div className="fb-card fb-composer">
                <div className="fb-comp-top">
                  <img src="https://i.pravatar.cc/150?u=me" />
                  <input placeholder="What's on your mind?" />
                </div>
                <div className="fb-divider" />
                <div className="fb-comp-bottom">
                  <div className="fb-action"><Video color="#f02849" /> Live Video</div>
                  <div className="fb-action"><ImageIcon color="#45bd62" /> Photo/Video</div>
                  <div className="fb-action"><Smile color="#f7b928" /> Feeling/Activity</div>
                </div>
              </div>

              {/* POSTS */}
              {posts.map(p => (
                <div key={p.id} className="fb-card fb-post">
                  <div className="fb-post-header">
                    <img src={p.user?.avatar} />
                    <div>
                      <div className="fb-user-name">{p.user?.name}</div>
                      <div className="fb-post-time">12h · 🌐</div>
                    </div>
                    <MoreHorizontal className="fb-more" />
                  </div>
                  <div className="fb-post-content">{p.text}</div>
                  <img src={p.image} className="fb-post-img" />
                  <div className="fb-divider" />
                  <div className="fb-post-actions">
                    <div className="fb-action"><ThumbsUp size={18} /> Like</div>
                    <div className="fb-action"><MessageSquare size={18} /> Comment</div>
                    <div className="fb-action"><Share2 size={18} /> Share</div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            /* MESSENGER VIEW */
            <div className="fb-card fb-messenger">
              <div className="fb-messenger-header">
                <img src={selectedUser?.avatar} />
                <div>{selectedUser?.name}</div>
              </div>
              <div className="fb-messenger-body" ref={scrollRef}>
                {messages.map((m, i) => (
                  <div key={i} className={`fb-msg ${m.sender === 'bot' ? 'received' : 'sent'}`}>
                    {m.text}
                  </div>
                ))}
              </div>
              <form className="fb-messenger-input" onSubmit={handleSend}>
                <input value={input} onChange={e => setInput(e.target.value)} placeholder="Aa" />
                <button type="submit"><Send size={20} color="#1877f2" /></button>
              </form>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR - CONTACTS */}
        <div className="fb-sidebar-right">
          <div className="fb-section-title">Contacts</div>
          {users.map(u => (
            <div key={u.id} className="fb-contact" onClick={() => openChat(u)}>
              <div className="fb-avatar-wrap">
                <img src={u.avatar} />
                <div className="fb-online-dot" />
              </div>
              {u.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
