package com.conchclub.service;

import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;

import java.util.Collections;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class TmdbService {

    private static final Logger logger = LoggerFactory.getLogger(TmdbService.class);

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.themoviedb.org/3";

    public Map<String, Object> searchMovie(String query) {
        if (query == null || query.isBlank()) {
            return Collections.emptyMap();
        }

        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/search/movie")
                .queryParam("api_key", apiKey)
                .queryParam("query", query)
                .queryParam("include_adult", false)
                .toUriString();

        try {
            return restTemplate
                    .exchange(url, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {
                    }).getBody();
        } catch (Exception e) {
            logger.error("Failed to search TMDB for query [{}]: {}", query, e.getMessage());
            return Collections.emptyMap();
        }
    }

    public Integer getMovieRuntime(String tmdbId) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/movie/" + tmdbId)
                .queryParam("api_key", apiKey)
                .toUriString();

        try {
            Map<String, Object> body = restTemplate
                    .exchange(url, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {
                    }).getBody();

            if (body != null && body.get("runtime") instanceof Number) {
                return ((Number) body.get("runtime")).intValue();
            }
        } catch (Exception e) {
            logger.error("Failed to fetch runtime for movie {}: {}", tmdbId, e.getMessage());
        }
        return 0;
    }
}
