package com.conchclub.service;

import com.conchclub.model.Ticket;
import com.conchclub.repository.TicketRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @InjectMocks
    private TicketService ticketService;

    @Test
    void getTickets_ReturnsList_WhenFound() {
        Ticket ticket = new Ticket();
        ticket.setSeasonId(1L);
        when(ticketRepository.findBySeasonId(1L)).thenReturn(Collections.singletonList(ticket));

        List<Ticket> results = ticketService.getTickets(1L);

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getSeasonId()).isEqualTo(1L);
    }
}
