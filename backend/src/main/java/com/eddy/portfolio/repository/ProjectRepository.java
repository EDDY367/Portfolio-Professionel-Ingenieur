package com.eddy.portfolio.repository;

import com.eddy.portfolio.model.Project;

import java.util.Optional;

public interface ProjectRepository extends OrderedContentRepository<Project> {

    Optional<Project> findBySlugAndPublishedTrue(String slug);

    boolean existsBySlugIgnoreCase(String slug);

    boolean existsBySlugIgnoreCaseAndIdNot(String slug, Long id);
}
