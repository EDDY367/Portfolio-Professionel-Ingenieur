package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.SocialLinkDto;
import com.eddy.portfolio.model.SocialLink;
import com.eddy.portfolio.service.SocialLinkService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/social-links")
@Tag(name = "Admin - Liens")
public class AdminSocialLinkController
        extends AbstractAdminController<SocialLink, SocialLinkDto.Request, SocialLinkDto.Response> {

    public AdminSocialLinkController(SocialLinkService service) {
        super(service);
    }
}
