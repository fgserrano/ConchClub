package com.conchclub.dto;

public record MysterySubmissionDto(
                String id,
                UserDto user,
                Integer runtimeToNearestTenMin,
                String releaseYear,
                boolean selected) {
}
