package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.SkillDto;
import com.eddy.portfolio.model.Skill;
import com.eddy.portfolio.service.SkillService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/skills")
@Tag(name = "Admin - Competences")
public class AdminSkillController extends AbstractAdminController<Skill, SkillDto.Request, SkillDto.Response> {

    public AdminSkillController(SkillService service) {
        super(service);
    }
}
