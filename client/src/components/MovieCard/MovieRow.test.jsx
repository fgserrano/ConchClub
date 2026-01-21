import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import MovieRow from './MovieRow';

describe('MovieRow', () => {
    const mockTicket = {
        title: 'The Matrix',
        posterPath: '/matrix.jpg',
        releaseDate: '1999-03-31',
        runtimeToNearestTenMin: 136,
        user: { username: 'neo' },
        overview: 'A computer hacker learns from mysterious rebels about the true nature of his reality.'
    };

    it('renders movie details correctly', () => {
        render(<MovieRow ticket={mockTicket} />);

        expect(screen.getByText('The Matrix')).toBeInTheDocument();
        expect(screen.getByText('1999')).toBeInTheDocument();
        expect(screen.getByText('136m')).toBeInTheDocument();
        expect(screen.getByText('neo')).toBeInTheDocument();
        expect(screen.getByText(mockTicket.overview)).toBeInTheDocument();

        const img = screen.getByAltText('The Matrix');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w200/matrix.jpg');
    });

    it('renders placeholder when posterPath is missing', () => {
        const ticketWithoutPoster = { ...mockTicket, posterPath: null };
        render(<MovieRow ticket={ticketWithoutPoster} />);
        expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('renders placeholder if runtimeToNearestTenMin is missing', () => {
        const ticketWithRuntime = { ...mockTicket, runtimeToNearestTenMin: null, runtime: 136 };
        render(<MovieRow ticket={ticketWithRuntime} />);
        expect(screen.getByText('? m')).toBeInTheDocument();
    });
});
