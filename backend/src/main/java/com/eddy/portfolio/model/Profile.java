package com.eddy.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/** Fiche principale du portfolio (une seule ligne en base). */
@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
public class Profile extends BaseEntity {

    @Column(name = "full_name", nullable = false, length = 120)
    private String fullName;

    @Column(nullable = false, length = 200)
    private String headline;

    @Column(length = 4000)
    private String bio;

    @Column(length = 200)
    private String email;

    @Column(length = 40)
    private String phone;

    @Column(length = 120)
    private String location;

    @Column(name = "photo_url", length = 500)
    private String photoUrl;

    @Column(name = "cv_url", length = 500)
    private String cvUrl;
}
