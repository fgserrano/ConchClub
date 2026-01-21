package com.conchclub.controller;

import com.conchclub.dto.MysterySubmissionDto;
import com.conchclub.dto.SubmissionDto;
import com.conchclub.dto.UserDto;
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
import java.util.Optional;

@RestController
@RequestMapping("/api/season")
@RequiredArgsConstructor
public class SeasonController {

    private final SeasonService seasonService;

    @GetMapping("/active")
    public ResponseEntity<?> getActiveSeason() {
        return seasonService.getActiveSeason()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
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
                        return new MysterySubmissionDto(s.getId(), user, rounded, year, s.isSelected());
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
                    List<SubmissionDto> selectedTickets = submissions.stream()
                            .filter(Submission::isSelected)
                            .map(this::mapToSubmissionDto)
                            .toList();
                    return ResponseEntity.ok(selectedTickets);
                })
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }

    @GetMapping("/submissions/me")
    public ResponseEntity<?> getMySubmission(Principal principal) {
        return Optional.ofNullable(principal)
                .flatMap(p -> seasonService.getActiveSeason())
                .map(season -> {
                    List<Submission> submissions = season.getSubmissions();
                    return submissions.stream()
                            .filter(s -> s.getUsername() != null && s.getUsername().equals(principal.getName()))
                            .findFirst()
                            .map(this::mapToSubmissionDto)
                            .map(ResponseEntity::ok)
                            .orElse(ResponseEntity.noContent().build());
                })
                .orElse(ResponseEntity.ok().build());
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
                s.getSelectedAt());
    }
}
