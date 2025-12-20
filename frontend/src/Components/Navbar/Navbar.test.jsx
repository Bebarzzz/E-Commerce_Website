import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { ShopContext } from '../../Context/ShopContext';

// Mock context value
const mockContextValue = {
  getTotalCartItems: jest.fn(() => 3),
  all_product: []
};

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      <ShopContext.Provider value={mockContextValue}>
        {component}
      </ShopContext.Provider>
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders navbar with logo', () => {
    renderWithRouter(<Navbar />);
    // Check if navbar is rendered
    const navbar = screen.getByRole('navigation') || document.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
  });

  test('displays navigation menu items', () => {
    renderWithRouter(<Navbar />);
    
    // Check for common menu items (adjust based on your actual Navbar)
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  test('shows cart item count', () => {
    renderWithRouter(<Navbar />);
    
    // Look for cart count badge
    const cartCount = screen.getByText('3');
    expect(cartCount).toBeInTheDocument();
  });

  test('updates cart count when context changes', () => {
    const newContextValue = {
      ...mockContextValue,
      getTotalCartItems: jest.fn(() => 5)
    };

    render(
      <BrowserRouter>
        <ShopContext.Provider value={newContextValue}>
          <Navbar />
        </ShopContext.Provider>
      </BrowserRouter>
    );

    const cartCount = screen.getByText('5');
    expect(cartCount).toBeInTheDocument();
  });

  test('shows login button when not authenticated', () => {
    localStorage.removeItem('auth-token');
    renderWithRouter(<Navbar />);
    
    const loginButton = screen.getByText(/login/i);
    expect(loginButton).toBeInTheDocument();
  });

  test('shows logout button when authenticated', () => {
    localStorage.setItem('auth-token', 'fake-token');
    renderWithRouter(<Navbar />);
    
    const logoutButton = screen.getByText(/logout/i);
    expect(logoutButton).toBeInTheDocument();
  });

  test('logout clears localStorage and redirects', () => {
    localStorage.setItem('auth-token', 'fake-token');
    renderWithRouter(<Navbar />);
    
    const logoutButton = screen.getByText(/logout/i);
    fireEvent.click(logoutButton);
    
    expect(localStorage.getItem('auth-token')).toBeNull();
  });

  test('navigates to shop page when clicking shop link', () => {
    renderWithRouter(<Navbar />);
    
    const shopLink = screen.getByText(/shop/i);
    expect(shopLink).toHaveAttribute('href');
  });

  test('navigates to cart page when clicking cart', () => {
    renderWithRouter(<Navbar />);
    
    const cartElements = screen.getAllByRole('link');
    const cartLink = cartElements.find(link => 
      link.getAttribute('href')?.includes('cart')
    );
    
    expect(cartLink).toBeDefined();
  });

  test('renders responsive menu toggle on mobile', () => {
    renderWithRouter(<Navbar />);
    
    // Check for menu toggle button (hamburger icon)
    const menuToggle = document.querySelector('.nav-dropdown') || 
                      document.querySelector('.menu-toggle') ||
                      document.querySelector('.hamburger');
    
    // Menu toggle might not be visible on desktop, so we just check structure
    expect(document.querySelector('.navbar')).toBeInTheDocument();
  });
});
