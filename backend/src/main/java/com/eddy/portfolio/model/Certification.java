package com.eddy.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "certifications")
@Getter
@Setter
@NoArgsConstructor
public class Certification extends OrderedContent {

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, length = 200)
    private String issuer;

    @Column(name = "issued_on")
    private LocalDate issuedOn;

    @Column(name = "credential_url", length = 500)
    private String credentialUrl;
}
