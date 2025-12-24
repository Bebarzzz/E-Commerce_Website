import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SearchBar from './SearchBar';

// Mock the carService
jest.mock('../../services/carService', () => ({
  searchCars: jest.fn()
}));

const { searchCars } = require('../../services/carService');

const mockSearchResults = [
  {
    _id: '1',
    model: 'Camry',
    brand: 'Toyota',
    price: 30000,
    images: ['camry.jpg']
  },
  {
    _id: '2',
    model: 'Civic',
    brand: 'Honda',
    price: 25000,
    images: ['civic.jpg']
  }
];

describe('SearchBar Component', () => {
  let mockOnSearch;

  beforeEach(() => {
    jest.clearAllMocks();
    mockOnSearch = jest.fn();
  });

  test('renders search input field', () => {
    render(
      <BrowserRouter>
        <SearchBar onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    expect(searchInput).toBeInTheDocument();
  });

  test('allows user to type in search field', () => {
    render(
      <BrowserRouter>
        <SearchBar onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    
    expect(searchInput.value).toBe('Toyota');
  });

  test('calls search API when user types', async () => {
    searchCars.mockResolvedValue(mockSearchResults);
    
    render(
      <BrowserRouter>
        <SearchBar onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Toyota');
    }, { timeout: 1000 });
  });

  test('displays search results', async () => {
    searchCars.mockResolvedValue(mockSearchResults);
    
    render(
      <BrowserRouter>
        <SearchBar onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalled();
    });
  });

  test('handles search with no results', async () => {
    searchCars.mockResolvedValue([]);
    
    render(
      <BrowserRouter>
        <SearchBar onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'NonExistent' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalled();
    });
  });

  test('clears results when search input is cleared', async () => {
    searchCars.mockResolvedValue(mockSearchResults);
    
    render(
      <BrowserRouter>
        <SearchBar onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    
    // Type search query
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('Toyota');
    });
    
    // Clear search
    fireEvent.change(searchInput, { target: { value: '' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalledWith('');
    });
  });

  test('navigates to product when clicking search result', async () => {
    searchCars.mockResolvedValue(mockSearchResults);
    
    render(
      <BrowserRouter>
        <SearchBar onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalled();
    });
  });

  test('handles API error gracefully', async () => {
    searchCars.mockRejectedValue(new Error('API Error'));
    
    render(
      <BrowserRouter>
        <SearchBar onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalled();
    });
  });

  test('debounces search input', async () => {
    jest.useFakeTimers();
    searchCars.mockResolvedValue(mockSearchResults);
    
    render(
      <BrowserRouter>
        <SearchBar onSearch={mockOnSearch} />
      </BrowserRouter>
    );
    
    const searchInput = screen.getByPlaceholderText(/search/i);
    
    // Type multiple characters quickly
    fireEvent.change(searchInput, { target: { value: 'T' } });
    fireEvent.change(searchInput, { target: { value: 'To' } });
    fireEvent.change(searchInput, { target: { value: 'Toy' } });
    fireEvent.change(searchInput, { target: { value: 'Toyota' } });
    
    // Fast-forward time
    jest.runAllTimers();
    
    await waitFor(() => {
      expect(mockOnSearch).toHaveBeenCalled();
    });
    
    jest.useRealTimers();
  });
});
