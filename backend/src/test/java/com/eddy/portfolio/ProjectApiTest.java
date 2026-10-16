package com.eddy.portfolio;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProjectApiTest extends ApiTestSupport {

    private Map<String, Object> project(String slug, boolean published) {
        return Map.of("slug", slug, "title", "Projet " + slug, "summary", "Resume",
                "techStack", List.of("Angular", "Spring Boot"), "published", published, "displayOrder", 1);
    }

    @Test
    void creer_donneesValides_retourne201AvecLocation() throws Exception {
        mockMvc.perform(post("/api/v1/admin/projects")
                        .header("Authorization", bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(project("mon-projet", true))))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.slug").value("mon-projet"))
                .andExpect(jsonPath("$.techStack", hasSize(2)));
    }

    @Test
    void creer_slugInvalide_retourne400AvecDetailParChamp() throws Exception {
        mockMvc.perform(post("/api/v1/admin/projects")
                        .header("Authorization", bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("slug", "Slug Invalide!", "title", "Titre"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.slug").exists());
    }

    @Test
    void creer_urlDangereuse_retourne400() throws Exception {
        mockMvc.perform(post("/api/v1/admin/projects")
                        .header("Authorization", bearer())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json(Map.of("slug", "xss", "title", "Titre", "demoUrl", "javascript:alert(1)"))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.demoUrl").exists());
    }

    @Test
    void creer_slugExistant_retourne409() throws Exception {
        String auth = bearer();
        mockMvc.perform(post("/api/v1/admin/projects").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(json(project("doublon", true))))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/v1/admin/projects").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(json(project("doublon", true))))
                .andExpect(status().isConflict());
    }

    @Test
    void publicList_neMontreQueLesProjetsPublies() throws Exception {
        String auth = bearer();
        mockMvc.perform(post("/api/v1/admin/projects").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(json(project("visible", true))))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/v1/admin/projects").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(json(project("cache", false))))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/v1/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.slug=='visible')]", hasSize(1)))
                .andExpect(jsonPath("$[?(@.slug=='cache')]", hasSize(0)));

        mockMvc.perform(get("/api/v1/projects/cache")).andExpect(status().isNotFound());
    }

    @Test
    void modifierPuisSupprimer_fonctionneEtRetourne404ApresSuppression() throws Exception {
        String auth = bearer();
        String created = mockMvc.perform(post("/api/v1/admin/projects").header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(json(project("cycle", true))))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();
        long id = objectMapper.readTree(created).get("id").asLong();

        mockMvc.perform(put("/api/v1/admin/projects/" + id).header("Authorization", auth)
                        .contentType(MediaType.APPLICATION_JSON).content(json(project("cycle", false))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.published").value(false));

        mockMvc.perform(delete("/api/v1/admin/projects/" + id).header("Authorization", auth))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/v1/admin/projects/" + id).header("Authorization", auth))
                .andExpect(status().isNotFound());
    }

    @Test
    void ecriture_sansJeton_retourne401() throws Exception {
        mockMvc.perform(post("/api/v1/admin/projects")
                        .contentType(MediaType.APPLICATION_JSON).content(json(project("pirate", true))))
                .andExpect(status().isUnauthorized());
    }
}
