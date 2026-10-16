package com.eddy.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "educations")
@Getter
@Setter
@NoArgsConstructor
public class Education extends OrderedContent {

    @Column(nullable = false, length = 200)
    private String degree;

    @Column(nullable = false, length = 200)
    private String school;

    @Column(name = "start_year", nullable = false)
    private int startYear;

    @Column(name = "end_year")
    private Integer endYear;

    @Column(length = 2000)
    private String description;
}
