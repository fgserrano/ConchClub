package com.conchclub.service;

import com.conchclub.model.Ticket;
import com.conchclub.repository.TicketRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    public List<Ticket> getTickets(Long seasonId) {
        return ticketRepository.findBySeasonId(seasonId);
    }
}
