package com.conchclub.controller;

import com.conchclub.dto.MysteryTicketDto;
import com.conchclub.dto.TicketDto;
import com.conchclub.dto.UserDto;
import com.conchclub.model.Ticket;

import com.conchclub.service.SeasonService;
import com.conchclub.service.TicketService;

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
    private final TicketService ticketService;

    @GetMapping("/active")
    public ResponseEntity<?> getActiveSeason() {
        return seasonService.getActiveSeason()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tickets")
    public ResponseEntity<List<MysteryTicketDto>> getTickets() {
        return seasonService.getActiveSeason()
                .map(activeSeason -> {
                    List<Ticket> tickets = ticketService.getTickets(activeSeason.getId());
                    List<MysteryTicketDto> dtos = tickets.stream().map(t -> {
                        UserDto user = new UserDto(t.getUsername());
                        Integer runtime = t.getRuntime();
                        Integer rounded = (runtime == null) ? null : (int) (Math.round(runtime / 10.0) * 10);
                        String year = (t.getReleaseDate() != null && t.getReleaseDate().contains("-"))
                                ? t.getReleaseDate().split("-")[0]
                                : t.getReleaseDate();
                        return new MysteryTicketDto(t.getId(), user, rounded, year, t.isSelected());
                    }).toList();
                    return ResponseEntity.ok(dtos);
                })
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }

    @GetMapping("/active/selection")
    public ResponseEntity<List<TicketDto>> getActiveSelection() {
        return seasonService.getActiveSeason()
                .map(activeSeason -> {
                    List<Ticket> tickets = ticketService.getTickets(activeSeason.getId());
                    List<TicketDto> selectedTickets = tickets.stream()
                            .filter(Ticket::isSelected)
                            .map(this::mapToTicketDto)
                            .toList();
                    return ResponseEntity.ok(selectedTickets);
                })
                .orElse(ResponseEntity.ok(Collections.emptyList()));
    }

    @GetMapping("/tickets/me")
    public ResponseEntity<?> getMyTicket(Principal principal) {
        return Optional.ofNullable(principal)
                .flatMap(p -> seasonService.getActiveSeason())
                .map(season -> {
                    List<Ticket> tickets = ticketService.getTickets(season.getId());
                    return tickets.stream()
                            .filter(t -> t.getUsername() != null && t.getUsername().equals(principal.getName()))
                            .findFirst()
                            .map(this::mapToTicketDto)
                            .map(ResponseEntity::ok)
                            .orElse(ResponseEntity.noContent().build());
                })
                .orElse(ResponseEntity.ok().build());
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
