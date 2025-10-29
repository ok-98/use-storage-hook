import React, { useState } from 'react';
import { useLocalStorage, useSessionStorage, useIndexedDBStorage } from '../lib';


interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface Note {
  id: number;
  title: string;
  content: string;
  createdAt: number;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  fontSize: number;
  notifications: boolean;
}

function App() {
  const [name, setName, removeName] = useLocalStorage<string>('userName', '');
  const [todos, setTodos, removeTodos] = useLocalStorage<Todo[]>('todos', []);
  const [sessionCount, setSessionCount, removeSessionCount] = useSessionStorage<number>('sessionCount', 0);
  const [notes, setNotes, removeNotes] = useIndexedDBStorage<Note[]>('notes', []);
  const [preferences, setPreferences, removePreferences] = useIndexedDBStorage<UserPreferences>('userPreferences', {
    theme: 'light',
    fontSize: 14,
    notifications: true,
  });

  const [newTodo, setNewTodo] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const addTodo = () => {
    if (newTodo.trim()) {
      setTodos([
        ...todos,
        {
          id: Date.now(),
          text: newTodo,
          completed: false,
        },
      ]);
      setNewTodo('');
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const addNote = () => {
    if (newNoteTitle.trim() || newNoteContent.trim()) {
      setNotes([
        ...notes,
        {
          id: Date.now(),
          title: newNoteTitle || 'Untitled Note',
          content: newNoteContent,
          createdAt: Date.now(),
        },
      ]);
      setNewNoteTitle('');
      setNewNoteContent('');
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const updatePreference = <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences({ ...preferences, [key]: value });
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>🪝 use-storage-hook Demo</h1>

      {/* LocalStorage Example - User Name */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>localStorage: User Name</h2>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={{ padding: '0.5rem', marginRight: '0.5rem', fontSize: '1rem' }}
        />
        <button onClick={removeName} style={{ padding: '0.5rem 1rem' }}>
          Clear Name
        </button>
        {name && <p>Hello, <strong>{name}</strong>! 👋</p>}
      </div>

      {/* LocalStorage Example - Todos */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>localStorage: Todo List</h2>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new todo"
            style={{ padding: '0.5rem', marginRight: '0.5rem', fontSize: '1rem', width: '300px' }}
          />
          <button onClick={addTodo} style={{ padding: '0.5rem 1rem' }}>
            Add Todo
          </button>
          {todos.length > 0 && (
            <button
              onClick={removeTodos}
              style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem', background: '#ff4444', color: 'white' }}
            >
              Clear All
            </button>
          )}
        </div>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li
              key={todo.id}
              style={{
                padding: '0.75rem',
                marginBottom: '0.5rem',
                background: '#f5f5f5',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  style={{ marginRight: '0.5rem' }}
                />
                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                  {todo.text}
                </span>
              </label>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{ padding: '0.25rem 0.75rem', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {todos.length === 0 && <p style={{ color: '#999' }}>No todos yet. Add one above!</p>}
      </div>

      {/* SessionStorage Example - Counter */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h2>sessionStorage: Session Counter</h2>
        <p>This counter persists only for this browser tab session.</p>
        <div style={{ fontSize: '2rem', margin: '1rem 0' }}>
          Count: <strong>{sessionCount}</strong>
        </div>
        <button
          onClick={() => setSessionCount((c) => c + 1)}
          style={{ padding: '0.5rem 1rem', marginRight: '0.5rem', fontSize: '1rem' }}
        >
          Increment
        </button>
        <button
          onClick={() => setSessionCount((c) => c - 1)}
          style={{ padding: '0.5rem 1rem', marginRight: '0.5rem', fontSize: '1rem' }}
        >
          Decrement
        </button>
        <button
          onClick={removeSessionCount}
          style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}
        >
          Reset
        </button>
      </div>

      {/* IndexedDB Example - Notes */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', background: '#f9f9ff' }}>
        <h2>IndexedDB: Notes Manager</h2>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          IndexedDB can store larger amounts of data than localStorage (typically 50MB+).
          Perfect for rich content like notes, documents, or cached data.
        </p>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Note title"
            style={{ padding: '0.5rem', marginRight: '0.5rem', fontSize: '1rem', width: '300px' }}
          />
          <br />
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Note content..."
            rows={3}
            style={{ padding: '0.5rem', marginTop: '0.5rem', fontSize: '1rem', width: '100%', maxWidth: '600px' }}
          />
          <br />
          <button onClick={addNote} style={{ padding: '0.5rem 1rem', marginTop: '0.5rem' }}>
            Add Note
          </button>
          {notes.length > 0 && (
            <button
              onClick={removeNotes}
              style={{ padding: '0.5rem 1rem', marginLeft: '0.5rem', background: '#ff4444', color: 'white' }}
            >
              Clear All Notes
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {notes.map((note) => (
            <div
              key={note.id}
              style={{
                padding: '1rem',
                background: 'white',
                borderRadius: '4px',
                border: '1px solid #ddd',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{note.title}</h3>
                <button
                  onClick={() => deleteNote(note.id)}
                  style={{ padding: '0.25rem 0.75rem', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </div>
              <p style={{ margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>{note.content}</p>
              <small style={{ color: '#999' }}>
                Created: {new Date(note.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>
        {notes.length === 0 && <p style={{ color: '#999' }}>No notes yet. Create one above!</p>}
      </div>

      {/* IndexedDB Example - User Preferences */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', background: '#fff9f9' }}>
        <h2>IndexedDB: User Preferences</h2>
        <p style={{ fontSize: '0.9rem', color: '#666' }}>
          Store complex objects and settings. IndexedDB is great for structured data.
        </p>
        <div style={{ display: 'grid', gap: '1rem', maxWidth: '500px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Theme:
            </label>
            <select
              value={preferences.theme}
              onChange={(e) => updatePreference('theme', e.target.value as UserPreferences['theme'])}
              style={{ padding: '0.5rem', fontSize: '1rem', width: '100%' }}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Font Size: {preferences.fontSize}px
            </label>
            <input
              type="range"
              min="12"
              max="24"
              value={preferences.fontSize}
              onChange={(e) => updatePreference('fontSize', Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={preferences.notifications}
                onChange={(e) => updatePreference('notifications', e.target.checked)}
                style={{ marginRight: '0.5rem' }}
              />
              <span style={{ fontWeight: 'bold' }}>Enable Notifications</span>
            </label>
          </div>
          <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '4px' }}>
            <strong>Current Preferences:</strong>
            <pre style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
              {JSON.stringify(preferences, null, 2)}
            </pre>
          </div>
          <button
            onClick={removePreferences}
            style={{ padding: '0.5rem 1rem', background: '#ff4444', color: 'white' }}
          >
            Reset to Defaults
          </button>
        </div>
      </div>

      <div style={{ padding: '1rem', background: '#f0f8ff', borderRadius: '8px' }}>
        <h3>💡 Tips:</h3>
        <ul>
          <li>Open this page in multiple tabs to see <strong>localStorage</strong> synchronization!</li>
          <li>Refresh the page - your name and todos will persist (localStorage).</li>
          <li>The session counter resets when you close and reopen the tab (sessionStorage).</li>
          <li><strong>IndexedDB</strong> notes and preferences persist like localStorage but can handle much larger data!</li>
          <li>Check your browser&apos;s DevTools → Application → IndexedDB to see the stored data.</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
