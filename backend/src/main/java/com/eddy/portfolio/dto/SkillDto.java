package com.eddy.portfolio.dto;

import com.eddy.portfolio.model.Skill;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class SkillDto {

    private SkillDto() {
    }

    public record Request(
            @NotBlank @Size(max = 100) String name,
            @NotBlank @Size(max = 60) String category,
            @Min(0) @Max(100) Integer levelPct,
            Boolean published,
            @Min(0) @Max(99999) Integer displayOrder) {

        public void applyTo(Skill skill) {
            skill.setName(name);
            skill.setCategory(category);
            skill.setLevelPct(levelPct == null ? 70 : levelPct);
            skill.setPublished(published == null || published);
            skill.setDisplayOrder(displayOrder == null ? 0 : displayOrder);
        }
    }

    public record Response(Long id, String name, String category, int levelPct, boolean published, int displayOrder)
            implements HasId {

        public static Response from(Skill s) {
            return new Response(s.getId(), s.getName(), s.getCategory(), s.getLevelPct(),
                    s.isPublished(), s.getDisplayOrder());
        }
    }
}
