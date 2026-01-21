package com.conchclub.dto;

public record MysteryTicketDto(
        String id,
        UserDto user,
        Integer runtimeToNearestTenMin,
        String releaseYear,
        boolean selected) {
}
