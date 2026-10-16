package com.eddy.portfolio.dto;

import com.eddy.portfolio.model.Profile;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public final class ProfileDto {

    private ProfileDto() {
    }

    public record Request(
            @NotBlank @Size(max = 120) String fullName,
            @NotBlank @Size(max = 200) String headline,
            @Size(max = 4000) String bio,
            @Email @Size(max = 200) String email,
            @Size(max = 40) String phone,
            @Size(max = 120) String location,
            @Size(max = 500) @Pattern(regexp = Patterns.HTTP_URL, message = "URL http(s) invalide") String photoUrl,
            @Size(max = 500) @Pattern(regexp = Patterns.HTTP_URL, message = "URL http(s) invalide") String cvUrl) {

        public void applyTo(Profile p) {
            p.setFullName(fullName);
            p.setHeadline(headline);
            p.setBio(bio);
            p.setEmail(email);
            p.setPhone(phone);
            p.setLocation(location);
            p.setPhotoUrl(photoUrl);
            p.setCvUrl(cvUrl);
        }
    }

    public record Response(Long id, String fullName, String headline, String bio, String email, String phone,
                           String location, String photoUrl, String cvUrl) implements HasId {

        public static Response from(Profile p) {
            return new Response(p.getId(), p.getFullName(), p.getHeadline(), p.getBio(), p.getEmail(),
                    p.getPhone(), p.getLocation(), p.getPhotoUrl(), p.getCvUrl());
        }
    }
}
