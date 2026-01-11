package com.conchclub.controller;

import com.conchclub.config.JwtUtils;
import com.conchclub.model.Season;
import com.conchclub.model.Ticket;
import com.conchclub.model.User;
import com.conchclub.repository.SeasonRepository;
import com.conchclub.repository.TicketRepository;
import com.conchclub.repository.UserRepository;
import com.conchclub.service.TmdbService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/submission")
@RequiredArgsConstructor
public class SubmissionController {

    private final SeasonRepository seasonRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
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
        User user = userRepository.findByUsername(username).orElseThrow();

        Season activeSeason = seasonRepository.findByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active season"));

        if (activeSeason.isLocked()) {
            return ResponseEntity.badRequest().body("Season is locked");
        }

        if (ticketRepository.existsBySeasonIdAndUserId(activeSeason.getId(), user.getId())) {
            return ResponseEntity.badRequest().body("You have already submitted a movie for this season");
        }

        if (ticketRepository.existsBySeasonIdAndTmdbId(activeSeason.getId(), request.tmdbId)) {
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
        ticket.setSelected(false);

        return ResponseEntity.ok(ticketRepository.save(ticket));
    }

    public record TicketRequest(String tmdbId, String title, String posterPath, String overview, String releaseDate) {
    }
}
