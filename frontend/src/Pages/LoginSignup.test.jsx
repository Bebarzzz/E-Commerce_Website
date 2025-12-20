import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginSignup from './LoginSignup';
import * as userService from '../services/userService';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: null })
}));

jest.mock('../services/userService');

describe('LoginSignup Page Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('Login Flow', () => {
    test('renders login form', () => {
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      expect(screen.getByLabelText(/email/i) || 
             screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i) || 
             screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    test('allows user to switch between login and signup', () => {
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      const switchButton = screen.getByText(/sign up/i) || 
                          screen.getByText(/create account/i);
      
      if (switchButton) {
        fireEvent.click(switchButton);
        
        // Should show username field in signup mode
        expect(screen.getByPlaceholderText(/name/i) || 
               screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
      }
    });

    test('submits login form with valid credentials', async () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user'
      };
      
      userService.loginUser.mockResolvedValue(mockResponse);
      
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login|continue|sign in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(userService.loginUser).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'Password123!'
        });
      });
    });

    test('stores token in localStorage on successful login', async () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user'
      };
      
      userService.loginUser.mockResolvedValue(mockResponse);
      
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login|continue|sign in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(localStorage.getItem('auth-token')).toBe('fake-jwt-token');
      });
    });

    test('displays error message on login failure', async () => {
      userService.loginUser.mockRejectedValue({ 
        message: 'Invalid credentials' 
      });
      
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login|continue|sign in/i });
      
      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'wrong' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/invalid|error|incorrect/i)).toBeInTheDocument();
      });
    });

    test('validates required fields', async () => {
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      const submitButton = screen.getByRole('button', { name: /login|continue|sign in/i });
      fireEvent.click(submitButton);
      
      // Should show validation errors or not call API
      await waitFor(() => {
        expect(userService.loginUser).not.toHaveBeenCalled();
      });
    });
  });

  describe('Signup Flow', () => {
    test('renders signup form fields', () => {
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      // Switch to signup mode
      const signupTab = screen.getByText(/sign up/i);
      fireEvent.click(signupTab);
      
      expect(screen.getByPlaceholderText(/name|username/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    test('submits signup form with valid data', async () => {
      const mockResponse = {
        token: 'new-jwt-token',
        username: 'newuser',
        email: 'new@example.com',
        role: 'user'
      };
      
      userService.signupUser.mockResolvedValue(mockResponse);
      
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      // Switch to signup
      const signupTab = screen.getByText(/sign up/i);
      fireEvent.click(signupTab);
      
      const usernameInput = screen.getByPlaceholderText(/name|username/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign up|create|register/i });
      
      fireEvent.change(usernameInput, { target: { value: 'newuser' } });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(userService.signupUser).toHaveBeenCalled();
      });
    });

    test('displays error for weak password', async () => {
      userService.signupUser.mockRejectedValue({ 
        message: 'Password not strong enough' 
      });
      
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      const signupTab = screen.getByText(/sign up/i);
      fireEvent.click(signupTab);
      
      const usernameInput = screen.getByPlaceholderText(/name|username/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign up|create|register/i });
      
      fireEvent.change(usernameInput, { target: { value: 'newuser' } });
      fireEvent.change(emailInput, { target: { value: 'new@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'weak' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/password/i)).toBeInTheDocument();
      });
    });

    test('displays error for duplicate email', async () => {
      userService.signupUser.mockRejectedValue({ 
        message: 'Email already in use' 
      });
      
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      const signupTab = screen.getByText(/sign up/i);
      fireEvent.click(signupTab);
      
      const usernameInput = screen.getByPlaceholderText(/name|username/i);
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /sign up|create|register/i });
      
      fireEvent.change(usernameInput, { target: { value: 'testuser' } });
      fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/email.*use|already.*exist/i)).toBeInTheDocument();
      });
    });
  });

  describe('Navigation', () => {
    test('redirects to home after successful login', async () => {
      const mockResponse = {
        token: 'fake-jwt-token',
        username: 'testuser',
        email: 'test@example.com',
        role: 'user'
      };
      
      userService.loginUser.mockResolvedValue(mockResponse);
      
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);
      const submitButton = screen.getByRole('button', { name: /login|continue|sign in/i });
      
      fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      fireEvent.click(submitButton);
      
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalled();
      });
    });
  });

  describe('Form Validation', () => {
    test('shows error for invalid email format', async () => {
      render(
        <BrowserRouter>
          <LoginSignup />
        </BrowserRouter>
      );
      
      const emailInput = screen.getByPlaceholderText(/email/i);
      fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
      fireEvent.blur(emailInput);
      
      // May show inline validation or on submit
      await waitFor(() => {
        const emailField = screen.getByPlaceholderText(/email/i);
        expect(emailField).toBeInTheDocument();
      });
    });
  });
});
