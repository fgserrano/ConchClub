package com.conchclub.controller;

import com.conchclub.config.JwtUtils;
import com.conchclub.model.Season;
import com.conchclub.model.Ticket;
import com.conchclub.model.User;
import com.conchclub.service.AuthService;
import com.conchclub.service.SeasonService;
import com.conchclub.service.TicketService;
import com.conchclub.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submission")
@RequiredArgsConstructor
public class SubmissionController {

    private final SeasonService seasonService;
    private final TicketService ticketService;
    private final AuthService authService;
    private final TmdbService tmdbService;
    private final JwtUtils jwtUtils;

    @GetMapping("/search")
    public ResponseEntity<?> searchMovie(@RequestParam String query) {
        return ResponseEntity.ok(tmdbService.searchMovie(query));
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitMovie(@RequestHeader("Authorization") String token,
            @RequestBody TicketRequest request) {
        String username = jwtUtils.extractUsername(token.substring(7));
        User user = authService.getUserByUsername(username).orElseThrow();

        Season activeSeason = seasonService.getActiveSeason()
                .orElseThrow(() -> new RuntimeException("No active season"));

        if (activeSeason.isLocked()) {
            return ResponseEntity.badRequest().body("Season is locked");
        }

        if (ticketService.existsBySeasonIdAndUserId(activeSeason.getId(), user.getId())) {
            return ResponseEntity.badRequest().body("You have already submitted a movie for this season");
        }

        if (ticketService.existsBySeasonIdAndTmdbId(activeSeason.getId(), request.tmdbId)) {
            return ResponseEntity.badRequest().body("This movie has already been submitted!");
        }

        Ticket ticket = new Ticket();
        ticket.setUserId(user.getId());
        ticket.setSeasonId(activeSeason.getId());
        ticket.setTmdbId(request.tmdbId);
        ticket.setTitle(request.title);
        ticket.setPosterPath(request.posterPath);
        ticket.setOverview(request.overview);
        ticket.setReleaseDate(request.releaseDate);
        ticket.setRuntime(tmdbService.getMovieRuntime(request.tmdbId));
        ticket.setSelected(false);

        return ResponseEntity.ok(ticketService.save(ticket));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateSubmission(@RequestHeader("Authorization") String token,
            @RequestBody TicketRequest request) {
        String username = jwtUtils.extractUsername(token.substring(7));
        User user = authService.getUserByUsername(username).orElseThrow();

        Season activeSeason = seasonService.getActiveSeason()
                .orElseThrow(() -> new RuntimeException("No active season"));

        if (activeSeason.isLocked()) {
            return ResponseEntity.badRequest().body("Season is locked");
        }

        Ticket ticket = ticketService.findBySeasonIdAndUserId(activeSeason.getId(), user.getId())
                .orElseThrow(() -> new RuntimeException("Submission not found"));

        if (!ticket.getTmdbId().equals(request.tmdbId)) {
            if (ticketService.existsBySeasonIdAndTmdbId(activeSeason.getId(), request.tmdbId)) {
                return ResponseEntity.badRequest().body("This movie has already been submitted!");
            }
        }

        ticket.setTmdbId(request.tmdbId);
        ticket.setTitle(request.title);
        ticket.setPosterPath(request.posterPath);
        ticket.setOverview(request.overview);
        ticket.setReleaseDate(request.releaseDate);
        ticket.setRuntime(tmdbService.getMovieRuntime(request.tmdbId));

        return ResponseEntity.ok(ticketService.save(ticket));
    }

    public record TicketRequest(String tmdbId, String title, String posterPath, String overview, String releaseDate) {
    }
}
