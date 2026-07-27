package com.conchclub.controller;

import com.conchclub.dto.ArchivedSeasonDto;
import com.conchclub.dto.MysterySubmissionDto;
import com.conchclub.dto.SubmissionDto;
import com.conchclub.dto.UserDto;
import com.conchclub.model.Season;
import com.conchclub.model.Submission;

import com.conchclub.service.SeasonService;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;
import java.security.Principal;

@RestController
@RequestMapping("/api/season")
@RequiredArgsConstructor
public class SeasonController {

    private final SeasonService seasonService;
    private final com.conchclub.service.AuthService authService;

    @GetMapping("/active")
    public ResponseEntity<Season> getActiveSeason() {
        return seasonService.getActiveSeason()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.ok(null));
    }

    @GetMapping("/submissions")
    public ResponseEntity<List<MysterySubmissionDto>> getSubmissions() {
        return seasonService.getActiveSeason()
                .map(activeSeason -> {
                    List<Submission> submissions = activeSeason.getSubmissions();
                    List<MysterySubmissionDto> dtos = submissions.stream().map(s -> {
                        UserDto user = new UserDto(s.getUsername());
                        Integer runtime = s.getRuntime();
                        Integer rounded = (runtime == null) ? null : (int) (Math.round(runtime / 10.0) * 10);
                        String year = (s.getReleaseDate() != null && s.getReleaseDate().contains("-"))
                                ? s.getReleaseDate().split("-")[0]
                                : s.getReleaseDate();
                        return new MysterySubmissionDto(s.getId(), user, rounded, year, s.isSelected(), s.getMediaType(), s.getGenre());
                    }).toList();
                    return ResponseEntity.ok(dtos);
                })
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }

    @GetMapping("/active/selection")
    public ResponseEntity<List<SubmissionDto>> getActiveSelection() {
        return seasonService.getActiveSeason()
                .map(activeSeason -> {
                    List<Submission> submissions = activeSeason.getSubmissions();
                    List<SubmissionDto> selectedSubmissions = submissions.stream()
                            .filter(Submission::isSelected)
                            .map(this::mapToSubmissionDto)
                            .toList();
                    return ResponseEntity.ok(selectedSubmissions);
                })
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }

    @GetMapping("/archived")
    public ResponseEntity<List<ArchivedSeasonDto>> getArchivedSeasons() {
        List<Season> archived = seasonService.getArchivedSeasons();
        List<ArchivedSeasonDto> dtos = archived.stream().map(s -> {
            List<SubmissionDto> selections = s.getSubmissions().stream()
                    .filter(Submission::isSelected)
                    .map(this::mapToSubmissionDto)
                    .toList();
            Long startedAt = s.getCreatedAt() != null
                    ? s.getCreatedAt().toEpochSecond(java.time.ZoneOffset.UTC) * 1000
                    : null;
            Long closedAt = s.getClosedAt() != null
                    ? s.getClosedAt().toEpochSecond(java.time.ZoneOffset.UTC) * 1000
                    : null;
            return new ArchivedSeasonDto(s.getId(), s.getName(), startedAt, closedAt, selections);
        }).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/submissions/me")
    public ResponseEntity<?> getMySubmission(Principal principal) {
        if (principal == null) {
            return ResponseEntity.ok().build();
        }

        return authService.getUserByUsername(principal.getName())
                .flatMap(user -> seasonService.getActiveSeason()
                        .map(season -> {
                            List<Submission> submissions = season.getSubmissions();
                            return submissions.stream()
                                    .filter(s -> s.getUserId() != null && s.getUserId().equals(user.getId()))
                                    .findFirst()
                                    .map(this::mapToSubmissionDto)
                                    .map(ResponseEntity::ok)
                                    .orElse(ResponseEntity.noContent().build());
                        }))
                .orElse(ResponseEntity.noContent().build());
    }

    private SubmissionDto mapToSubmissionDto(Submission s) {
        UserDto user = new UserDto(s.getUsername());
        Integer runtime = s.getRuntime();
        Integer rounded = (runtime == null) ? null : (int) (Math.round(runtime / 10.0) * 10);
        return new SubmissionDto(
                s.getId(),
                user,
                rounded,
                s.isSelected(),
                s.getTmdbId(),
                s.getTitle(),
                s.getPosterPath(),
                s.getOverview(),
                s.getReleaseDate(),
                s.getSelectedAt(),
                s.getMediaType(),
                s.getGenre());
    }
}
