package com.conchclub.controller;

import com.conchclub.dto.TicketDto;
import com.conchclub.dto.UserDto;
import com.conchclub.model.Season;
import com.conchclub.model.Ticket;
import com.conchclub.service.SeasonService;
import com.conchclub.service.TicketService;
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
    private final TicketService ticketService;

    @GetMapping("/tickets")
    public ResponseEntity<List<TicketDto>> getTickets() {
        return seasonService.getActiveSeason()
                .map(activeSeason -> {
                    List<Ticket> tickets = ticketService.getTickets(activeSeason.getId());
                    List<TicketDto> dtos = tickets.stream().map(this::mapToTicketDto).toList();
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

    @PostMapping("/reveal")
    public ResponseEntity<?> revealWinner(@RequestHeader("Authorization") String token,
            @RequestBody RevealRequest request) {

        Season activeSeason = seasonService.getActiveSeason()
                .orElseThrow(() -> new RuntimeException("No active season"));

        Ticket ticket = ticketService.getTicketById(request.ticketId())
                .orElseThrow(() -> new RuntimeException("Ticket not found"));

        if (!ticket.getSeasonId().equals(activeSeason.getId())) {
            return ResponseEntity.badRequest().body("Ticket does not belong to active season");
        }

        ticket.setSelected(true);
        ticket.setSelectedAt(System.currentTimeMillis());
        ticketService.save(ticket);

        return ResponseEntity.ok(mapToTicketDto(ticket));
    }

    public record RevealRequest(String ticketId) {
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
                t.getReleaseDate(),
                t.getSelectedAt());
    }
}
