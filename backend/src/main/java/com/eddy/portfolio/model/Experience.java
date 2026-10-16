package com.eddy.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "experiences")
@Getter
@Setter
@NoArgsConstructor
public class Experience extends OrderedContent {

    @Column(name = "role_title", nullable = false, length = 200)
    private String roleTitle;

    @Column(nullable = false, length = 200)
    private String company;

    @Column(length = 120)
    private String location;

    @Column(name = "start_date", nullable = false)
    private LocalDate startDate;

    /** {@code null} = poste en cours. */
    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(length = 5000)
    private String description;
}
