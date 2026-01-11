package com.conchclub.repository;

import com.conchclub.model.Ticket;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends ListCrudRepository<Ticket, Long> {
    List<Ticket> findBySeasonId(Long seasonId);

    boolean existsBySeasonIdAndUserId(Long seasonId, Long userId);

    boolean existsBySeasonIdAndTmdbId(Long seasonId, String tmdbId);
}
