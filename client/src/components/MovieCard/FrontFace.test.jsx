import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FrontFace from './FrontFace';

describe('FrontFace', () => {
    const mockTicket = {
        title: 'Inception',
        posterPath: '/inception.jpg'
    };

    it('renders the poster when posterPath is provided', () => {
        render(<FrontFace ticket={mockTicket} />);
        const img = screen.getByAltText('Inception');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://image.tmdb.org/t/p/w500/inception.jpg');
    });

    it('renders a placeholder when posterPath is missing', () => {
        const ticketWithoutPoster = { title: 'Inception', posterPath: null };
        render(<FrontFace ticket={ticketWithoutPoster} />);
        expect(screen.getByText('?')).toBeInTheDocument();
    });

    it('renders YOUR SUBMISSION label when ticket belongs to user', () => {
        render(<FrontFace ticket={mockTicket} isMine={true} />);
        expect(screen.getByText('YOUR SUBMISSION')).toBeInTheDocument();
    });
});
