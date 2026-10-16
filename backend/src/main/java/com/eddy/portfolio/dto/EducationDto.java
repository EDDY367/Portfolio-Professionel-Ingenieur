package com.eddy.portfolio.dto;

import com.eddy.portfolio.model.Education;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class EducationDto {

    private EducationDto() {
    }

    public record Request(
            @NotBlank @Size(max = 200) String degree,
            @NotBlank @Size(max = 200) String school,
            @NotNull @Min(1950) @Max(2100) Integer startYear,
            @Min(1950) @Max(2100) Integer endYear,
            @Size(max = 2000) String description,
            Boolean published,
            @Min(0) @Max(99999) Integer displayOrder) {

        public void applyTo(Education e) {
            e.setDegree(degree);
            e.setSchool(school);
            e.setStartYear(startYear);
            e.setEndYear(endYear);
            e.setDescription(description);
            e.setPublished(published == null || published);
            e.setDisplayOrder(displayOrder == null ? 0 : displayOrder);
        }
    }

    public record Response(Long id, String degree, String school, int startYear, Integer endYear,
                           String description, boolean published, int displayOrder) implements HasId {

        public static Response from(Education e) {
            return new Response(e.getId(), e.getDegree(), e.getSchool(), e.getStartYear(), e.getEndYear(),
                    e.getDescription(), e.isPublished(), e.getDisplayOrder());
        }
    }
}
