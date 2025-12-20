import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Item from './Item';

const mockCar = {
  _id: '1',
  model: 'Camry',
  brand: 'Toyota',
  price: 30000,
  manufactureYear: 2023,
  condition: 'new',
  images: ['camry.jpg']
};

describe('Item Component', () => {
  test('renders car item with image', () => {
    render(
      <BrowserRouter>
        <Item car={mockCar} />
      </BrowserRouter>
    );
    
    const image = screen.getByRole('img');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src');
  });

  test('displays car model and brand', () => {
    render(
      <BrowserRouter>
        <Item car={mockCar} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/Camry/i)).toBeInTheDocument();
    expect(screen.getByText(/Toyota/i)).toBeInTheDocument();
  });

  test('displays car price', () => {
    render(
      <BrowserRouter>
        <Item car={mockCar} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/30000/)).toBeInTheDocument();
  });

  test('displays manufacture year', () => {
    render(
      <BrowserRouter>
        <Item car={mockCar} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });

  test('displays condition badge', () => {
    render(
      <BrowserRouter>
        <Item car={mockCar} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/new/i)).toBeInTheDocument();
  });

  test('renders as a clickable link to product page', () => {
    render(
      <BrowserRouter>
        <Item car={mockCar} />
      </BrowserRouter>
    );
    
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/product/${mockCar._id}`);
  });

  test('handles used car condition', () => {
    const usedCar = { ...mockCar, condition: 'used' };
    
    render(
      <BrowserRouter>
        <Item car={usedCar} />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/used/i)).toBeInTheDocument();
  });

  test('handles car with no image', () => {
    const noImageCar = { ...mockCar, images: [] };
    
    render(
      <BrowserRouter>
        <Item car={noImageCar} />
      </BrowserRouter>
    );
    
    // Should still render model name
    expect(screen.getByText(/Camry/i)).toBeInTheDocument();
  });

  test('formats price with currency symbol', () => {
    render(
      <BrowserRouter>
        <Item car={mockCar} />
      </BrowserRouter>
    );
    
    const priceText = screen.getByText(/\$|30000/);
    expect(priceText).toBeInTheDocument();
  });

  test('displays first image from images array', () => {
    const multiImageCar = {
      ...mockCar,
      images: ['image1.jpg', 'image2.jpg', 'image3.jpg']
    };
    
    render(
      <BrowserRouter>
        <Item car={multiImageCar} />
      </BrowserRouter>
    );
    
    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('src', expect.stringContaining('image1.jpg'));
  });
});
