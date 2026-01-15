package com.conchclub.repository;

import com.conchclub.model.Ticket;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jdbc.repository.query.Query;

import java.util.List;

import java.util.Optional;

@Repository
public interface TicketRepository extends ListCrudRepository<Ticket, Long> {
    @Query(value = "SELECT t.*, u.username FROM TICKETS t JOIN USERS u ON t.USER_ID = u.ID WHERE t.SEASON_ID = :seasonId", rowMapperClass = TicketRowMapper.class)
    List<Ticket> findBySeasonId(Long seasonId);

    boolean existsBySeasonIdAndUserId(Long seasonId, Long userId);

    boolean existsBySeasonIdAndTmdbId(Long seasonId, String tmdbId);

    Optional<Ticket> findBySeasonIdAndUserId(Long seasonId, Long userId);
}
