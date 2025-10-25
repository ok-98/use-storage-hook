# use-storage-hook

A lightweight React hook library for managing `localStorage` and `sessionStorage` with TypeScript support.

## Features

- 🎯 **Type-safe**: Full TypeScript support with generic types
- 🔄 **Synchronized**: Automatically syncs state across components and tabs
- 🪝 **Easy to use**: Drop-in replacement for `useState`
- 🚀 **Lightweight**: No dependencies (except React)
- ⚡ **SSR-friendly**: Safe to use with server-side rendering
- 🧹 **Clean API**: Includes remove functionality

## Installation

```bash
npm install use-storage-hook
# or
yarn add use-storage-hook
# or
pnpm add use-storage-hook
```

## Usage

### useLocalStorage

```tsx
import { useLocalStorage } from 'use-storage-hook';

function MyComponent() {
  const [name, setName, removeName] = useLocalStorage('name', 'John Doe');

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={removeName}>Clear</button>
    </div>
  );
}
```

### useSessionStorage

```tsx
import { useSessionStorage } from 'use-storage-hook';

function MyComponent() {
  const [count, setCount, removeCount] = useSessionStorage('count', 0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <button onClick={() => setCount((c) => c - 1)}>Decrement</button>
      <button onClick={removeCount}>Reset</button>
    </div>
  );
}
```

## API

### useLocalStorage(key, initialValue)

Manages a value in `localStorage` synchronized with React state.

**Parameters:**
- `key` (string): The localStorage key
- `initialValue` (T): The initial value if no value exists

**Returns:**
- `[value, setValue, removeValue]`
  - `value`: The current value
  - `setValue`: Function to update the value (supports functional updates)
  - `removeValue`: Function to remove the value from storage

### useSessionStorage(key, initialValue)

Manages a value in `sessionStorage` synchronized with React state.

**Parameters:**
- `key` (string): The sessionStorage key
- `initialValue` (T): The initial value if no value exists

**Returns:**
- `[value, setValue, removeValue]`
  - `value`: The current value
  - `setValue`: Function to update the value (supports functional updates)
  - `removeValue`: Function to remove the value from storage

## Advanced Usage

### With Complex Objects

```tsx
interface User {
  name: string;
  email: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
}

function UserSettings() {
  const [user, setUser, removeUser] = useLocalStorage<User>('user', {
    name: '',
    email: '',
    preferences: {
      theme: 'light',
      notifications: true,
    },
  });

  const updateTheme = (theme: 'light' | 'dark') => {
    setUser((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        theme,
      },
    }));
  };

  return (
    <div>
      <h2>{user.name}</h2>
      <button onClick={() => updateTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### Synchronization Across Tabs

The `useLocalStorage` hook automatically synchronizes state across browser tabs. When you update a value in one tab, all other tabs using the same key will be updated automatically.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
