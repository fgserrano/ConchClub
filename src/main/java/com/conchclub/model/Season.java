package com.conchclub.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Table("SEASONS")
public class Season {
    @Id
    private Long id;

    private String name;
    private boolean active;
    private boolean locked;
    private LocalDateTime createdAt;
}
