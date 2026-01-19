package com.conchclub.controller;

import com.conchclub.dto.TicketDto;
import com.conchclub.dto.UserDto;
import com.conchclub.model.Season;
import com.conchclub.model.Ticket;
import com.conchclub.repository.SeasonRepository;
import com.conchclub.repository.TicketRepository;
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

    @GetMapping("/tickets")
    public ResponseEntity<List<TicketDto>> getTickets() {
        return seasonRepository.findByActiveTrue()
                .map(activeSeason -> {
                    List<Ticket> tickets = ticketRepository.findBySeasonId(activeSeason.getId());
                    List<TicketDto> dtos = tickets.stream().map(this::mapToTicketDto).toList();
                    return ResponseEntity.ok(dtos);
                })
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }

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

    @PostMapping("/season/{id}/unlock")
    public ResponseEntity<?> unlockSeason(@PathVariable Long id) {
        return seasonRepository.findById(id).map(season -> {
            season.setLocked(false);
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

        Collections.shuffle(tickets);
        Ticket winner = tickets.get(0);
        winner.setSelected(true);
        ticketRepository.save(winner);

        return ResponseEntity.ok(winner);
    }

    public record CreateSeasonRequest(String name) {
    }

    private TicketDto mapToTicketDto(Ticket t) {
        UserDto user = new UserDto(t.getUsername());
        Integer runtime = t.getRuntime();
        Integer rounded = (runtime == null) ? null : (int) (Math.round(runtime / 10.0) * 10);
        return new TicketDto(
                t.getId(),
                user,
                rounded,
                t.isSelected(),
                t.getTmdbId(),
                t.getTitle(),
                t.getPosterPath(),
                t.getOverview(),
                t.getReleaseDate());
    }
}
