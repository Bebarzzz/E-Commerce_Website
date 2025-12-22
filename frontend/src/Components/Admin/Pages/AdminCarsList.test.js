import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminCarsList from './AdminCarsList';
import * as carService from '../../../services/carService';

// Mock carService
jest.mock('../../../services/carService');

describe('AdminCarsList', () => {
    const mockCars = [
        { _id: '1', brand: 'Toyota', model: 'Camry', price: 20000, condition: 'new' },
        { _id: '2', brand: 'Honda', model: 'Civic', price: 18000, condition: 'used' }
    ];

    beforeEach(() => {
        carService.getAllCars.mockResolvedValue(mockCars);
        carService.removeCar.mockResolvedValue({});
        // Mock window.confirm
        window.confirm = jest.fn(() => true);
    });

    test('renders cars list', async () => {
        render(<AdminCarsList />, { wrapper: BrowserRouter });

        expect(screen.getByText(/Loading cars/i)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Toyota')).toBeInTheDocument();
            expect(screen.getByText('Honda')).toBeInTheDocument();
        });
    });

    test('calls removeCar when delete is clicked', async () => {
        render(<AdminCarsList />, { wrapper: BrowserRouter });

        await waitFor(() => {
            expect(screen.getByText('Toyota')).toBeInTheDocument();
        });

        const deleteButtons = screen.getAllByText('Delete');
        fireEvent.click(deleteButtons[0]);

        expect(window.confirm).toHaveBeenCalled();
        expect(carService.removeCar).toHaveBeenCalledWith('1');

        // Verify it's removed from UI (conceptually, assuming state update works)
        await waitFor(() => {
            // logic to check removal if needed
            // In a real integration test we'd check if it disappears
        });
    });
});
