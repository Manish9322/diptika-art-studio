// ========================================
// EXAMPLE 1: Testing a Simple Utility Function
// ========================================

/**
 * This example shows how to test a basic utility function
 * Key Concepts:
 * - Describe blocks group related tests
 * - Test/it blocks define individual test cases
 * - Expect statements make assertions
 */

// Example utility function to test
function formatPrice(price) {
  return `₹${price.toLocaleString('en-IN')}`;
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// The tests
describe('Utility Functions', () => {
  // Test suite for formatPrice function
  describe('formatPrice', () => {
    // Individual test case
    it('should format a simple price correctly', () => {
      // Arrange: Set up test data
      const price = 1000;
      
      // Act: Call the function
      const result = formatPrice(price);
      
      // Assert: Check the result
      expect(result).toBe('₹1,000');
    });

    it('should handle zero price', () => {
      expect(formatPrice(0)).toBe('₹0');
    });

    it('should format large numbers with commas', () => {
      expect(formatPrice(1234567)).toBe('₹12,34,567');
    });
  });

  // Test suite for validateEmail function
  describe('validateEmail', () => {
    it('should return true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });

    it('should return false for email without @', () => {
      expect(validateEmail('testexample.com')).toBe(false);
    });

    it('should return false for email without domain', () => {
      expect(validateEmail('test@')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
  });
});

// ========================================
// EXAMPLE 2: Testing with Different Matchers
// ========================================

describe('Jest Matchers Examples', () => {
  // Testing arrays
  it('should work with arrays', () => {
    const fruits = ['apple', 'banana', 'orange'];
    
    expect(fruits).toHaveLength(3);
    expect(fruits).toContain('banana');
    expect(fruits).toEqual(['apple', 'banana', 'orange']);
  });

  // Testing objects
  it('should work with objects', () => {
    const user = {
      name: 'John',
      age: 30,
      email: 'john@example.com'
    };
    
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('email', 'john@example.com');
    expect(user).toMatchObject({ name: 'John', age: 30 });
  });

  // Testing truthy/falsy values
  it('should check truthiness', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect('hello').toBeDefined();
  });

  // Testing numbers
  it('should compare numbers', () => {
    const value = 10;
    
    expect(value).toBeGreaterThan(5);
    expect(value).toBeLessThan(15);
    expect(value).toBeGreaterThanOrEqual(10);
    expect(value).toBeLessThanOrEqual(10);
  });

  // Testing strings
  it('should work with strings', () => {
    const message = 'Hello World';
    
    expect(message).toMatch(/World/);
    expect(message).toContain('Hello');
    expect(message).not.toContain('Goodbye');
  });
});

// ========================================
// EXAMPLE 3: Using Setup and Teardown
// ========================================

describe('Setup and Teardown Example', () => {
  let database;

  // Runs once before all tests in this describe block
  beforeAll(() => {
    console.log('Setting up test database...');
    database = { connected: true, data: [] };
  });

  // Runs before each test
  beforeEach(() => {
    console.log('Clearing database...');
    database.data = [];
  });

  // Runs after each test
  afterEach(() => {
    console.log('Test completed');
  });

  // Runs once after all tests in this describe block
  afterAll(() => {
    console.log('Closing test database...');
    database = null;
  });

  it('should add data to database', () => {
    database.data.push({ id: 1, name: 'Test' });
    expect(database.data).toHaveLength(1);
  });

  it('should start with empty database', () => {
    // This test shows that beforeEach cleared the data
    expect(database.data).toHaveLength(0);
  });
});

// ========================================
// EXAMPLE 4: Testing Asynchronous Code
// ========================================

// Simulated async function
async function fetchUserData(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id: userId, name: 'John Doe' });
    }, 100);
  });
}

describe('Async Function Tests', () => {
  // Method 1: Using async/await
  it('should fetch user data using async/await', async () => {
    const user = await fetchUserData(1);
    expect(user).toEqual({ id: 1, name: 'John Doe' });
  });

  // Method 2: Using .then
  it('should fetch user data using .then', () => {
    return fetchUserData(1).then(user => {
      expect(user.name).toBe('John Doe');
    });
  });

  // Method 3: Using resolves matcher
  it('should fetch user data using resolves', () => {
    return expect(fetchUserData(1)).resolves.toEqual({
      id: 1,
      name: 'John Doe'
    });
  });
});

// ========================================
// EXAMPLE 5: Testing with Mocks
// ========================================

describe('Mock Functions', () => {
  it('should track function calls', () => {
    // Create a mock function
    const mockCallback = jest.fn(x => x + 1);

    // Use the mock function
    [1, 2, 3].forEach(mockCallback);

    // Assert on the mock
    expect(mockCallback).toHaveBeenCalledTimes(3);
    // forEach passes 3 arguments: value, index, array
    expect(mockCallback).toHaveBeenCalledWith(1, 0, [1, 2, 3]);
    expect(mockCallback).toHaveBeenLastCalledWith(3, 2, [1, 2, 3]);
  });

  it('should mock return values', () => {
    const mock = jest.fn();
    
    // Set return value
    mock.mockReturnValue('mocked value');
    expect(mock()).toBe('mocked value');
    
    // Set different return values for consecutive calls
    mock.mockReturnValueOnce('first call')
        .mockReturnValueOnce('second call');
    
    expect(mock()).toBe('first call');
    expect(mock()).toBe('second call');
    expect(mock()).toBe('mocked value'); // Falls back to default
  });
});
