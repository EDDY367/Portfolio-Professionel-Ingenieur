package com.eddy.portfolio.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDto {

    private AuthDto() {
    }

    public record LoginRequest(@NotBlank @Email @Size(max = 200) String email,
                               @NotBlank @Size(max = 72) String password) {
    }

    public record TokenResponse(String accessToken, String tokenType, long expiresInSeconds) {
    }
}
