import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AdminCarForm from './AdminCarForm';

const renderWithRouter = (ui) => {
    return render(ui, { wrapper: BrowserRouter });
};

describe('AdminCarForm', () => {
    const mockSubmit = jest.fn();

    beforeEach(() => {
        mockSubmit.mockClear();
    });

    test('renders form fields correctly', () => {
        renderWithRouter(<AdminCarForm onSubmit={mockSubmit} />);

        expect(screen.getByLabelText(/Brand/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Model/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
        expect(screen.getByText(/create Car/i)).toBeInTheDocument();
    });

    test('submits form with correct data', async () => {
        renderWithRouter(<AdminCarForm onSubmit={mockSubmit} />);

        await userEvent.type(screen.getByLabelText(/Brand/i), 'Toyota');
        await userEvent.type(screen.getByLabelText(/Model/i), 'Camry');
        await userEvent.clear(screen.getByLabelText(/Manufacture Year/i));
        await userEvent.type(screen.getByLabelText(/Manufacture Year/i), '2022');
        await userEvent.type(screen.getByLabelText(/Price/i), '25000');
        await userEvent.type(screen.getByLabelText(/Description/i), 'Reliable car');
        await userEvent.type(screen.getByLabelText(/Engine Capacity/i), '2.5');

        fireEvent.click(screen.getByText(/create Car/i));

        await waitFor(() => {
            expect(mockSubmit).toHaveBeenCalledTimes(1);
        });

        const formData = mockSubmit.mock.calls[0][0];
        expect(formData).toBeInstanceOf(FormData);
        expect(formData.get('brand')).toBe('Toyota');
        expect(formData.get('model')).toBe('Camry');
        expect(formData.get('price')).toBe('25000');
    });

    test('handles file inputs', async () => {
        // Mock URL.createObjectURL
        global.URL.createObjectURL = jest.fn(() => 'mock-url');

        renderWithRouter(<AdminCarForm onSubmit={mockSubmit} />);

        const file = new File(['hello'], 'hello.png', { type: 'image/png' });
        const input = screen.getByLabelText(/Images/i);

        await userEvent.upload(input, file);

        expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
});
