const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

// Supabase setup
const SUPABASE_URL = 'https://vssawgkhmxsrkcowqckk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzc2F3Z2tobXhzcmtjb3dxY2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0OTY4NjgsImV4cCI6MjA1NTA3Mjg2OH0.aOnWAU-i3qn8RUOsmD_rLleRHFPtfXMc0wDjmihkAmg';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const app = express();

app.use(cors({ 
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST'],
  credentials: true 
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { 
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST'],
    credentials: true 
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join-document', async (docId) => {
    socket.join(docId);
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('content')
        .eq('id', docId)
        .single();

      if (error) {
        console.error(`Error loading document ${docId}:`, error);
        // Send a default doc as a JSON string
        socket.emit('load-document', JSON.stringify({ type: "doc", content: [] }));
        return;
      }

      const docObj = data?.content || { type: "doc", content: [] };
      socket.emit('load-document', JSON.stringify(docObj));
    } catch (err) {
      console.error('Unexpected error fetching document:', err);
    }
  });

  socket.on('edit-document', ({ docId, content }) => {
    // Broadcast real-time updates to all sockets in the room (including the sender)
    io.in(docId).emit('update-document', content);
  });

  socket.on('save-document', async ({ docId, content }) => {
    try {
      // Parse the JSON string into an object before saving
      const docObj = JSON.parse(content);
      const { error } = await supabase.from('documents').upsert([{ 
        id: docId, 
        content: docObj, 
        team_id: 1  // team_id added
      }]);
      if (error) {
        console.error('Error saving document:', error);
      }
    } catch (err) {
      console.error('Unexpected error in save-document event:', err);
    }
  });

  socket.on('add-comment', ({ docId, comment }) => {
    socket.to(docId).emit('new-comment', comment);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
