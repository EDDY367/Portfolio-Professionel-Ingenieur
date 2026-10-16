package com.eddy.portfolio.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;
import java.util.Map;

/** 403 au format JSON quand le role est insuffisant. */
public class RestAccessDeniedHandler implements AccessDeniedHandler {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
                       AccessDeniedException exception) throws IOException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType(MediaType.APPLICATION_PROBLEM_JSON_VALUE);
        MAPPER.writeValue(response.getOutputStream(), Map.of(
                "status", 403,
                "title", "Acces refuse",
                "detail", "Vous n'avez pas les droits necessaires"));
    }
}
