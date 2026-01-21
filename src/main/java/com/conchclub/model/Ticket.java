package com.conchclub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "tickets")
public class Ticket {
    @Id
    private String id;

    private String userId;

    private String seasonId;

    private String tmdbId;
    private String title;
    private String posterPath;
    private String overview;
    private String releaseDate;
    private Integer runtime;

    private boolean selected;

    private Long selectedAt;

    @org.springframework.data.annotation.Transient
    private String username;
}
