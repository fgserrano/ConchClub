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
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TmdbService {

    private static final Logger logger = LoggerFactory.getLogger(TmdbService.class);

    private final RestTemplate restTemplate;

    @Value("${tmdb.api.key}")
    private String apiKey;

    private static final String BASE_URL = "https://api.themoviedb.org/3";

    public Map<String, Object> search(String query, String type) {
        if (query == null || query.isBlank()) {
            return Collections.emptyMap();
        }

        String path = "tv".equals(type) ? "/search/tv" : "/search/movie";

        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + path)
                .queryParam("api_key", apiKey)
                .queryParam("query", query)
                .queryParam("include_adult", false)
                .toUriString();

        try {
            return restTemplate
                    .exchange(url, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {
                    }).getBody();
        } catch (Exception e) {
            logger.error("Failed to search TMDB [{}] for query [{}]: {}", path, query, e.getMessage());
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

    public String getGenres(String tmdbId, String type) {
        String path = "tv".equals(type) ? "/tv/" + tmdbId : "/movie/" + tmdbId;
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + path)
                .queryParam("api_key", apiKey)
                .toUriString();
        try {
            Map<String, Object> body = restTemplate
                    .exchange(url, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {})
                    .getBody();
            if (body != null && body.get("genres") instanceof List<?> genres) {
                return genres.stream()
                        .filter(g -> g instanceof Map)
                        .map(g -> (String) ((Map<?, ?>) g).get("name"))
                        .limit(2)
                        .collect(Collectors.joining(" / "));
            }
        } catch (Exception e) {
            logger.error("Failed to fetch genres for {} {}: {}", type, tmdbId, e.getMessage());
        }
        return null;
    }

    public Integer getTvEpisodeCount(String tmdbId) {
        String url = UriComponentsBuilder.fromHttpUrl(BASE_URL + "/tv/" + tmdbId)
                .queryParam("api_key", apiKey)
                .toUriString();

        try {
            Map<String, Object> body = restTemplate
                    .exchange(url, HttpMethod.GET, null, new ParameterizedTypeReference<Map<String, Object>>() {
                    }).getBody();

            if (body != null && body.get("number_of_episodes") instanceof Number) {
                return ((Number) body.get("number_of_episodes")).intValue();
            }
        } catch (Exception e) {
            logger.error("Failed to fetch episode count for TV series {}: {}", tmdbId, e.getMessage());
        }
        return 0;
    }
}
