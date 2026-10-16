package com.eddy.portfolio.service;

import com.eddy.portfolio.dto.ProjectDto;
import com.eddy.portfolio.exception.ConflictException;
import com.eddy.portfolio.exception.ResourceNotFoundException;
import com.eddy.portfolio.model.Project;
import com.eddy.portfolio.repository.ProjectRepository;
import org.springframework.stereotype.Service;

@Service
public class ProjectService extends OrderedContentService<Project, ProjectDto.Request, ProjectDto.Response> {

    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        super(projectRepository, "Projet");
        this.projectRepository = projectRepository;
    }

    @Override
    protected Project newEntity() {
        return new Project();
    }

    @Override
    protected void apply(ProjectDto.Request request, Project entity) {
        request.applyTo(entity);
    }

    @Override
    protected ProjectDto.Response toResponse(Project entity) {
        return ProjectDto.Response.from(entity);
    }

    @Override
    protected void validateBeforeSave(ProjectDto.Request request, Project entity) {
        boolean taken = entity.getId() == null
                ? projectRepository.existsBySlugIgnoreCase(request.slug())
                : projectRepository.existsBySlugIgnoreCaseAndIdNot(request.slug(), entity.getId());
        if (taken) {
            throw new ConflictException("Un projet avec ce slug existe deja");
        }
    }

    public ProjectDto.Response getPublishedBySlug(String slug) {
        return projectRepository.findBySlugAndPublishedTrue(slug)
                .map(ProjectDto.Response::from)
                .orElseThrow(() -> new ResourceNotFoundException("Projet", slug));
    }
}
