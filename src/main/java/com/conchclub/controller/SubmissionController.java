package com.conchclub.controller;

import com.conchclub.config.JwtUtils;
import com.conchclub.model.Season;
import com.conchclub.model.Submission;
import com.conchclub.model.User;
import com.conchclub.service.AuthService;
import com.conchclub.service.SeasonService;
import com.conchclub.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submission")
@RequiredArgsConstructor
public class SubmissionController {

    private final SeasonService seasonService;
    private final AuthService authService;
    private final TmdbService tmdbService;
    private final JwtUtils jwtUtils;

    @GetMapping("/search")
    public ResponseEntity<?> searchMovie(@RequestParam String query) {
        return ResponseEntity.ok(tmdbService.searchMovie(query));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitMovie(@RequestHeader("Authorization") String token,
            @RequestBody SubmissionRequest request) {
        String username = jwtUtils.extractUsername(token.substring(7));
        User user = authService.getUserByUsername(username).orElseThrow();

        Season activeSeason = seasonService.getActiveSeason()
                .orElseThrow(() -> new RuntimeException("No active season"));

        if (activeSeason.isLocked()) {
            return ResponseEntity.badRequest().body("Season is locked");
        }

        boolean alreadySubmitted = activeSeason.getSubmissions().stream()
                .anyMatch(s -> s.getUserId().equals(user.getId()));

        if (alreadySubmitted) {
            return ResponseEntity.badRequest().body("You have already submitted a movie for this season");
        }

        boolean alreadyExists = activeSeason.getSubmissions().stream()
                .anyMatch(s -> s.getTmdbId().equals(request.tmdbId));

        if (alreadyExists) {
            return ResponseEntity.badRequest().body("This movie has already been submitted!");
        }

        Submission submission = new Submission();
        submission.setUserId(user.getId());
        submission.setUsername(user.getUsername());
        submission.setTmdbId(request.tmdbId);
        submission.setTitle(request.title);
        submission.setPosterPath(request.posterPath);
        submission.setOverview(request.overview);
        submission.setReleaseDate(request.releaseDate);
        submission.setRuntime(tmdbService.getMovieRuntime(request.tmdbId));
        submission.setSelected(false);

        seasonService.addSubmission(activeSeason.getId(), submission);
        return ResponseEntity.ok(submission);
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateSubmission(@RequestHeader("Authorization") String token,
            @RequestBody SubmissionRequest request) {
        String username = jwtUtils.extractUsername(token.substring(7));
        User user = authService.getUserByUsername(username).orElseThrow();

        Season activeSeason = seasonService.getActiveSeason()
                .orElseThrow(() -> new RuntimeException("No active season"));

        if (activeSeason.isLocked()) {
            return ResponseEntity.badRequest().body("Season is locked");
        }

        Submission submission = activeSeason.getSubmissions().stream()
                .filter(s -> s.getUserId().equals(user.getId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        if (!submission.getTmdbId().equals(request.tmdbId)) {
            boolean alreadyExists = activeSeason.getSubmissions().stream()
                    .anyMatch(s -> s.getTmdbId().equals(request.tmdbId));
            if (alreadyExists) {
                return ResponseEntity.badRequest().body("This movie has already been submitted!");
            }
        }

        submission.setTmdbId(request.tmdbId);
        submission.setTitle(request.title);
        submission.setPosterPath(request.posterPath);
        submission.setOverview(request.overview);
        submission.setReleaseDate(request.releaseDate);
        submission.setRuntime(tmdbService.getMovieRuntime(request.tmdbId));

        seasonService.updateSubmission(activeSeason.getId(), submission);
        return ResponseEntity.ok(submission);
    }

    public record SubmissionRequest(String tmdbId, String title, String posterPath, String overview,
            String releaseDate) {
    }
}
