import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import MenuPage from '../../src/app/menu/page';

// Mock the API service
jest.mock('../../src/app/services/api', () => ({
  menuService: {
    getAllItems: jest.fn().mockResolvedValue([
      { 
        _id: '1', 
        name: 'Classic Burger', 
        price: 9.99, 
        category: 'Main Course',
        description: 'Juicy beef patty with all the fixings' 
      },
      { 
        _id: '2', 
        name: 'Caesar Salad', 
        price: 7.99, 
        category: 'Appetizer',
        description: 'Crisp romaine lettuce with Caesar dressing' 
      },
      { 
        _id: '3', 
        name: 'Chocolate Cake', 
        price: 6.99, 
        category: 'Dessert',
        description: 'Rich chocolate cake with frosting' 
      }
    ])
  }
}));

// Mock the useSearchParams hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn()
  }),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn()
  }),
  usePathname: jest.fn()
}));

describe('Menu Page', () => {
  it('renders the menu page with items from API', async () => {
    render(<MenuPage />);
    
    // Check for loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for the items to load
    await waitFor(() => {
      expect(screen.getByText('Classic Burger')).toBeInTheDocument();
      expect(screen.getByText('Caesar Salad')).toBeInTheDocument();
      expect(screen.getByText('Chocolate Cake')).toBeInTheDocument();
    });
    
    // Check for prices
    expect(screen.getByText('$9.99')).toBeInTheDocument();
    expect(screen.getByText('$7.99')).toBeInTheDocument();
    expect(screen.getByText('$6.99')).toBeInTheDocument();
  });
  
  it('shows categories filter', async () => {
    render(<MenuPage />);
    
    await waitFor(() => {
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Main Course')).toBeInTheDocument();
      expect(screen.getByText('Appetizer')).toBeInTheDocument();
      expect(screen.getByText('Dessert')).toBeInTheDocument();
    });
  });
});
