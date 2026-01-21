package com.conchclub.repository;

import com.conchclub.model.Season;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SeasonRepository extends MongoRepository<Season, String> {
    Optional<Season> findByActiveTrue();
}
