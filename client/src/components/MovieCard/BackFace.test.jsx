import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import BackFace from './BackFace';

describe('BackFace', () => {
    const mockTicket = {
        title: 'Inception',
        user: { username: 'testuser' },
        releaseYear: 2010
    };

    it('renders movie details correctly', () => {
        render(<BackFace ticket={mockTicket} roundedRuntime={140} year="2010" />);

        expect(screen.getByText('Inception')).toBeInTheDocument();
        expect(screen.getByText('~140')).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByText('2010')).toBeInTheDocument();
    });

    it('renders unknown runtime when roundedRuntime is null', () => {
        render(<BackFace ticket={mockTicket} roundedRuntime={null} year="2010" />);
        expect(screen.getByText('Runtime unknown')).toBeInTheDocument();
    });

    it('renders Unknown for user if user object is missing', () => {
        const ticketWithoutUser = { title: 'Inception' };
        render(<BackFace ticket={ticketWithoutUser} roundedRuntime={140} year="2010" />);
        expect(screen.getByText('Unknown')).toBeInTheDocument();
    });
});
