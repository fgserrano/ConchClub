package com.conchclub.service;

import com.conchclub.model.Season;
import com.conchclub.model.Submission;
import com.conchclub.repository.SeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
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

    public List<Season> getArchivedSeasons() {
        return seasonRepository.findByClosedAtNotNullOrderByClosedAtDesc();
    }

    public Season closeSeason(String id) {
        Season season = getSeasonById(id)
                .orElseThrow(() -> new RuntimeException("Season not found"));
        season.setActive(false);
        season.setLocked(true);
        season.setClosedAt(LocalDateTime.now());
        return save(season);
    }

    public Season addSubmission(String seasonId, Submission submission) {
        Season season = getSeasonById(seasonId)
                .orElseThrow(() -> new RuntimeException("Season not found"));

        season.getSubmissions().removeIf(s -> s.getUserId().equals(submission.getUserId()));

        season.getSubmissions().add(submission);
        return save(season);
    }

    public Season updateSubmission(String seasonId, Submission submission) {
        Season season = getSeasonById(seasonId)
                .orElseThrow(() -> new RuntimeException("Season not found"));

        season.getSubmissions().replaceAll(s -> s.getId().equals(submission.getId()) ? submission : s);

        return save(season);
    }
}
