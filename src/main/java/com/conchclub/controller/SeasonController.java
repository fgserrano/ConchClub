package com.conchclub.controller;

import com.conchclub.model.Season;
import com.conchclub.repository.SeasonRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;

@RestController
@RequestMapping("/api/season")
@RequiredArgsConstructor
public class SeasonController {

    private final SeasonRepository seasonRepository;
    private final com.conchclub.service.TicketService ticketService;

    @GetMapping("/active")
    public ResponseEntity<?> getActiveSeason() {
        return seasonRepository.findByActiveTrue()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> getTickets() {
        Season activeSeason = seasonRepository.findByActiveTrue().orElse(null);
        if (activeSeason == null)
            return ResponseEntity.ok(Collections.emptyList());

        return ResponseEntity.ok(ticketService.getTickets(activeSeason.getId()));
    }
}
