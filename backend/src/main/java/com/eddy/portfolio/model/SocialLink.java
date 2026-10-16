package com.eddy.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "social_links")
@Getter
@Setter
@NoArgsConstructor
public class SocialLink extends OrderedContent {

    @Column(nullable = false, length = 60)
    private String platform;

    @Column(nullable = false, length = 500)
    private String url;

    /** Cle d'icone cote front (github, linkedin, mail...). */
    @Column(name = "icon_key", length = 40)
    private String iconKey;
}
