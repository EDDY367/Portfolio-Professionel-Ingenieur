package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.CertificationDto;
import com.eddy.portfolio.dto.EducationDto;
import com.eddy.portfolio.dto.ExperienceDto;
import com.eddy.portfolio.dto.ProfileDto;
import com.eddy.portfolio.dto.ProjectDto;
import com.eddy.portfolio.dto.SkillDto;
import com.eddy.portfolio.dto.SocialLinkDto;
import com.eddy.portfolio.service.CertificationService;
import com.eddy.portfolio.service.EducationService;
import com.eddy.portfolio.service.ExperienceService;
import com.eddy.portfolio.service.ProfileService;
import com.eddy.portfolio.service.ProjectService;
import com.eddy.portfolio.service.SkillService;
import com.eddy.portfolio.service.SocialLinkService;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/** Lecture seule du contenu publie, consommee par le site public. */
@RestController
@RequestMapping("/api/v1")
@Tag(name = "Public - Contenu")
public class PublicController {

    private final ProfileService profileService;
    private final ProjectService projectService;
    private final SkillService skillService;
    private final ExperienceService experienceService;
    private final EducationService educationService;
    private final CertificationService certificationService;
    private final SocialLinkService socialLinkService;

    public PublicController(ProfileService profileService,
                            ProjectService projectService,
                            SkillService skillService,
                            ExperienceService experienceService,
                            EducationService educationService,
                            CertificationService certificationService,
                            SocialLinkService socialLinkService) {
        this.profileService = profileService;
        this.projectService = projectService;
        this.skillService = skillService;
        this.experienceService = experienceService;
        this.educationService = educationService;
        this.certificationService = certificationService;
        this.socialLinkService = socialLinkService;
    }

    @GetMapping("/profile")
    public ProfileDto.Response profile() {
        return profileService.get();
    }

    @GetMapping("/projects")
    public List<ProjectDto.Response> projects() {
        return projectService.listPublished();
    }

    @GetMapping("/projects/{slug}")
    public ProjectDto.Response project(@PathVariable String slug) {
        return projectService.getPublishedBySlug(slug);
    }

    @GetMapping("/skills")
    public List<SkillDto.Response> skills() {
        return skillService.listPublished();
    }

    @GetMapping("/experiences")
    public List<ExperienceDto.Response> experiences() {
        return experienceService.listPublished();
    }

    @GetMapping("/educations")
    public List<EducationDto.Response> educations() {
        return educationService.listPublished();
    }

    @GetMapping("/certifications")
    public List<CertificationDto.Response> certifications() {
        return certificationService.listPublished();
    }

    @GetMapping("/social-links")
    public List<SocialLinkDto.Response> socialLinks() {
        return socialLinkService.listPublished();
    }
}
