import React, { useState } from 'react';
import { useLocalStorage, useSessionStorage } from '../lib';


interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function App() {
  const [name, setName, removeName] = useLocalStorage<string>('userName', '');
  const [todos, setTodos, removeTodos] = useLocalStorage<Todo[]>('todos', []);
  const [sessionCount, setSessionCount, removeSessionCount] = useSessionStorage<number>('sessionCount', 0);
  const [newTodo, setNewTodo] = useState('');

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

      <div style={{ padding: '1rem', background: '#f0f8ff', borderRadius: '8px' }}>
        <h3>💡 Tips:</h3>
        <ul>
          <li>Open this page in multiple tabs to see <strong>localStorage</strong> synchronization!</li>
          <li>Refresh the page - your name and todos will persist (localStorage).</li>
          <li>The session counter resets when you close and reopen the tab (sessionStorage).</li>
        </ul>
      </div>
    </div>
  );
}

export default App;
