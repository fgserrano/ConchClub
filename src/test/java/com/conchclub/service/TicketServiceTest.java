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

import com.conchclub.model.User;
import com.conchclub.repository.UserRepository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TicketServiceTest {

    @Mock
    private TicketRepository ticketRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TicketService ticketService;

    @Test
    void getTickets_ReturnsList_WhenFound() {
        Ticket ticket = new Ticket();
        ticket.setSeasonId("1");
        ticket.setUserId("user1");

        User user = new User();
        user.setId("user1");
        user.setUsername("testuser");

        when(ticketRepository.findBySeasonId("1")).thenReturn(Collections.singletonList(ticket));
        when(userRepository.findAllById(any())).thenReturn(Collections.singletonList(user));

        List<Ticket> results = ticketService.getTickets("1");

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getSeasonId()).isEqualTo("1");
        assertThat(results.get(0).getUsername()).isEqualTo("testuser");
    }
}
