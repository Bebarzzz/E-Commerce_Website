import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CartItems from './CartItems';
import { ShopContext } from '../../Context/ShopContext';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

const mockProducts = [
  {
    id: 1,
    name: 'Toyota Camry',
    image: 'camry.jpg',
    new_price: 30000,
    old_price: 35000
  },
  {
    id: 2,
    name: 'Honda Civic',
    image: 'civic.jpg',
    new_price: 25000,
    old_price: 28000
  }
];

const mockContextValue = {
  getTotalCartAmount: jest.fn(() => 55000),
  all_product: mockProducts,
  cartItems: { 1: 1, 2: 1 },
  removeFromCart: jest.fn()
};

const renderWithContext = (contextValue = mockContextValue) => {
  return render(
    <BrowserRouter>
      <ShopContext.Provider value={contextValue}>
        <CartItems />
      </ShopContext.Provider>
    </BrowserRouter>
  );
};

describe('CartItems Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders cart items table headers', () => {
    renderWithContext();
    
    expect(screen.getByText(/products/i)).toBeInTheDocument();
    expect(screen.getByText(/title/i)).toBeInTheDocument();
    expect(screen.getByText(/price/i)).toBeInTheDocument();
    expect(screen.getByText(/quantity/i)).toBeInTheDocument();
    expect(screen.getByText(/total/i)).toBeInTheDocument();
  });

  test('displays cart items correctly', () => {
    renderWithContext();
    
    expect(screen.getByText('Toyota Camry')).toBeInTheDocument();
    expect(screen.getByText('Honda Civic')).toBeInTheDocument();
    expect(screen.getByText('$30000')).toBeInTheDocument();
    expect(screen.getByText('$25000')).toBeInTheDocument();
  });

  test('calculates individual item totals correctly', () => {
    renderWithContext();
    
    // Each item has quantity 1
    expect(screen.getByText('$30000')).toBeInTheDocument(); // Camry total
    expect(screen.getByText('$25000')).toBeInTheDocument(); // Civic total
  });

  test('displays correct quantity for items', () => {
    renderWithContext();
    
    const quantityButtons = screen.getAllByRole('button');
    const quantityButton = quantityButtons.find(btn => btn.textContent === '1');
    expect(quantityButton).toBeInTheDocument();
  });

  test('calls removeFromCart when remove icon is clicked', () => {
    renderWithContext();
    
    const removeIcons = screen.getAllByAltText('');
    const removeIcon = removeIcons.find(img => 
      img.className.includes('cartitems-remove-icon')
    );
    
    if (removeIcon) {
      fireEvent.click(removeIcon);
      expect(mockContextValue.removeFromCart).toHaveBeenCalled();
    }
  });

  test('displays cart totals section', () => {
    renderWithContext();
    
    expect(screen.getByText(/cart totals/i)).toBeInTheDocument();
    expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
    expect(screen.getByText(/shipping fee/i)).toBeInTheDocument();
  });

  test('displays correct total amount', () => {
    renderWithContext();
    
    expect(screen.getByText('$55000')).toBeInTheDocument();
  });

  test('shows free shipping', () => {
    renderWithContext();
    
    expect(screen.getByText(/free/i)).toBeInTheDocument();
  });

  test('renders promo code section', () => {
    renderWithContext();
    
    expect(screen.getByPlaceholderText(/promo code/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  test('navigates to checkout when authenticated', () => {
    localStorage.setItem('auth-token', 'fake-token');
    renderWithContext();
    
    const checkoutButton = screen.getByText(/proceed to checkout/i);
    fireEvent.click(checkoutButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  test('navigates to login when not authenticated', () => {
    localStorage.removeItem('auth-token');
    renderWithContext();
    
    const checkoutButton = screen.getByText(/proceed to checkout/i);
    fireEvent.click(checkoutButton);
    
    expect(mockNavigate).toHaveBeenCalledWith('/login', { state: { from: '/checkout' } });
  });

  test('displays empty cart when no items', () => {
    const emptyContext = {
      ...mockContextValue,
      cartItems: {},
      getTotalCartAmount: jest.fn(() => 0)
    };
    
    renderWithContext(emptyContext);
    
    expect(screen.queryByText('Toyota Camry')).not.toBeInTheDocument();
    expect(screen.queryByText('Honda Civic')).not.toBeInTheDocument();
  });

  test('calculates total for multiple quantities', () => {
    const multiQuantityContext = {
      ...mockContextValue,
      cartItems: { 1: 2, 2: 3 }, // 2 Camrys, 3 Civics
      getTotalCartAmount: jest.fn(() => 135000) // 60000 + 75000
    };
    
    renderWithContext(multiQuantityContext);
    
    expect(screen.getByText('$135000')).toBeInTheDocument();
  });
});
