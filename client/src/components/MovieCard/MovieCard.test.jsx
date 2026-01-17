import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MovieCard from './MovieCard';

describe('MovieCard', () => {
    const mockTicket = {
        title: 'Inception',
        posterPath: '/inception.jpg',
        runtimeToNearestTenMin: 148,
        releaseDate: '2010-07-16',
        user: { username: 'testuser' }
    };

    it('renders front face by default', () => {
        render(<MovieCard ticket={mockTicket} />);
        const poster = screen.getByAltText('Inception');
        expect(poster).toBeInTheDocument();
        expect(poster).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/inception.jpg');
    });

    it('flips to back face on click', () => {
        render(<MovieCard ticket={mockTicket} />);
        const card = screen.getByAltText('Inception').closest('.group');
        fireEvent.click(card);

        // Check for runtime which is on the back face
        // 148 rounded down to nearest 10 is 140
        expect(screen.getByText('~140')).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
        expect(screen.getByText('2010')).toBeInTheDocument();
    });

    it('renders placeholder when no poster path is provided', () => {
        const ticketWithoutPoster = { ...mockTicket, posterPath: null };
        render(<MovieCard ticket={ticketWithoutPoster} />);
        expect(screen.getByText('?')).toBeInTheDocument();
    });
});
