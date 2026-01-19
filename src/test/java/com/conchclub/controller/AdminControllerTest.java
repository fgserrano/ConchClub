package com.conchclub.controller;

import com.conchclub.model.Season;
import com.conchclub.model.Ticket;
import com.conchclub.model.User;
import com.conchclub.repository.SeasonRepository;
import com.conchclub.repository.TicketRepository;
import com.conchclub.repository.UserRepository;
import com.conchclub.service.AuthService;
import com.conchclub.config.JwtUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AdminController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("local")
public class AdminControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private SeasonRepository seasonRepository;

    @MockBean
    private TicketRepository ticketRepository;

    @MockBean
    private UserRepository userRepository;

    @MockBean
    private AuthService authService;

    @MockBean
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getTickets_ReturnsEmptyList_WhenNoActiveSeason() throws Exception {
        when(seasonRepository.findByActiveTrue()).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/admin/tickets"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }

    @Test
    void createSeason_Success() throws Exception {
        AdminController.CreateSeasonRequest request = new AdminController.CreateSeasonRequest("Season 2");
        when(seasonRepository.save(any(Season.class))).thenAnswer(i -> i.getArgument(0));

        mockMvc.perform(post("/api/admin/season")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Season 2"))
                .andExpect(jsonPath("$.active").value(true));
    }

    @Test
    void revealWinner_Success() throws Exception {
        Season season = new Season();
        season.setId(1L);
        Ticket ticket = new Ticket();
        ticket.setId(10L);
        ticket.setSeasonId(1L);
        ticket.setUserId(1L);
        ticket.setTitle("Matrix");
        ticket.setReleaseDate("2024");

        User user = new User();
        user.setUsername("testuser");

        when(seasonRepository.findByActiveTrue()).thenReturn(Optional.of(season));
        when(ticketRepository.findById(10L)).thenReturn(Optional.of(ticket)); // Mock findById
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        AdminController.RevealRequest request = new AdminController.RevealRequest(10L);

        mockMvc.perform(post("/api/admin/reveal")
                .header("Authorization", "Bearer token")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.selected").value(true))
                .andExpect(jsonPath("$.title").value("Matrix"));

    }
}
