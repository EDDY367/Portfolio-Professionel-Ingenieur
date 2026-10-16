package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.ProfileDto;
import com.eddy.portfolio.service.ProfileService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/admin/profile")
@Tag(name = "Admin - Profil")
public class AdminProfileController {

    private final ProfileService profileService;

    public AdminProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping
    public ProfileDto.Response get() {
        return profileService.get();
    }

    @PutMapping
    public ProfileDto.Response save(@Valid @RequestBody ProfileDto.Request request) {
        return profileService.save(request);
    }
}
