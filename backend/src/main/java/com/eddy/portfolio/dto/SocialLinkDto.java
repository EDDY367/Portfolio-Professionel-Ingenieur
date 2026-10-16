package com.eddy.portfolio.dto;

import com.eddy.portfolio.model.SocialLink;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class SocialLinkDto {

    private SocialLinkDto() {
    }

    public record Request(
            @NotBlank @Size(max = 60) String platform,
            @NotBlank @Size(max = 500) @Pattern(regexp = Patterns.HTTP_URL, message = "URL http(s) invalide") String url,
            @Pattern(regexp = Patterns.ICON_KEY, message = "Cle d'icone invalide") String iconKey,
            Boolean published,
            @Min(0) @Max(99999) Integer displayOrder) {

        public void applyTo(SocialLink l) {
            l.setPlatform(platform);
            l.setUrl(url);
            l.setIconKey(iconKey);
            l.setPublished(published == null || published);
            l.setDisplayOrder(displayOrder == null ? 0 : displayOrder);
        }
    }

    public record Response(Long id, String platform, String url, String iconKey, boolean published, int displayOrder)
            implements HasId {

        public static Response from(SocialLink l) {
            return new Response(l.getId(), l.getPlatform(), l.getUrl(), l.getIconKey(),
                    l.isPublished(), l.getDisplayOrder());
        }
    }
}
