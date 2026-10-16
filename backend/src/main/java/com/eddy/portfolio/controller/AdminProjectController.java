package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.ProjectDto;
import com.eddy.portfolio.model.Project;
import com.eddy.portfolio.service.ProjectService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/projects")
@Tag(name = "Admin - Projets")
public class AdminProjectController
        extends AbstractAdminController<Project, ProjectDto.Request, ProjectDto.Response> {

    public AdminProjectController(ProjectService service) {
        super(service);
    }
}
