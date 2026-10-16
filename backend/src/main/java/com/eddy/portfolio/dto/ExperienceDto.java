package com.eddy.portfolio.dto;

import com.eddy.portfolio.model.Experience;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public final class ExperienceDto {

    private ExperienceDto() {
    }

    public record Request(
            @NotBlank @Size(max = 200) String roleTitle,
            @NotBlank @Size(max = 200) String company,
            @Size(max = 120) String location,
            @NotNull LocalDate startDate,
            LocalDate endDate,
            @Size(max = 5000) String description,
            Boolean published,
            @Min(0) @Max(99999) Integer displayOrder) {

        public void applyTo(Experience e) {
            e.setRoleTitle(roleTitle);
            e.setCompany(company);
            e.setLocation(location);
            e.setStartDate(startDate);
            e.setEndDate(endDate);
            e.setDescription(description);
            e.setPublished(published == null || published);
            e.setDisplayOrder(displayOrder == null ? 0 : displayOrder);
        }
    }

    public record Response(Long id, String roleTitle, String company, String location, LocalDate startDate,
                           LocalDate endDate, String description, boolean published, int displayOrder)
            implements HasId {

        public static Response from(Experience e) {
            return new Response(e.getId(), e.getRoleTitle(), e.getCompany(), e.getLocation(), e.getStartDate(),
                    e.getEndDate(), e.getDescription(), e.isPublished(), e.getDisplayOrder());
        }
    }
}
