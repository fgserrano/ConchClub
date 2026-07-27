package com.conchclub.dto;

import java.util.List;

public record ArchivedSeasonDto(
        String id,
        String name,
        Long startedAt,
        Long closedAt,
        List<SubmissionDto> selections) {
}
