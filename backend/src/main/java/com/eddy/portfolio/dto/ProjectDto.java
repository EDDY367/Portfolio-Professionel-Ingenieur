package com.eddy.portfolio.dto;

import com.eddy.portfolio.model.Project;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.List;

public final class ProjectDto {

    private ProjectDto() {
    }

    public record Request(
            @NotBlank @Size(max = 120)
            @Pattern(regexp = Patterns.SLUG, message = "Slug invalide (minuscules, chiffres et tirets)")
            String slug,
            @NotBlank @Size(max = 200) String title,
            @Size(max = 500) String summary,
            @Size(max = 10000) String description,
            @Size(max = 20) List<@NotBlank @Size(max = 40) String> techStack,
            @Size(max = 500) @Pattern(regexp = Patterns.HTTP_URL, message = "URL http(s) invalide") String githubUrl,
            @Size(max = 500) @Pattern(regexp = Patterns.HTTP_URL, message = "URL http(s) invalide") String demoUrl,
            @Size(max = 500) @Pattern(regexp = Patterns.HTTP_URL, message = "URL http(s) invalide") String coverImageUrl,
            Boolean featured,
            Boolean published,
            @Min(0) @Max(99999) Integer displayOrder) {

        public void applyTo(Project project) {
            project.setSlug(slug);
            project.setTitle(title);
            project.setSummary(summary);
            project.setDescription(description);
            project.setTechStack(Patterns.joinCsv(techStack));
            project.setGithubUrl(githubUrl);
            project.setDemoUrl(demoUrl);
            project.setCoverImageUrl(coverImageUrl);
            project.setFeatured(featured != null && featured);
            project.setPublished(published == null || published);
            project.setDisplayOrder(displayOrder == null ? 0 : displayOrder);
        }
    }

    public record Response(
            Long id,
            String slug,
            String title,
            String summary,
            String description,
            List<String> techStack,
            String githubUrl,
            String demoUrl,
            String coverImageUrl,
            boolean featured,
            boolean published,
            int displayOrder) implements HasId {

        public static Response from(Project p) {
            return new Response(p.getId(), p.getSlug(), p.getTitle(), p.getSummary(), p.getDescription(),
                    Patterns.splitCsv(p.getTechStack()), p.getGithubUrl(), p.getDemoUrl(), p.getCoverImageUrl(),
                    p.isFeatured(), p.isPublished(), p.getDisplayOrder());
        }
    }
}
