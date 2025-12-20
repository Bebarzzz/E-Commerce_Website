import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Checkout from './Checkout';
import { ShopContext } from '../Context/ShopContext';
import { NotificationContext } from '../Context/NotificationContext';
import * as orderService from '../services/orderService';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../services/orderService');

const mockProducts = [
  {
    _id: '1',
    model: 'Camry',
    brand: 'Toyota',
    price: 30000,
    images: ['camry.jpg']
  }
];

const mockShopContext = {
  getTotalCartAmount: jest.fn(() => 30000),
  all_product: mockProducts,
  cartItems: { '1': 1 },
  clearCart: jest.fn()
};

const mockNotificationContext = {
  notify: jest.fn()
};

const renderCheckout = () => {
  return render(
    <BrowserRouter>
      <ShopContext.Provider value={mockShopContext}>
        <NotificationContext.Provider value={mockNotificationContext}>
          <Checkout />
        </NotificationContext.Provider>
      </ShopContext.Provider>
    </BrowserRouter>
  );
};

describe('Checkout Page Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem('auth-token', 'fake-token');
    orderService.createOrder.mockClear();
    orderService.formatCartForOrder.mockReturnValue([
      { carId: '1', quantity: 1, price: 30000 }
    ]);
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Form Rendering', () => {
    test('renders shipping information form', () => {
      renderCheckout();
      
      expect(screen.getByPlaceholderText(/first name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/last name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/street/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/city/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/state/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/zip/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/country/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/phone/i)).toBeInTheDocument();
    });

    test('displays order summary', () => {
      renderCheckout();
      
      expect(screen.getByText(/30000/)).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    test('shows error when required fields are missing', async () => {
      renderCheckout();
      
      const placeOrderButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(placeOrderButton);
      
      await waitFor(() => {
        expect(mockNotificationContext.notify).toHaveBeenCalledWith(
          expect.stringContaining('required'),
          'warning'
        );
      });
    });

    test('validates all required fields before submission', async () => {
      renderCheckout();
      
      // Fill only some fields
      fireEvent.change(screen.getByPlaceholderText(/first name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByPlaceholderText(/last name/i), {
        target: { value: 'Doe' }
      });
      
      const placeOrderButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(placeOrderButton);
      
      await waitFor(() => {
        expect(orderService.createOrder).not.toHaveBeenCalled();
      });
    });
  });

  describe('Order Placement', () => {
    const fillCheckoutForm = () => {
      fireEvent.change(screen.getByPlaceholderText(/first name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByPlaceholderText(/last name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByPlaceholderText(/street/i), {
        target: { value: '123 Main St' }
      });
      fireEvent.change(screen.getByPlaceholderText(/city/i), {
        target: { value: 'New York' }
      });
      fireEvent.change(screen.getByPlaceholderText(/state/i), {
        target: { value: 'NY' }
      });
      fireEvent.change(screen.getByPlaceholderText(/zip/i), {
        target: { value: '10001' }
      });
      fireEvent.change(screen.getByPlaceholderText(/country/i), {
        target: { value: 'USA' }
      });
      fireEvent.change(screen.getByPlaceholderText(/phone/i), {
        target: { value: '1234567890' }
      });
    };

    test('submits order with valid data', async () => {
      orderService.createOrder.mockResolvedValue({
        success: true,
        order: { _id: 'order123' }
      });
      
      renderCheckout();
      fillCheckoutForm();
      
      const placeOrderButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(placeOrderButton);
      
      await waitFor(() => {
        expect(orderService.createOrder).toHaveBeenCalledWith(
          expect.objectContaining({
            items: expect.any(Array),
            totalAmount: 30000,
            shippingAddress: expect.objectContaining({
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com'
            })
          })
        );
      });
    });

    test('clears cart after successful order', async () => {
      orderService.createOrder.mockResolvedValue({
        success: true,
        order: { _id: 'order123' }
      });
      
      renderCheckout();
      fillCheckoutForm();
      
      const placeOrderButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(placeOrderButton);
      
      await waitFor(() => {
        expect(mockShopContext.clearCart).toHaveBeenCalled();
      });
    });

    test('shows success notification on order completion', async () => {
      orderService.createOrder.mockResolvedValue({
        success: true,
        order: { _id: 'order123' }
      });
      
      renderCheckout();
      fillCheckoutForm();
      
      const placeOrderButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(placeOrderButton);
      
      await waitFor(() => {
        expect(mockNotificationContext.notify).toHaveBeenCalledWith(
          expect.stringContaining('success'),
          'success'
        );
      });
    });

    test('navigates to order confirmed page after success', async () => {
      orderService.createOrder.mockResolvedValue({
        success: true,
        order: { _id: 'order123' }
      });
      
      renderCheckout();
      fillCheckoutForm();
      
      const placeOrderButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(placeOrderButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          '/order-confirmed',
          expect.any(Object)
        );
      });
    });

    test('displays error message on order failure', async () => {
      orderService.createOrder.mockRejectedValue({
        message: 'Payment failed'
      });
      
      renderCheckout();
      fillCheckoutForm();
      
      const placeOrderButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(placeOrderButton);
      
      await waitFor(() => {
        expect(mockNotificationContext.notify).toHaveBeenCalledWith(
          expect.stringContaining('failed'),
          'error'
        );
      });
    });

    test('disables submit button during order processing', async () => {
      orderService.createOrder.mockImplementation(() => 
        new Promise(resolve => setTimeout(resolve, 1000))
      );
      
      renderCheckout();
      fillCheckoutForm();
      
      const placeOrderButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(placeOrderButton);
      
      expect(placeOrderButton).toBeDisabled();
    });
  });

  describe('Authentication', () => {
    test('redirects to login if not authenticated', () => {
      localStorage.removeItem('auth-token');
      
      renderCheckout();
      
      waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith(
          '/login',
          expect.objectContaining({
            state: { from: '/checkout' }
          })
        );
      });
    });
  });

  describe('Empty Cart Handling', () => {
    test('prevents order when cart is empty', async () => {
      const emptyCartContext = {
        ...mockShopContext,
        cartItems: {},
        getTotalCartAmount: jest.fn(() => 0)
      };
      
      orderService.formatCartForOrder.mockReturnValue([]);
      
      render(
        <BrowserRouter>
          <ShopContext.Provider value={emptyCartContext}>
            <NotificationContext.Provider value={mockNotificationContext}>
              <Checkout />
            </NotificationContext.Provider>
          </ShopContext.Provider>
        </BrowserRouter>
      );
      
      const fillForm = () => {
        fireEvent.change(screen.getByPlaceholderText(/first name/i), {
          target: { value: 'John' }
        });
        // Fill other required fields...
      };
      
      fillForm();
      
      const placeOrderButton = screen.getByRole('button', { name: /place order/i });
      fireEvent.click(placeOrderButton);
      
      await waitFor(() => {
        expect(orderService.createOrder).not.toHaveBeenCalled();
      });
    });
  });
});
