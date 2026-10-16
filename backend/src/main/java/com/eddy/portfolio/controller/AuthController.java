package com.eddy.portfolio.controller;

import com.eddy.portfolio.dto.AuthDto;
import com.eddy.portfolio.security.AttemptLimiter;
import com.eddy.portfolio.security.JwtService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentification")
public class AuthController {

    private static final int MAX_ATTEMPTS = 10;
    private static final Duration WINDOW = Duration.ofMinutes(15);

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final AttemptLimiter attemptLimiter;

    public AuthController(AuthenticationManager authenticationManager,
                          JwtService jwtService,
                          AttemptLimiter attemptLimiter) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.attemptLimiter = attemptLimiter;
    }

    @PostMapping("/login")
    public AuthDto.TokenResponse login(@Valid @RequestBody AuthDto.LoginRequest request,
                                       HttpServletRequest http) {
        attemptLimiter.check("login:" + http.getRemoteAddr(), MAX_ATTEMPTS, WINDOW);
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        return jwtService.generate(authentication);
    }
}
