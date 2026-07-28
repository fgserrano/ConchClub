package com.conchclub.controller;

import com.conchclub.dto.AdminUserDto;
import com.conchclub.dto.ResetTokenResponse;
import com.conchclub.dto.SubmissionDto;
import com.conchclub.dto.UserDto;
import com.conchclub.model.Season;
import com.conchclub.model.Submission;
import com.conchclub.repository.UserRepository;
import com.conchclub.service.PasswordResetService;
import com.conchclub.service.SeasonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final SeasonService seasonService;
    private final UserRepository userRepository;
    private final PasswordResetService passwordResetService;

    @GetMapping("/users")
    public ResponseEntity<List<AdminUserDto>> getAllUsers() {
        List<AdminUserDto> users = userRepository.findAll().stream()
                .map(user -> new AdminUserDto(user.getUsername(), user.getRole().name()))
                .toList();
        return ResponseEntity.ok(users);
    }

    @PostMapping("/users/{username}/reset-token")
    public ResponseEntity<?> generatePasswordResetToken(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    String resetUrl = passwordResetService.generateResetLink(user.getId());
                    return ResponseEntity.ok(new ResetTokenResponse(resetUrl));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/submissions")
    public ResponseEntity<List<SubmissionDto>> getSubmissions() {
        return seasonService.getActiveSeason()
                .map(activeSeason -> {
                    List<Submission> submissions = activeSeason.getSubmissions();
                    List<SubmissionDto> dtos = submissions.stream().map(this::mapToSubmissionDto).toList();
                    return ResponseEntity.ok(dtos);
                })
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }

    @PostMapping("/season")
    public ResponseEntity<?> createSeason(@RequestBody CreateSeasonRequest request) {
        seasonService.getActiveSeason().ifPresent(s -> {
            s.setActive(false);
            seasonService.save(s);
        });

        Season season = new Season();
        season.setName(request.name());
        season.setActive(true);
        season.setLocked(false);
        season.setCreatedAt(LocalDateTime.now());

        return ResponseEntity.ok(seasonService.save(season));
    }

    @PostMapping("/season/{id}/lock")
    public ResponseEntity<?> lockSeason(@PathVariable String id) {
        return seasonService.getSeasonById(id).map(season -> {
            season.setLocked(true);
            return ResponseEntity.ok(seasonService.save(season));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/season/{id}/unlock")
    public ResponseEntity<?> unlockSeason(@PathVariable String id) {
        return seasonService.getSeasonById(id).map(season -> {
            season.setLocked(false);
            return ResponseEntity.ok(seasonService.save(season));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/season/{id}/rename")
    public ResponseEntity<?> renameSeason(@PathVariable String id, @RequestBody RenameSeasonRequest request) {
        if (request.name() == null || request.name().isBlank()) {
            return ResponseEntity.badRequest().body("Season name cannot be blank.");
        }
        return seasonService.getSeasonById(id).map(season -> {
            season.setName(request.name().trim());
            return ResponseEntity.ok(seasonService.save(season));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/season/{id}/close")
    public ResponseEntity<?> closeSeason(@PathVariable String id) {
        try {
            Season closed = seasonService.closeSeason(id);
            return ResponseEntity.ok(closed);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/reveal")
    public ResponseEntity<?> revealWinner(@RequestHeader("Authorization") String token,
            @RequestBody RevealRequest request) {

        Season activeSeason = seasonService.getActiveSeason()
                .orElseThrow(() -> new RuntimeException("No active season"));

        Submission submission = activeSeason.getSubmissions().stream()
                .filter(s -> s.getId().equals(request.submissionId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        submission.setSelected(true);
        submission.setSelectedAt(System.currentTimeMillis());

        seasonService.updateSubmission(activeSeason.getId(), submission);

        return ResponseEntity.ok(mapToSubmissionDto(submission));
    }

    public record RevealRequest(String submissionId) {
    }

    public record CreateSeasonRequest(String name) {
    }

    public record RenameSeasonRequest(String name) {
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
