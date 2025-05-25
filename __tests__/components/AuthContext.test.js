import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../../src/app/context/AuthContext';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock component to test the hook
const TestComponent = () => {
  const { user, loading, login, logout } = useAuth();
  return (
    <div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <div data-testid="user">{user ? JSON.stringify(user) : 'no user'}</div>
      <button data-testid="login" onClick={() => login({ email: 'test@example.com', password: 'password123' })}>
        Login
      </button>
      <button data-testid="logout" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

// Mock fetch
global.fetch = jest.fn();

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.getItem.mockReturnValue(null);
  });

  it('provides initial state with no user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('user').textContent).toBe('no user');
  });

  it('loads user from localStorage on initialization if token exists', async () => {
    const mockToken = 'mock-token';
    const mockUser = { id: 1, name: 'Test User', role: 'admin' };
    
    localStorage.getItem.mockReturnValue(mockToken);
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, data: mockUser })
    });
    
    await act(async () => {
      render(
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      );
    });
    
    expect(localStorage.getItem).toHaveBeenCalledWith('token');
    expect(fetch).toHaveBeenCalled();
    expect(screen.getByTestId('user').textContent).toContain(mockUser.name);
  });
});
