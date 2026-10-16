package com.eddy.portfolio;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class AuthApiTest extends ApiTestSupport {

    @Test
    void login_identifiantsValides_retourneUnJeton() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", ADMIN_EMAIL, "password", ADMIN_PASSWORD))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").isNotEmpty())
                .andExpect(jsonPath("$.tokenType").value("Bearer"));
    }

    @Test
    void login_mauvaisMotDePasse_retourne401() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", ADMIN_EMAIL, "password", "mauvais-mot-de-passe"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.detail").value("Identifiants invalides"));
    }

    @Test
    void login_emailInconnu_retourneLeMemeMessageQueMauvaisMotDePasse() throws Exception {
        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("email", "inconnu@test.local", "password", "peu-importe-123"))))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.detail").value("Identifiants invalides"));
    }

    @Test
    void admin_sansJeton_retourne401() throws Exception {
        mockMvc.perform(get("/api/v1/admin/projects"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void admin_jetonInvalide_retourne401() throws Exception {
        mockMvc.perform(get("/api/v1/admin/projects").header("Authorization", "Bearer pas.un.jeton"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void admin_jetonValide_retourne200() throws Exception {
        mockMvc.perform(get("/api/v1/admin/projects").header("Authorization", bearer()))
                .andExpect(status().isOk());
    }
}
