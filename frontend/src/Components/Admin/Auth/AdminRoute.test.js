import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import AdminRoute from './AdminRoute';
import * as userService from '../../../services/userService';

// Mock userService
jest.mock('../../../services/userService');

describe('AdminRoute', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('redirects to login if not authenticated', () => {
        userService.isAuthenticated.mockReturnValue(false);
        userService.isAdmin.mockReturnValue(false);

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route path="/admin" element={<AdminRoute><div>Admin Content</div></AdminRoute>} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    test('shows access denied if authenticated but not admin', () => {
        userService.isAuthenticated.mockReturnValue(true);
        userService.isAdmin.mockReturnValue(false);

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <AdminRoute><div>Admin Content</div></AdminRoute>
            </MemoryRouter>
        );

        expect(screen.getByText(/Access Denied/i)).toBeInTheDocument();
    });

    test('renders children if admin', () => {
        userService.isAuthenticated.mockReturnValue(true);
        userService.isAdmin.mockReturnValue(true);

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <AdminRoute><div>Admin Content</div></AdminRoute>
            </MemoryRouter>
        );

        expect(screen.getByText('Admin Content')).toBeInTheDocument();
    });
});
