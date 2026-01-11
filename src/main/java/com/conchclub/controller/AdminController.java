package com.conchclub.controller;

import com.conchclub.model.Season;
import com.conchclub.model.Ticket;
import com.conchclub.model.User;
import com.conchclub.repository.SeasonRepository;
import com.conchclub.repository.TicketRepository;
import com.conchclub.repository.UserRepository;
import com.conchclub.service.GoogleSheetsService;
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

    private final SeasonRepository seasonRepository;
    private final TicketRepository ticketRepository;
    private final UserRepository userRepository;
    private final GoogleSheetsService googleSheetsService;

    @PostMapping("/season")
    public ResponseEntity<?> createSeason(@RequestBody CreateSeasonRequest request) {
        seasonRepository.findByActiveTrue().ifPresent(s -> {
            s.setActive(false);
            seasonRepository.save(s);
        });

        Season season = new Season();
        season.setName(request.name());
        season.setActive(true);
        season.setLocked(false);
        season.setCreatedAt(LocalDateTime.now());

        return ResponseEntity.ok(seasonRepository.save(season));
    }

    @PostMapping("/season/{id}/lock")
    public ResponseEntity<?> lockSeason(@PathVariable Long id) {
        return seasonRepository.findById(id).map(season -> {
            season.setLocked(true);
            return ResponseEntity.ok(seasonRepository.save(season));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/reveal")
    public ResponseEntity<?> revealWinner(@RequestHeader("Authorization") String token) {

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

    public record CreateSeasonRequest(String name) {
    }
}
