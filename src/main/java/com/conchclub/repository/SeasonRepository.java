package com.conchclub.repository;

import com.conchclub.model.Season;
import org.springframework.data.repository.ListCrudRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeasonRepository extends ListCrudRepository<Season, Long> {
    Optional<Season> findByActiveTrue();
}
