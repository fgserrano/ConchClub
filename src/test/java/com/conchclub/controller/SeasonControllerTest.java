package com.conchclub.controller;

import com.conchclub.model.Season;
import com.conchclub.model.Ticket;
import com.conchclub.service.SeasonService;
import com.conchclub.service.AuthService;
import com.conchclub.config.JwtUtils;
import com.conchclub.service.TicketService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SeasonController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("local")
public class SeasonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SeasonService seasonService;

    @MockBean
    private TicketService ticketService;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtils jwtUtils;

    @Test
    void getActiveSeason_ReturnsSeason_WhenExists() throws Exception {
        Season season = new Season();
        season.setName("Test Season");
        season.setActive(true);

        when(seasonService.getActiveSeason()).thenReturn(Optional.of(season));

        mockMvc.perform(get("/api/season/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Test Season"));
    }

    @Test
    void getTickets_ReturnsRoundedRuntime() throws Exception {
        Season season = new Season();
        season.setId("1");
        Ticket ticket = new Ticket();
        ticket.setRuntime(115); // Should round to 120
        ticket.setUsername("bob");

        when(seasonService.getActiveSeason()).thenReturn(Optional.of(season));
        when(ticketService.getTickets("1")).thenReturn(Collections.singletonList(ticket));

        mockMvc.perform(get("/api/season/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].runtimeToNearestTenMin").value(120))
                .andExpect(jsonPath("$[0].user.username").value("bob"));
    }

    @Test
    void getActiveSelection_ReturnsSelectedTickets() throws Exception {
        Season season = new Season();
        season.setId("1");
        Ticket ticket = new Ticket();
        ticket.setSelected(true);
        ticket.setTitle("Winning Movie");
        ticket.setUsername("alice");

        when(seasonService.getActiveSeason()).thenReturn(Optional.of(season));
        when(ticketService.getTickets("1")).thenReturn(Collections.singletonList(ticket));

        mockMvc.perform(get("/api/season/active/selection"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Winning Movie"))
                .andExpect(jsonPath("$[0].user.username").value("alice"));
    }
}
