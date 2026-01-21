package com.conchclub.dto;

public record TicketDto(
        String id,
        UserDto user,
        Integer runtimeToNearestTenMin,
        boolean selected,
        String tmdbId,
        String title,
        String posterPath,
        String overview,
        String releaseDate,
        Long selectedAt) {
}
