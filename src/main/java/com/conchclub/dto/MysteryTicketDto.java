package com.conchclub.dto;

public record MysteryTicketDto(
        Long id,
        UserDto user,
        Integer runtimeToNearestTenMin,
        boolean selected) {
}
