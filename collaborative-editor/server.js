const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');

// Supabase configuration using your service role key for admin operations
const SUPABASE_URL = 'https://vssawgkhmxsrkcowqckk.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzc2F3Z2tobXhzcmtjb3dxY2trIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczOTQ5Njg2OCwiZXhwIjoyMDU1MDcyODY4fQ.J25F4k8isFnXYYX-6Rjbv3gviwNYBR7cofi6fCOtHDU'; // Replace with your actual service role key

// Ensure your Supabase JWT secret is available (set this in your environment)
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET || 'YgczKdAtOwpcqnxXl7917BEpwk17+MfmopvXt5Q/KFwdp0P5ofKEM2tnKtSTr0Agt5qQQ1/SkKql1Lx6E+iiHw=='; 

// Main Supabase client using the service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  credentials: true,
}));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Helper function: verify the token using jsonwebtoken and fetch the user's team from the profiles table.
async function getUserTeam(token) {
  if (!token) {
    throw new Error('No token provided');
  }
  console.log('getUserTeam: token received:', token);

  let decoded;
  try {
    decoded = jwt.verify(token, SUPABASE_JWT_SECRET);
  } catch (err) {
    console.error('JWT verification error:', err);
    throw new Error('Invalid token');
  }
  
  // Typically the user id is in decoded.sub
  const userId = decoded.sub;
  if (!userId) {
    throw new Error('No user id in token');
  }
  console.log('User id from token:', userId);

  // Query the profiles table using the main client to get the user's team_id.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('team_id')
    .eq('id', userId)
    .single();
  if (profileError || !profile) {
    console.error('Error fetching profile:', profileError);
    throw new Error('User profile not found');
  }
  console.log('User profile:', profile);
  return { user: { id: userId }, team_id: profile.team_id };
}

// Helper to compute an effective document ID based on team
function effectiveDocId(originalDocId, team_id) {
  if (originalDocId === "default") {
    return `default-${team_id}`;
  }
  return originalDocId;
}

io.on('connection', (socket) => {
  console.log('A user connected');

  // When joining a document, expect an object: { docId, token }
  socket.on('join-document', async (payload) => {
    console.log('join-document payload:', payload);
    if (typeof payload !== 'object' || !payload.docId || !payload.token) {
      console.error('join-document error: Payload must be an object with docId and token.');
      socket.emit('load-document', JSON.stringify({ type: "doc", content: [] }));
      return;
    }
    const { docId, token } = payload;
    try {
      const { team_id } = await getUserTeam(token);
      const effDocId = effectiveDocId(docId, team_id);
      console.log('join-document: effective doc id:', effDocId);
      socket.join(effDocId);
      socket.data.docId = effDocId;

      // Query for the document with the effective doc id and matching team_id.
      const { data, error } = await supabase
        .from('documents')
        .select('content')
        .eq('id', effDocId)
        .eq('team_id', team_id)
        .single();
      if (error) {
        console.error(`Error loading document ${effDocId}:`, error);
        socket.emit('load-document', JSON.stringify({ type: "doc", content: [] }));
        return;
      }
      const docObj = data?.content || { type: "doc", content: [] };
      socket.emit('load-document', JSON.stringify(docObj));
    } catch (err) {
      console.error('Unexpected error in join-document:', err);
      socket.emit('load-document', JSON.stringify({ type: "doc", content: [] }));
    }
  });

  // Broadcast real-time document edits using the effective doc id stored on the socket
  socket.on('edit-document', ({ content }) => {
    const effDocId = socket.data.docId;
    if (effDocId) {
      io.in(effDocId).emit('update-document', content);
    } else {
      console.error("edit-document error: no effective docId on socket");
    }
  });

  // When saving a document, expect an object: { docId, content, token }
  socket.on('save-document', async (payload) => {
    console.log('save-document payload:', payload);
    if (typeof payload !== 'object' || !payload.docId || !payload.token) {
      console.error('save-document error: Payload must be an object with docId, content, and token.');
      return;
    }
    const { docId, content, token } = payload;
    try {
      const { team_id } = await getUserTeam(token);
      const effDocId = effectiveDocId(docId, team_id);
      const docObj = JSON.parse(content);
      const { error } = await supabase.from('documents').upsert([{
        id: effDocId,
        content: docObj,
        team_id: team_id,
      }]);
      if (error) {
        console.error('Error saving document:', error);
      }
    } catch (err) {
      console.error('Unexpected error in save-document:', err);
    }
  });

  socket.on('add-comment', ({ docId, comment }) => {
    const effDocId = socket.data.docId || docId;
    socket.to(effDocId).emit('new-comment', comment);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
