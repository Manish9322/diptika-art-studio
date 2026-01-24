# Testing Cheat Sheet

## 🚀 Quick Start

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm run test:watch

# Run with coverage report
npm run test:coverage

# Run specific test file
npm test Footer.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="should render"
```

## 📝 Test Structure

```javascript
describe('Component/Function Name', () => {
  // Setup before each test
  beforeEach(() => {
    // Reset state, clear mocks, etc.
  });

  it('should do something specific', () => {
    // Arrange - Set up test data
    // Act - Execute the code
    // Assert - Verify results
  });
});
```

## 🎯 Common Jest Matchers

```javascript
// Equality
expect(value).toBe(expected)              // Strict equality (===)
expect(value).toEqual(expected)           // Deep equality
expect(value).not.toBe(expected)          // Negation

// Truthiness
expect(value).toBeTruthy()                // true, 1, "hello", etc.
expect(value).toBeFalsy()                 // false, 0, "", null, undefined
expect(value).toBeNull()                  // null
expect(value).toBeUndefined()             // undefined
expect(value).toBeDefined()               // not undefined

// Numbers
expect(value).toBeGreaterThan(3)
expect(value).toBeGreaterThanOrEqual(3)
expect(value).toBeLessThan(5)
expect(value).toBeLessThanOrEqual(5)
expect(value).toBeCloseTo(0.3, 2)        // Floating point

// Strings
expect(string).toMatch(/pattern/)         // Regex match
expect(string).toContain('substring')     // Contains text

// Arrays
expect(array).toContain(item)             // Has item
expect(array).toHaveLength(3)             // Array length
expect(array).toEqual([1, 2, 3])          // Array equality

// Objects
expect(obj).toHaveProperty('key')         // Has property
expect(obj).toHaveProperty('key', 'value') // Has property with value
expect(obj).toMatchObject({ key: 'val' }) // Partial match

// Functions
expect(fn).toHaveBeenCalled()             // Called at least once
expect(fn).toHaveBeenCalledTimes(3)       // Called exactly 3 times
expect(fn).toHaveBeenCalledWith(arg1, arg2) // Called with specific args
expect(fn).toHaveBeenLastCalledWith(arg)  // Last call arguments

// Promises
await expect(promise).resolves.toBe(value)
await expect(promise).rejects.toThrow()

// Exceptions
expect(() => fn()).toThrow()              // Throws any error
expect(() => fn()).toThrow('error msg')   // Throws specific error
```

## 🧪 React Testing Library Queries

### Priority Order (use in this order):

1. **Accessible to Everyone**
   ```javascript
   getByRole('button', { name: /submit/i })
   getByLabelText('Email')
   getByPlaceholderText('Enter email')
   getByText('Hello World')
   getByDisplayValue('Current value')
   ```

2. **Semantic Queries**
   ```javascript
   getByAltText('Profile picture')
   getByTitle('Close')
   ```

3. **Test IDs** (last resort)
   ```javascript
   getByTestId('custom-element')
   ```

### Query Variants:

```javascript
// getBy* - Returns element, throws if not found or multiple found
getByRole('button')

// queryBy* - Returns null if not found (good for testing absence)
queryByRole('button')  // null if doesn't exist

// findBy* - Returns promise, waits for element (async/await)
await findByRole('button')  // Waits up to 1000ms

// getAllBy*, queryAllBy*, findAllBy* - Return arrays
getAllByRole('listitem')  // Returns array of all matches
```

## 🎭 User Interactions

```javascript
import userEvent from '@testing-library/user-event';

// Setup (recommended for v14+)
const user = userEvent.setup();

// Click
await user.click(element);
await user.dblClick(element);

// Type
await user.type(input, 'Hello World');
await user.clear(input);

// Keyboard
await user.keyboard('{Enter}');
await user.keyboard('{Shift>}A{/Shift}');  // Shift+A

// Select
await user.selectOptions(select, 'option1');

// Upload
await user.upload(input, file);

// Hover
await user.hover(element);
await user.unhover(element);
```

## 🔄 Async Testing

```javascript
// Method 1: waitFor
import { waitFor } from '@testing-library/react';

await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Method 2: findBy (preferred for single elements)
const element = await screen.findByText('Loaded');
expect(element).toBeInTheDocument();

// Method 3: async/await with promises
await expect(asyncFn()).resolves.toBe(value);
```

## 🎭 Mocking

### Mock Functions
```javascript
// Create mock
const mockFn = jest.fn();

// Mock return value
mockFn.mockReturnValue('value');
mockFn.mockReturnValueOnce('first').mockReturnValueOnce('second');

// Mock implementation
mockFn.mockImplementation((a, b) => a + b);

// Mock resolved/rejected promise
mockFn.mockResolvedValue('success');
mockFn.mockRejectedValue(new Error('failure'));

// Assertions
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledWith(arg1, arg2);
expect(mockFn).toHaveBeenCalledTimes(2);
```

### Mock Modules
```javascript
// Mock entire module
jest.mock('./api');

// Mock specific function
jest.mock('./api', () => ({
  fetchData: jest.fn(),
}));

// Mock with implementation
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),  // Keep other exports
  specificFn: jest.fn(() => 'mocked'),
}));
```

### Mock Timers
```javascript
// Use fake timers
jest.useFakeTimers();

// Fast-forward time
jest.advanceTimersByTime(1000);
jest.runAllTimers();
jest.runOnlyPendingTimers();

// Restore real timers
jest.useRealTimers();
```

## 🎨 Common Patterns

### Testing Form Submission
```javascript
const user = userEvent.setup();

await user.type(screen.getByLabelText(/email/i), 'test@example.com');
await user.type(screen.getByLabelText(/password/i), 'password123');
await user.click(screen.getByRole('button', { name: /submit/i }));

expect(mockSubmit).toHaveBeenCalledWith({
  email: 'test@example.com',
  password: 'password123',
});
```

### Testing Conditional Rendering
```javascript
// Initially not visible
expect(screen.queryByText('Message')).not.toBeInTheDocument();

// Trigger show
await user.click(screen.getByRole('button', { name: /show/i }));

// Now visible
expect(screen.getByText('Message')).toBeInTheDocument();
```

### Testing API Calls
```javascript
// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ data: 'value' }),
  })
);

// Test
const result = await fetchData();
expect(fetch).toHaveBeenCalledWith('/api/data');
expect(result).toEqual({ data: 'value' });
```

### Testing Error States
```javascript
mockApi.mockRejectedValue(new Error('API Error'));

render(<Component />);

const error = await screen.findByRole('alert');
expect(error).toHaveTextContent('API Error');
```

## 📦 Redux Testing

```javascript
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

const store = configureStore({
  reducer: {
    // your reducers
  },
});

render(
  <Provider store={store}>
    <Component />
  </Provider>
);
```

## 🐛 Debugging

```javascript
// Print component DOM
screen.debug();

// Print specific element
screen.debug(screen.getByRole('button'));

// Print to console
console.log(element.innerHTML);

// Get all roles in component
screen.logTestingPlaygroundURL();
```

## ⚡ Performance Tips

1. **Use screen over destructuring**
   ```javascript
   // ✅ Good
   screen.getByRole('button');
   
   // ❌ Avoid
   const { getByRole } = render(<Component />);
   ```

2. **Don't test implementation details**
   ```javascript
   // ❌ Bad
   expect(component.state.count).toBe(1);
   
   // ✅ Good
   expect(screen.getByText('Count: 1')).toBeInTheDocument();
   ```

3. **Use data-testid as last resort**
   - Prefer semantic queries (role, label, text)
   - Only use testId when no better option exists

## 📊 Coverage

```bash
# Generate coverage report
npm run test:coverage

# Coverage files created in /coverage directory
# Open coverage/lcov-report/index.html in browser
```

### Coverage Metrics:
- **Statements**: % of code statements executed
- **Branches**: % of if/else branches taken
- **Functions**: % of functions called
- **Lines**: % of lines executed

Target: Aim for 80%+ coverage on critical paths

## 🔗 Resources

- [Jest Docs](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/)
- [Common Mistakes](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
