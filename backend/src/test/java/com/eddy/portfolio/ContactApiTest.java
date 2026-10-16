package com.eddy.portfolio;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ContactApiTest extends ApiTestSupport {

    private Map<String, Object> message(String website) {
        return Map.of("name", "Awa", "email", "awa@example.com", "subject", "Bonjour",
                "body", "Un message suffisamment long pour etre valide.", "website", website);
    }

    @Test
    void envoyer_messageValide_retourne202EtApparaitDansLAdmin() throws Exception {
        mockMvc.perform(post("/api/v1/contact").contentType(MediaType.APPLICATION_JSON).content(json(message(""))))
                .andExpect(status().isAccepted());

        mockMvc.perform(get("/api/v1/admin/messages").header("Authorization", bearer()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items", hasSize(1)))
                .andExpect(jsonPath("$.items[0].read").value(false));
    }

    @Test
    void envoyer_potDeMielRempli_estIgnoreSansErreur() throws Exception {
        mockMvc.perform(post("/api/v1/contact").contentType(MediaType.APPLICATION_JSON)
                        .content(json(message("http://spam.example"))))
                .andExpect(status().isAccepted());

        mockMvc.perform(get("/api/v1/admin/messages").header("Authorization", bearer()))
                .andExpect(jsonPath("$.items", hasSize(0)));
    }

    @Test
    void envoyer_emailInvalide_retourne400() throws Exception {
        mockMvc.perform(post("/api/v1/contact").contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("name", "Awa", "email", "pas-un-email",
                                "body", "Un message suffisamment long."))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    void lireLesMessages_sansJeton_retourne401() throws Exception {
        mockMvc.perform(get("/api/v1/admin/messages")).andExpect(status().isUnauthorized());
    }
}
