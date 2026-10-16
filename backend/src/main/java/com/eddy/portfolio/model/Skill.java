package com.eddy.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
public class Skill extends OrderedContent {

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(name = "level_pct", nullable = false)
    private int levelPct = 70;
}
