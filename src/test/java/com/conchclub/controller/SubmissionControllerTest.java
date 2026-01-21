package com.conchclub.controller;

import com.conchclub.config.JwtUtils;
import com.conchclub.model.Season;
import com.conchclub.model.Submission;
import com.conchclub.model.User;
import com.conchclub.service.AuthService;
import com.conchclub.service.SeasonService;
import com.conchclub.service.TmdbService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SubmissionController.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("local")
public class SubmissionControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private SeasonService seasonService;

        @MockBean
        private TmdbService tmdbService;

        @MockBean
        private JwtUtils jwtUtils;

        @MockBean
        private AuthService authService;

        @Autowired
        private ObjectMapper objectMapper;

        @Test
        void submitMovie_ReturnsBadRequest_WhenSeasonIsLocked() throws Exception {
                SubmissionController.SubmissionRequest request = new SubmissionController.SubmissionRequest("1",
                                "Title",
                                "Path",
                                "Desc", "2024");
                Season season = new Season();
                season.setLocked(true);
                User user = new User();
                user.setId("1");

                when(jwtUtils.extractUsername(anyString())).thenReturn("user");
                when(authService.getUserByUsername("user")).thenReturn(Optional.of(user));
                when(seasonService.getActiveSeason()).thenReturn(Optional.of(season));

                mockMvc.perform(post("/api/submission/submit")
                                .header("Authorization", "Bearer token")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(content().string("Season is locked"));
        }

        @Test
        void submitMovie_ReturnsBadRequest_WhenAlreadySubmitted() throws Exception {
                SubmissionController.SubmissionRequest request = new SubmissionController.SubmissionRequest("1",
                                "Title",
                                "Path",
                                "Desc", "2024");
                Season season = new Season();
                season.setId("1");
                season.setLocked(false);
                User user = new User();
                user.setId("1");

                Submission submission = new Submission();
                submission.setUserId("1");
                season.getSubmissions().add(submission);

                when(jwtUtils.extractUsername(anyString())).thenReturn("user");
                when(authService.getUserByUsername("user")).thenReturn(Optional.of(user));
                when(seasonService.getActiveSeason()).thenReturn(Optional.of(season));

                mockMvc.perform(post("/api/submission/submit")
                                .header("Authorization", "Bearer token")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(request)))
                                .andExpect(status().isBadRequest())
                                .andExpect(content().string("You have already submitted a movie for this season"));
        }
}
