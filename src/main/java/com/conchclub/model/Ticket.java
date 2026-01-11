package com.conchclub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("tickets")
public class Ticket {
    @Id
    private Long id;

    @Column("user_id")
    private Long userId;

    @Column("season_id")
    private Long seasonId;

    // TMDB Data
    private String tmdbId;
    private String title;
    private String posterPath;
    private String overview;
    private String releaseDate;

    private boolean selected; // If this ticket was the "Winner"
}
