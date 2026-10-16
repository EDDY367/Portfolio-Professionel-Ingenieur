package com.eddy.portfolio.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
public class Project extends OrderedContent {

    @Column(nullable = false, unique = true, length = 120)
    private String slug;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 500)
    private String summary;

    @Column(length = 10000)
    private String description;

    /** Technologies separees par des virgules (liste exposee dans l'API). */
    @Column(name = "tech_stack", length = 500)
    private String techStack;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "demo_url", length = 500)
    private String demoUrl;

    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "is_featured", nullable = false)
    private boolean featured = false;
}
