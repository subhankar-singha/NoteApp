import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', body: '' });

  const fetchNotes = async () => {
    try {
      const res = await axios.get('http://localhost:3000/notes');
      setNotes(res.data.notes);
    } catch (err) {
      console.error("Error fetching notes", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.body) return;

    try {
      await axios.post('http://localhost:3000/note', form);
      setForm({ title: '', body: '' }); 
      fetchNotes(); 
    } catch (err) {
      console.error("Error posting note", err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="container">
      <h1 style={{ fontSize: '27  px' } }>📝 Notes App</h1>

      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <textarea
          placeholder="Body"
          value={form.body}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
        ></textarea>
        <button type="submit">Add Note</button>
      </form>

     
      <div>
        {notes.length === 0 ? (
          <p>No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.serialNo} className="note-card">
              <h3>{note.serialNo}. {note.title}</h3>
              <p>{note.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
