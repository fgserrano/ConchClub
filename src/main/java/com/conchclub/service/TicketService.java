package com.conchclub.service;

import com.conchclub.model.Ticket;
import com.conchclub.model.User;
import com.conchclub.repository.TicketRepository;
import com.conchclub.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;

    public List<Ticket> getTickets(String seasonId) {
        List<Ticket> tickets = ticketRepository.findBySeasonId(seasonId);

        // Manual Join: specific to moving away from SQL Joins
        final Set<String> userIds = tickets.stream()
                .map(Ticket::getUserId)
                .collect(Collectors.toSet());

        final Map<String, String> userMap = userRepository.findAllById(userIds).stream()
                .collect(Collectors.toMap(User::getId,
                        User::getUsername));

        tickets.forEach(ticket -> ticket.setUsername(userMap.get(ticket.getUserId())));

        return tickets;
    }

    public java.util.Optional<Ticket> getTicketById(String id) {
        return ticketRepository.findById(id);
    }

    public Ticket save(Ticket ticket) {
        return ticketRepository.save(ticket);
    }

    public boolean existsBySeasonIdAndUserId(String seasonId, String userId) {
        return ticketRepository.existsBySeasonIdAndUserId(seasonId, userId);
    }

    public boolean existsBySeasonIdAndTmdbId(String seasonId, String tmdbId) {
        return ticketRepository.existsBySeasonIdAndTmdbId(seasonId, tmdbId);
    }

    public java.util.Optional<Ticket> findBySeasonIdAndUserId(String seasonId, String userId) {
        return ticketRepository.findBySeasonIdAndUserId(seasonId, userId);
    }
}
