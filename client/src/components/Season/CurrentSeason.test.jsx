import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import CurrentSeason from './CurrentSeason';
import api from '../../lib/api';

// Mock the API
vi.mock('../../lib/api', () => ({
    default: {
        get: vi.fn(),
        post: vi.fn()
    }
}));

describe('CurrentSeason', () => {
    const mockSeason = { id: 's1', name: 'Season 1', locked: false };
    const mockTickets = [
        { id: '1', title: 'Movie 1', selected: false, user: { username: 'user1' } },
        { id: '2', title: 'Movie 2', selected: true, user: { username: 'user2' }, selectedAt: Date.now() }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('disables randomizer button when season is not locked', async () => {
        api.get.mockResolvedValue({ data: mockTickets });
        render(<CurrentSeason season={mockSeason} />);

        await waitFor(() => expect(api.get).toHaveBeenCalledWith('/admin/submissions'));

        const randomButton = screen.getByTitle('Random Selection');
        expect(randomButton).toBeDisabled();
        expect(screen.getByText('LOCK SEASON TO SELECT')).toBeInTheDocument();
    });

    it('enables randomizer button and removes lock message when season prop changes to locked', async () => {
        api.get.mockResolvedValue({ data: mockTickets });
        const { rerender } = render(<CurrentSeason season={mockSeason} />);

        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));
        expect(screen.getByTitle('Random Selection')).toBeDisabled();
        expect(screen.getByText('LOCK SEASON TO SELECT')).toBeInTheDocument();

        // Change prop to locked, but keep same season.id so it doesn't re-fetch
        rerender(<CurrentSeason season={{ ...mockSeason, locked: true }} />);

        expect(screen.getByTitle('Random Selection')).not.toBeDisabled();
        expect(screen.queryByText('LOCK SEASON TO SELECT')).not.toBeInTheDocument();

        // Success: The UI updated immediately without a second network call
        expect(api.get).toHaveBeenCalledTimes(1);
    });

    it('re-fetches tickets when season.id changes (new season started)', async () => {
        api.get.mockResolvedValue({ data: mockTickets });
        const { rerender } = render(<CurrentSeason season={mockSeason} />);

        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(1));

        // Change season ID - this should trigger a re-fetch
        rerender(<CurrentSeason season={{ ...mockSeason, id: 's2' }} />);

        await waitFor(() => expect(api.get).toHaveBeenCalledTimes(2));
        expect(api.get).toHaveBeenLastCalledWith('/admin/submissions');
    });
});
