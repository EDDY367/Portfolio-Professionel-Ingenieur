package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.ExperienceDto;
import com.eddy.portfolio.model.Experience;
import com.eddy.portfolio.service.ExperienceService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/experiences")
@Tag(name = "Admin - Experiences")
public class AdminExperienceController
        extends AbstractAdminController<Experience, ExperienceDto.Request, ExperienceDto.Response> {

    public AdminExperienceController(ExperienceService service) {
        super(service);
    }
}
