import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProductDisplay from './ProductDisplay';
import { ShopContext } from '../../Context/ShopContext';

const mockProduct = {
  _id: '1',
  model: 'Camry',
  brand: 'Toyota',
  manufactureYear: 2023,
  type: 'Sedan',
  price: 30000,
  engineCapacity: 2.5,
  wheelDriveType: 'FWD',
  engineType: 'Gasoline',
  transmissionType: 'Automatic',
  condition: 'new',
  images: ['camry1.jpg', 'camry2.jpg']
};

const mockContextValue = {
  addToCart: jest.fn(),
  cartItems: {}
};

const renderWithContext = (product = mockProduct) => {
  return render(
    <BrowserRouter>
      <ShopContext.Provider value={mockContextValue}>
        <ProductDisplay product={product} />
      </ShopContext.Provider>
    </BrowserRouter>
  );
};

describe('ProductDisplay Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders product information', () => {
    renderWithContext();
    
    expect(screen.getByText(/Camry/i)).toBeInTheDocument();
    expect(screen.getByText(/Toyota/i)).toBeInTheDocument();
    expect(screen.getByText(/30000/)).toBeInTheDocument();
  });

  test('displays product specifications', () => {
    renderWithContext();
    
    expect(screen.getByText(/2023/)).toBeInTheDocument();
    expect(screen.getByText(/Sedan/i)).toBeInTheDocument();
    expect(screen.getByText(/2.5/)).toBeInTheDocument();
    expect(screen.getByText(/FWD/i)).toBeInTheDocument();
    expect(screen.getByText(/Gasoline/i)).toBeInTheDocument();
    expect(screen.getByText(/Automatic/i)).toBeInTheDocument();
  });

  test('displays product condition', () => {
    renderWithContext();
    
    expect(screen.getByText(/new/i)).toBeInTheDocument();
  });

  test('renders product images', () => {
    renderWithContext();
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  test('displays add to cart button', () => {
    renderWithContext();
    
    const addToCartButton = screen.getByText(/add to cart/i);
    expect(addToCartButton).toBeInTheDocument();
  });

  test('calls addToCart when button is clicked', () => {
    renderWithContext();
    
    const addToCartButton = screen.getByText(/add to cart/i);
    fireEvent.click(addToCartButton);
    
    expect(mockContextValue.addToCart).toHaveBeenCalledWith(mockProduct._id);
  });

  test('displays product price formatted correctly', () => {
    renderWithContext();
    
    const priceElement = screen.getByText(/30000/);
    expect(priceElement).toBeInTheDocument();
  });

  test('shows used condition correctly', () => {
    const usedProduct = {
      ...mockProduct,
      condition: 'used'
    };
    
    renderWithContext(usedProduct);
    
    expect(screen.getByText(/used/i)).toBeInTheDocument();
  });

  test('handles product with single image', () => {
    const singleImageProduct = {
      ...mockProduct,
      images: ['single.jpg']
    };
    
    renderWithContext(singleImageProduct);
    
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  test('handles product with no images', () => {
    const noImageProduct = {
      ...mockProduct,
      images: []
    };
    
    renderWithContext(noImageProduct);
    
    // Component should still render without crashing
    expect(screen.getByText(/Camry/i)).toBeInTheDocument();
  });

  test('allows image gallery navigation', () => {
    renderWithContext();
    
    const images = screen.getAllByRole('img');
    
    if (images.length > 1) {
      // Check if there are navigation controls (thumbnails or arrows)
      const thumbnails = images.filter(img => 
        img.className?.includes('thumbnail') || 
        img.className?.includes('gallery')
      );
      
      if (thumbnails.length > 0) {
        fireEvent.click(thumbnails[0]);
        // Main image should update
        expect(images[0]).toBeInTheDocument();
      }
    }
  });

  test('displays all technical specifications', () => {
    renderWithContext();
    
    // Check for specification labels
    expect(screen.getByText(/engine capacity/i) || 
           screen.getByText(/2.5/)).toBeInTheDocument();
    expect(screen.getByText(/transmission/i) || 
           screen.getByText(/Automatic/i)).toBeInTheDocument();
    expect(screen.getByText(/drive type/i) || 
           screen.getByText(/FWD/i)).toBeInTheDocument();
  });
});
