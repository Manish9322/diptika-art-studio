# Testing Guide for Shringar Studio

## 📚 Testing Basics

### What is Testing?
Testing is the process of verifying that your code works as expected. It helps you:
- Catch bugs before they reach production
- Ensure new changes don't break existing features
- Document how your code should behave
- Build confidence in your codebase

### Types of Tests

#### 1. **Unit Tests**
- Test individual functions or components in isolation
- Fast and focused
- Example: Testing a utility function

#### 2. **Integration Tests**
- Test how multiple parts work together
- Example: Testing a component that uses API calls

#### 3. **End-to-End (E2E) Tests**
- Test complete user workflows
- Example: User logging in, navigating, and submitting a form

## 🛠️ Test Structure

Every test follows the **AAA Pattern**:

1. **Arrange**: Set up the test data and conditions
2. **Act**: Perform the action being tested
3. **Assert**: Verify the expected outcome

```javascript
test('adds two numbers', () => {
  // Arrange
  const a = 2;
  const b = 3;
  
  // Act
  const result = add(a, b);
  
  // Assert
  expect(result).toBe(5);
});
```

## 🧪 Jest Matchers

Common assertions you'll use:

```javascript
// Equality
expect(value).toBe(4)           // Strict equality (===)
expect(value).toEqual(4)        // Deep equality for objects/arrays

// Truthiness
expect(value).toBeTruthy()      // Truthy values
expect(value).toBeFalsy()       // Falsy values
expect(value).toBeNull()        // Null
expect(value).toBeUndefined()   // Undefined

// Numbers
expect(value).toBeGreaterThan(3)
expect(value).toBeLessThan(5)
expect(value).toBeCloseTo(0.3)  // For floating point

// Strings
expect(text).toMatch(/pattern/)
expect(text).toContain('substring')

// Arrays and Iterables
expect(array).toContain(item)
expect(array).toHaveLength(3)

// Objects
expect(obj).toHaveProperty('key')
expect(obj).toMatchObject({ key: 'value' })

// Exceptions
expect(() => fn()).toThrow()
expect(() => fn()).toThrow('error message')
```

## 🎭 Testing React Components

### React Testing Library Philosophy
- Test what the user sees and does
- Don't test implementation details
- Query elements like a user would (by role, label, text)

### Common Queries

```javascript
// By Role (Most Preferred)
getByRole('button', { name: /submit/i })
getByRole('heading', { level: 1 })

// By Label Text (For form fields)
getByLabelText('Email')

// By Text Content
getByText('Hello World')

// By Test ID (Last Resort)
getByTestId('custom-element')
```

### Query Variants

- **getBy**: Throws error if not found (default)
- **queryBy**: Returns null if not found (good for checking non-existence)
- **findBy**: Returns promise, waits for element (good for async)

## 🏃‍♂️ Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (reruns on file changes)
npm test -- --watch

# Run tests with coverage report
npm test -- --coverage

# Run specific test file
npm test ContactForm.test.tsx

# Run tests matching a pattern
npm test -- --testNamePattern="should render"
```

## 📁 File Organization

```
__tests__/
├── components/           # Component tests
├── utils/               # Utility function tests
├── integration/         # Integration tests
└── e2e/                 # End-to-end tests
```

## 🎯 Best Practices

1. **Write Descriptive Test Names**
   ```javascript
   // ❌ Bad
   test('works', () => {})
   
   // ✅ Good
   test('should display error message when email is invalid', () => {})
   ```

2. **Test Behavior, Not Implementation**
   ```javascript
   // ❌ Bad - Testing internal state
   expect(component.state.count).toBe(1)
   
   // ✅ Good - Testing what user sees
   expect(screen.getByText('Count: 1')).toBeInTheDocument()
   ```

3. **Keep Tests Independent**
   - Each test should work in isolation
   - Don't rely on other tests running first
   - Clean up after each test

4. **Use Setup and Teardown**
   ```javascript
   beforeEach(() => {
     // Runs before each test
   });
   
   afterEach(() => {
     // Runs after each test
   });
   ```

5. **Mock External Dependencies**
   - API calls
   - Database connections
   - Third-party services

## 🔍 Debugging Tests

```javascript
// Print the DOM
import { screen } from '@testing-library/react'
screen.debug()

// Print specific element
screen.debug(screen.getByRole('button'))

// Use console.log
console.log('Value:', value)
```

## 📚 Further Learning

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
