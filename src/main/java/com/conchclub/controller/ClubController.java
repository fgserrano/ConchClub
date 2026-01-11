package com.conchclub.controller;

import com.conchclub.config.JwtUtils;
import com.conchclub.dto.TicketDto;
import com.conchclub.dto.UserDto;
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

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/club")
@RequiredArgsConstructor
public class ClubController {

    private final SeasonRepository seasonRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final TmdbService tmdbService;
    private final com.conchclub.service.GoogleSheetsService googleSheetsService;
    private final JwtUtils jwtUtils;

    // --- SEASONS ---

    @GetMapping("/season/active")
    public ResponseEntity<?> getActiveSeason() {
        return seasonRepository.findByActiveTrue()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/season")
    public ResponseEntity<?> createSeason(@RequestBody String name) {
        // TODO: Require Admin Role
        seasonRepository.findByActiveTrue().ifPresent(s -> {
            s.setActive(false);
            seasonRepository.save(s);
        });

        Season season = new Season();
        season.setName(name);
        season.setActive(true);
        season.setLocked(false);
        season.setCreatedAt(LocalDateTime.now());

        return ResponseEntity.ok(seasonRepository.save(season));
    }

    @PostMapping("/season/{id}/lock")
    public ResponseEntity<?> lockSeason(@PathVariable Long id) {
        // TODO: Admin check
        return seasonRepository.findById(id).map(season -> {
            season.setLocked(true);
            return ResponseEntity.ok(seasonRepository.save(season));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- MOVIES ---

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

    @GetMapping("/tickets")
    public ResponseEntity<?> getTickets() {
        Season activeSeason = seasonRepository.findByActiveTrue().orElse(null);
        if (activeSeason == null)
            return ResponseEntity.ok(Collections.emptyList());

        // TODO: Hide meaningful data if not admin/revealed
        return ResponseEntity.ok(ticketRepository.findBySeasonId(activeSeason.getId()));
    }

    @PostMapping("/reveal")
    public ResponseEntity<?> revealWinner(@RequestHeader("Authorization") String token) {
        // TODO: Admin Only check

        Season activeSeason = seasonRepository.findByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active season"));

        List<Ticket> tickets = ticketRepository.findBySeasonId(activeSeason.getId());

        if (tickets.isEmpty()) {
            return ResponseEntity.badRequest().body("No tickets to reveal!");
        }

        // Random Selection
        Collections.shuffle(tickets);
        Ticket winner = tickets.get(0);
        winner.setSelected(true);
        ticketRepository.save(winner);

        // Sync to Google Sheets
        try {
            String winnerUsername = userRepository.findById(winner.getUserId())
                    .map(User::getUsername)
                    .orElse("Unknown");

            // Header
            // User | Movie | Year | Selected
            List<Object> row = List.of(
                    winnerUsername,
                    winner.getTitle(),
                    winner.getReleaseDate(),
                    "WINNER");

            googleSheetsService.writeRow("Sheet1!A:D", row);
        } catch (Exception e) {
            // Log error but don't fail request
            System.err.println("Failed to sync to sheets: " + e.getMessage());
        }

        return ResponseEntity.ok(winner);
    }

    public record TicketRequest(String tmdbId, String title, String posterPath, String overview, String releaseDate) {
    }
}
