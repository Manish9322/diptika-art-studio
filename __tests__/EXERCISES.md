# 🎓 Testing Exercises

Practice writing tests with these hands-on exercises. Start with easier ones and progress to more complex scenarios.

## Exercise 1: Basic Function Testing (Easy)

Write tests for these utility functions:

```javascript
// utils/string-utils.ts
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

**Tasks:**
1. Test `capitalize` with:
   - Regular string: "hello" → "Hello"
   - All caps: "HELLO" → "Hello"
   - Empty string: "" → ""
   - Single character: "a" → "A"

2. Test `truncate` with:
   - String shorter than max: no truncation
   - String longer than max: adds "..."
   - String exactly at max: no truncation
   - Empty string

3. Test `slugify` with:
   - "Hello World" → "hello-world"
   - "Hello  World" → "hello-world" (multiple spaces)
   - "Hello-World!" → "hello-world" (special chars)

<details>
<summary>View Solution</summary>

```javascript
// __tests__/utils/string-utils.test.ts
import { capitalize, truncate, slugify } from '@/utils/string-utils';

describe('String Utilities', () => {
  describe('capitalize', () => {
    it('should capitalize first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    it('should handle all caps', () => {
      expect(capitalize('HELLO')).toBe('Hello');
    });

    it('should return empty string for empty input', () => {
      expect(capitalize('')).toBe('');
    });

    it('should handle single character', () => {
      expect(capitalize('a')).toBe('A');
    });
  });

  describe('truncate', () => {
    it('should not truncate short strings', () => {
      expect(truncate('Hello', 10)).toBe('Hello');
    });

    it('should truncate long strings', () => {
      expect(truncate('Hello World', 5)).toBe('Hello...');
    });

    it('should not truncate at exact length', () => {
      expect(truncate('Hello', 5)).toBe('Hello');
    });
  });

  describe('slugify', () => {
    it('should convert to lowercase and replace spaces', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('should handle multiple spaces', () => {
      expect(slugify('Hello  World')).toBe('hello-world');
    });

    it('should remove special characters', () => {
      expect(slugify('Hello-World!')).toBe('hello-world');
    });
  });
});
```
</details>

---

## Exercise 2: Testing React Components (Medium)

Create a simple Counter component and write comprehensive tests:

```typescript
// components/Counter.tsx
import React, { useState } from 'react';

interface CounterProps {
  initialCount?: number;
  step?: number;
  max?: number;
}

export const Counter: React.FC<CounterProps> = ({ 
  initialCount = 0, 
  step = 1,
  max = 10 
}) => {
  const [count, setCount] = useState(initialCount);

  const increment = () => {
    if (count < max) {
      setCount(count + step);
    }
  };

  const decrement = () => {
    setCount(count - step);
  };

  const reset = () => {
    setCount(initialCount);
  };

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={increment}>+</button>
      <button onClick={reset}>Reset</button>
      {count >= max && <p>Maximum reached!</p>}
    </div>
  );
};
```

**Tasks:**
1. Test initial render with default props
2. Test increment button increases count
3. Test decrement button decreases count
4. Test reset button returns to initial count
5. Test max limit prevents further increments
6. Test "Maximum reached!" message appears at max
7. Test with custom props (step=2, max=20)

<details>
<summary>View Solution</summary>

```javascript
// __tests__/components/Counter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Counter } from '@/components/Counter';

describe('Counter Component', () => {
  it('should render with initial count', () => {
    render(<Counter />);
    expect(screen.getByText('Count: 0')).toBeInTheDocument();
  });

  it('should increment count', async () => {
    const user = userEvent.setup();
    render(<Counter />);
    
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('Count: 1')).toBeInTheDocument();
  });

  it('should decrement count', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={5} />);
    
    await user.click(screen.getByRole('button', { name: '-' }));
    expect(screen.getByText('Count: 4')).toBeInTheDocument();
  });

  it('should reset to initial count', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={5} />);
    
    await user.click(screen.getByRole('button', { name: '+' }));
    await user.click(screen.getByRole('button', { name: 'Reset' }));
    
    expect(screen.getByText('Count: 5')).toBeInTheDocument();
  });

  it('should not exceed maximum', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={10} max={10} />);
    
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('Count: 10')).toBeInTheDocument();
  });

  it('should show maximum message at max', async () => {
    const user = userEvent.setup();
    render(<Counter initialCount={9} max={10} />);
    
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('Maximum reached!')).toBeInTheDocument();
  });

  it('should use custom step', async () => {
    const user = userEvent.setup();
    render(<Counter step={2} />);
    
    await user.click(screen.getByRole('button', { name: '+' }));
    expect(screen.getByText('Count: 2')).toBeInTheDocument();
  });
});
```
</details>

---

## Exercise 3: Testing Async Operations (Medium)

Test a component that fetches and displays user data:

```typescript
// components/UserProfile.tsx
import React, { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

interface UserProfileProps {
  userId: number;
  fetchUser: (id: number) => Promise<User>;
}

export const UserProfile: React.FC<UserProfileProps> = ({ userId, fetchUser }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser(userId)
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load user');
        setLoading(false);
      });
  }, [userId, fetchUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;
  if (!user) return <div>No user found</div>;

  return (
    <div>
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};
```

**Tasks:**
1. Test loading state
2. Test successful data fetch
3. Test error handling
4. Test with different user IDs
5. Verify fetchUser is called with correct ID

<details>
<summary>View Solution</summary>

```javascript
// __tests__/components/UserProfile.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from '@/components/UserProfile';

describe('UserProfile Component', () => {
  const mockUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

  it('should show loading state initially', () => {
    const mockFetch = jest.fn(() => new Promise(() => {}));
    render(<UserProfile userId={1} fetchUser={mockFetch} />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should display user data after loading', async () => {
    const mockFetch = jest.fn(() => Promise.resolve(mockUser));
    render(<UserProfile userId={1} fetchUser={mockFetch} />);
    
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
    
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
  });

  it('should display error message on failure', async () => {
    const mockFetch = jest.fn(() => Promise.reject(new Error('API Error')));
    render(<UserProfile userId={1} fetchUser={mockFetch} />);
    
    const errorMsg = await screen.findByRole('alert');
    expect(errorMsg).toHaveTextContent('Failed to load user');
  });

  it('should call fetchUser with correct userId', () => {
    const mockFetch = jest.fn(() => Promise.resolve(mockUser));
    render(<UserProfile userId={123} fetchUser={mockFetch} />);
    
    expect(mockFetch).toHaveBeenCalledWith(123);
  });

  it('should refetch when userId changes', async () => {
    const mockFetch = jest.fn(() => Promise.resolve(mockUser));
    const { rerender } = render(<UserProfile userId={1} fetchUser={mockFetch} />);
    
    expect(mockFetch).toHaveBeenCalledWith(1);
    
    rerender(<UserProfile userId={2} fetchUser={mockFetch} />);
    
    expect(mockFetch).toHaveBeenCalledWith(2);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });
});
```
</details>

---

## Exercise 4: Testing Forms (Advanced)

Test a login form with validation:

```typescript
// components/LoginForm.tsx
import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<void>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setLoading(true);
    try {
      await onLogin(email, password);
    } catch (err) {
      setErrors({ email: 'Login failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        {errors.email && <span role="alert">{errors.email}</span>}
      </div>
      
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {errors.password && <span role="alert">{errors.password}</span>}
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

**Tasks:**
1. Test email validation (required, format)
2. Test password validation (required, length)
3. Test successful login
4. Test failed login
5. Test loading state disables inputs
6. Test form clears errors on resubmit

---

## Exercise 5: Testing with Mocks (Advanced)

Mock the localStorage and test a component that uses it:

```typescript
// components/ThemeSwitcher.tsx
import React, { useEffect, useState } from 'react';

export const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (saved) setTheme(saved);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <div>
      <p>Current theme: {theme}</p>
      <button onClick={toggleTheme}>
        Switch to {theme === 'light' ? 'dark' : 'light'} mode
      </button>
    </div>
  );
};
```

**Tasks:**
1. Mock localStorage
2. Test initial theme loads from localStorage
3. Test theme toggle updates state
4. Test theme toggle saves to localStorage
5. Clean up mocks after tests

---

## 🎯 Practice Tips

1. **Start Small**: Begin with simple functions before complex components
2. **Read Error Messages**: Jest provides helpful error messages
3. **Use screen.debug()**: See what's rendered when tests fail
4. **Test User Behavior**: Focus on what users see and do
5. **Write Tests First**: Try TDD (Test-Driven Development)
6. **Keep Tests Simple**: One assertion per test when possible
7. **Use Descriptive Names**: Test names should explain what they test

## 🏆 Challenge

Once you complete these exercises, try:
1. Write tests for your ContactForm component
2. Write tests for your Gallery component
3. Test your API routes with mocked database calls
4. Achieve 80% code coverage on a feature

## 📚 Next Steps

- Read the [Testing Guide](./__tests__/README.md)
- Check the [Cheat Sheet](./__tests__/CHEATSHEET.md)
- Explore [example tests](./__tests__/examples/)
- Write tests for your actual components!
