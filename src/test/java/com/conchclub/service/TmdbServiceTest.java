package com.conchclub.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import org.mockito.ArgumentMatchers;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TmdbServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private TmdbService tmdbService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(tmdbService, "apiKey", "test-api-key");
    }

    @Test
    void searchMovie_ReturnsData_WhenSuccessful() {
        Map<String, Object> expectedResponse = new HashMap<>();
        expectedResponse.put("results", "some data");

        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.GET),
                isNull(),
                ArgumentMatchers.<ParameterizedTypeReference<Map<String, Object>>>any()))
                .thenReturn(ResponseEntity.ok(expectedResponse));

        Map<String, Object> result = tmdbService.searchMovie("Inception");

        assertThat(result).isEqualTo(expectedResponse);
    }

    @Test
    void getMovieRuntime_ReturnsRuntime_WhenSuccessful() {
        Map<String, Object> body = new HashMap<>();
        body.put("runtime", 148);

        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.GET),
                isNull(),
                ArgumentMatchers.<ParameterizedTypeReference<Map<String, Object>>>any()))
                .thenReturn(ResponseEntity.ok(body));

        Integer runtime = tmdbService.getMovieRuntime("123");

        assertThat(runtime).isEqualTo(148);
    }

    @Test
    void getMovieRuntime_ReturnsZero_WhenNotFound() {
        when(restTemplate.exchange(
                anyString(),
                eq(HttpMethod.GET),
                isNull(),
                ArgumentMatchers.<ParameterizedTypeReference<Map<String, Object>>>any()))
                .thenThrow(new RuntimeException("API Error"));

        Integer runtime = tmdbService.getMovieRuntime("invalid");

        assertThat(runtime).isEqualTo(0);
    }
}
