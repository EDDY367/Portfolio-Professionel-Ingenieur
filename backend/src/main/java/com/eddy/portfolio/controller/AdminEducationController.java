package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.EducationDto;
import com.eddy.portfolio.model.Education;
import com.eddy.portfolio.service.EducationService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/educations")
@Tag(name = "Admin - Formations")
public class AdminEducationController
        extends AbstractAdminController<Education, EducationDto.Request, EducationDto.Response> {

    public AdminEducationController(EducationService service) {
        super(service);
    }
}
