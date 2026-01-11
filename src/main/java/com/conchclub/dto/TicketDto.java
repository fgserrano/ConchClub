package com.conchclub.dto;

public record TicketDto(
        Long id,
        UserDto user,
        Long seasonId,
        String tmdbId,
        String title,
        String posterPath,
        String overview,
        String releaseDate,
        boolean selected) {
}
