/**
 * COMPONENT TESTING EXAMPLE
 * 
 * This file demonstrates how to test React components
 * Key concepts:
 * - Rendering components
 * - Querying elements
 * - Simulating user interactions
 * - Testing conditional rendering
 */

const { render, screen, fireEvent, waitFor } = require('@testing-library/react');
const userEvent = require('@testing-library/user-event').default;
const React = require('react');

// ========================================
// EXAMPLE COMPONENT 1: Simple Button
// ========================================

const Button = ({ onClick, children, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

describe('Button Component', () => {
  it('should render button with text', () => {
    // Arrange & Act: Render the component
    render(<Button onClick={() => {}}>Click Me</Button>);
    
    // Assert: Check if button is in the document
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    // Arrange: Create a mock function
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click Me</Button>);
    
    // Act: Click the button
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Assert: Check if function was called
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Disabled Button
      </Button>
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });
});

// ========================================
// EXAMPLE COMPONENT 2: Form with Input
// ========================================

const ContactForm = ({ onSubmit }) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!name || !email) {
      setError('All fields are required');
      return;
    }
    
    if (!email.includes('@')) {
      setError('Invalid email');
      return;
    }
    
    setError('');
    onSubmit({ name, email });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      
      {error && <div role="alert">{error}</div>}
      
      <button type="submit">Submit</button>
    </form>
  );
};

describe('ContactForm Component', () => {
  it('should render form fields', () => {
    render(<ContactForm onSubmit={() => {}} />);
    
    // Query by label text (best for form inputs)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('should update input values when user types', async () => {
    // userEvent is more realistic than fireEvent
    const user = userEvent.setup();
    
    render(<ContactForm onSubmit={() => {}} />);
    
    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    
    // Simulate user typing
    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    
    expect(nameInput).toHaveValue('John Doe');
    expect(emailInput).toHaveValue('john@example.com');
  });

  it('should show error when fields are empty', async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={() => {}} />);
    
    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);
    
    // Query by role for error message
    expect(screen.getByRole('alert')).toHaveTextContent('All fields are required');
  });

  it('should call onSubmit with form data when valid', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();
    
    render(<ContactForm onSubmit={handleSubmit} />);
    
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
    
    // Error should not be shown
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

// ========================================
// EXAMPLE COMPONENT 3: Component with Async Data
// ========================================

const UserList = ({ fetchUsers }) => {
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    fetchUsers()
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load users');
        setLoading(false);
      });
  }, [fetchUsers]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div role="alert">{error}</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};

describe('UserList Component (Async)', () => {
  it('should show loading state initially', () => {
    const mockFetch = jest.fn(() => new Promise(() => {})); // Never resolves
    render(<UserList fetchUsers={mockFetch} />);
    
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display users after loading', async () => {
    const mockUsers = [
      { id: 1, name: 'John Doe' },
      { id: 2, name: 'Jane Smith' }
    ];
    
    const mockFetch = jest.fn(() => Promise.resolve(mockUsers));
    render(<UserList fetchUsers={mockFetch} />);
    
    // Wait for loading to finish
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });
    
    // Check if users are displayed
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('should display error message on failure', async () => {
    const mockFetch = jest.fn(() => Promise.reject(new Error('API Error')));
    render(<UserList fetchUsers={mockFetch} />);
    
    // Wait for error to appear
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Failed to load users');
  });
});

// ========================================
// EXAMPLE COMPONENT 4: Testing with Query Variants
// ========================================

const Message = ({ show }) => {
  return show ? <div>Message is visible</div> : null;
};

describe('Message Component (Query Variants)', () => {
  it('should render message when show is true', () => {
    render(<Message show={true} />);
    
    // getBy* throws error if not found (good for expecting element to exist)
    expect(screen.getByText(/message is visible/i)).toBeInTheDocument();
  });

  it('should not render message when show is false', () => {
    render(<Message show={false} />);
    
    // queryBy* returns null if not found (good for expecting element NOT to exist)
    expect(screen.queryByText(/message is visible/i)).not.toBeInTheDocument();
  });

  it('should show message after prop changes', async () => {
    const { rerender } = render(<Message show={false} />);
    
    // Initially not visible
    expect(screen.queryByText(/message is visible/i)).not.toBeInTheDocument();
    
    // Update prop
    rerender(<Message show={true} />);
    
    // Now visible
    expect(screen.getByText(/message is visible/i)).toBeInTheDocument();
  });
});
