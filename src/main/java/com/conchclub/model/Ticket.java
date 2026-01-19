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
@Table("tickets")
public class Ticket {
    @Id
    private Long id;

    @Column("user_id")
    private Long userId;

    @Column("season_id")
    private Long seasonId;

    private String tmdbId;
    private String title;
    private String posterPath;
    private String overview;
    private String releaseDate;
    private Integer runtime;

    private boolean selected;

    @Column("selected_at")
    private Long selectedAt;

    @org.springframework.data.annotation.Transient
    private String username;
}
