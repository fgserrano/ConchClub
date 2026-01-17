import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Mock components for routing
const MockLogin = () => <div>Login Page</div>;
const MockDashboard = () => <div>Dashboard Page</div>;
const MockAdmin = () => <div>Admin Page</div>;

describe('ProtectedRoute', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('redirects to /login if no token is present', () => {
        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/login" element={<MockLogin />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/admin" element={<MockAdmin />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Login Page')).toBeInTheDocument();
    });

    it('allows access if token is present and no role is required', () => {
        localStorage.setItem('token', 'fake-token');

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<MockDashboard />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    it('redirects to / if user role does not match required role', () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('role', 'user');

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route path="/" element={<MockDashboard />} />
                    <Route element={<ProtectedRoute role="admin" />}>
                        <Route path="/admin" element={<MockAdmin />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Dashboard Page')).toBeInTheDocument();
    });

    it('allows access if user role matches required role', () => {
        localStorage.setItem('token', 'fake-token');
        localStorage.setItem('role', 'admin');

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <Routes>
                    <Route element={<ProtectedRoute role="admin" />}>
                        <Route path="/admin" element={<MockAdmin />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Admin Page')).toBeInTheDocument();
    });
});
