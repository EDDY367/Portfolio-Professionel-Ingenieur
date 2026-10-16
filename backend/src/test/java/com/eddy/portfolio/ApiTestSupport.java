package com.eddy.portfolio;

import com.eddy.portfolio.model.AdminUser;
import com.eddy.portfolio.repository.AdminUserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/** Base des tests d'API : contexte complet, base H2, chaque test est annule en fin d'execution. */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
public abstract class ApiTestSupport {

    protected static final String ADMIN_EMAIL = "admin@test.local";
    protected static final String ADMIN_PASSWORD = "test-password-123456";

    @Autowired
    protected MockMvc mockMvc;

    @Autowired
    protected ObjectMapper objectMapper;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /** L'admin de test est cree ici (annule en fin de test) : l'application, elle, ne cree aucun compte. */
    @BeforeEach
    void creerAdminDeTest() {
        if (adminUserRepository.count() == 0) {
            AdminUser admin = new AdminUser();
            admin.setEmail(ADMIN_EMAIL);
            admin.setPasswordHash(passwordEncoder.encode(ADMIN_PASSWORD));
            adminUserRepository.save(admin);
        }
    }

    protected String json(Object value) throws Exception {
        return objectMapper.writeValueAsString(value);
    }

    /** Connexion reelle via l'API, puis en-tete Authorization pret a l'emploi. */
    protected String bearer() throws Exception {
        String body = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(java.util.Map.of("email", ADMIN_EMAIL, "password", ADMIN_PASSWORD))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        return "Bearer " + objectMapper.readTree(body).get("accessToken").asText();
    }
}
