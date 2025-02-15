import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

// Note: Updated port to match the server's port (5001)
const socket = io('http://localhost:5001');

const App = () => {
  const [docId, setDocId] = useState('default');
  const [content, setContent] = useState('');
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    socket.emit('join-document', docId);

    socket.on('load-document', (data) => {
      setContent(data);
      setIsFirstLoad(false);
    });

    socket.on('update-document', (data) => {
      setContent(data);
    });

    socket.on('new-comment', (newComment) =>
      setComments((prev) => [...prev, newComment])
    );

    return () => {
      socket.off('load-document');
      socket.off('update-document');
      socket.off('new-comment');
    };
  }, [docId]);

  const handleEdit = (e) => {
    setContent(e.target.value);
    socket.emit('edit-document', { docId, content: e.target.value });
  };

  const handleComment = () => {
    if (comment.trim() !== '') {
      socket.emit('add-comment', { docId, comment });
      setComment('');
    }
  };

  return (
    <div>
      <h1>Real-time Text Editor</h1>
      <textarea
        value={content}
        onChange={handleEdit}
        rows={10}
        cols={50}
        placeholder="Start typing..."
      />
      <div>
        <h3>Comments</h3>
        <ul>
          {comments.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
        <input
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button onClick={handleComment}>Send</button>
      </div>
    </div>
  );
};

export default App;