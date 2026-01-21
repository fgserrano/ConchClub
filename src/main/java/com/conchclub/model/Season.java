package com.conchclub.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "seasons")
public class Season {
    @Id
    private String id;

    private String name;
    private boolean active;
    private boolean locked;
    private LocalDateTime createdAt;

    private List<Submission> submissions = new ArrayList<>();
}
