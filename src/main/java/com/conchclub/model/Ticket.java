package com.conchclub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import org.springframework.data.relational.core.mapping.Column;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("TICKETS")
public class Ticket {
    @Id
    private Long id;

    @Column("USER_ID")
    private Long userId;

    @Column("SEASON_ID")
    private Long seasonId;

    private String tmdbId;
    private String title;
    private String posterPath;
    private String overview;
    private String releaseDate;
    private Integer runtime;

    private boolean selected;

    @org.springframework.data.annotation.Transient
    private String username;
}
