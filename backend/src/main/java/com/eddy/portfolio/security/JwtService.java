package com.eddy.portfolio.security;

import com.eddy.portfolio.dto.AuthDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class JwtService {

    private final JwtEncoder jwtEncoder;
    private final Duration expiration;

    public JwtService(JwtEncoder jwtEncoder,
                      @Value("${application.security.jwt-expiration-minutes}") long expirationMinutes) {
        this.jwtEncoder = jwtEncoder;
        this.expiration = Duration.ofMinutes(expirationMinutes);
    }

    /** Le jeton ne contient que l'identifiant (email), les roles et l'expiration. */
    public AuthDto.TokenResponse generate(Authentication authentication) {
        Instant now = Instant.now();
        List<String> roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(authority -> authority.replace("ROLE_", ""))
                .toList();

        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer("portfolio-api")
                .issuedAt(now)
                .expiresAt(now.plus(expiration))
                .subject(authentication.getName())
                .claim("roles", roles)
                .build();

        JwsHeader header = JwsHeader.with(MacAlgorithm.HS256).build();
        String token = jwtEncoder.encode(JwtEncoderParameters.from(header, claims)).getTokenValue();
        return new AuthDto.TokenResponse(token, "Bearer", expiration.toSeconds());
    }
}
