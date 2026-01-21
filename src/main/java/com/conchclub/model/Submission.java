package com.conchclub.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Submission {
    private String id = UUID.randomUUID().toString();
    private String userId;
    private String username;
    private String tmdbId;
    private String title;
    private String posterPath;
    private String overview;
    private String releaseDate;
    private Integer runtime;
    private boolean selected;
    private Long selectedAt;
}
