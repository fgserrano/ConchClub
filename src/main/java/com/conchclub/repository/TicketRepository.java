package com.conchclub.repository;

import com.conchclub.model.Ticket;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

import java.util.Optional;

@Repository
public interface TicketRepository extends MongoRepository<Ticket, String> {
    List<Ticket> findBySeasonId(String seasonId);

    boolean existsBySeasonIdAndUserId(String seasonId, String userId);

    boolean existsBySeasonIdAndTmdbId(String seasonId, String tmdbId);

    Optional<Ticket> findBySeasonIdAndUserId(String seasonId, String userId);
}
