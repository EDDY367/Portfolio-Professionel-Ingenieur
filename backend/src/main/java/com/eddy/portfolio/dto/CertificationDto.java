package com.eddy.portfolio.dto;

import com.eddy.portfolio.model.Certification;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public final class CertificationDto {

    private CertificationDto() {
    }

    public record Request(
            @NotBlank @Size(max = 200) String title,
            @NotBlank @Size(max = 200) String issuer,
            LocalDate issuedOn,
            @Size(max = 500) @Pattern(regexp = Patterns.HTTP_URL, message = "URL http(s) invalide") String credentialUrl,
            Boolean published,
            @Min(0) @Max(99999) Integer displayOrder) {

        public void applyTo(Certification c) {
            c.setTitle(title);
            c.setIssuer(issuer);
            c.setIssuedOn(issuedOn);
            c.setCredentialUrl(credentialUrl);
            c.setPublished(published == null || published);
            c.setDisplayOrder(displayOrder == null ? 0 : displayOrder);
        }
    }

    public record Response(Long id, String title, String issuer, LocalDate issuedOn, String credentialUrl,
                           boolean published, int displayOrder) implements HasId {

        public static Response from(Certification c) {
            return new Response(c.getId(), c.getTitle(), c.getIssuer(), c.getIssuedOn(), c.getCredentialUrl(),
                    c.isPublished(), c.getDisplayOrder());
        }
    }
}
