package com.conchclub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

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
}
