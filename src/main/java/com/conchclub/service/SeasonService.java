package com.conchclub.service;

import com.conchclub.model.Season;
import com.conchclub.repository.SeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SeasonService {

    private final SeasonRepository seasonRepository;

    public Optional<Season> getActiveSeason() {
        return seasonRepository.findByActiveTrue();
    }

    public Season save(Season season) {
        return seasonRepository.save(season);
    }

    public Optional<Season> getSeasonById(String id) {
        return seasonRepository.findById(id);
    }
}
