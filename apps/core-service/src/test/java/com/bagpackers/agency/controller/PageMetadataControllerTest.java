package com.bagpackers.agency.controller;

import com.bagpackers.agency.model.PageMetadata;
import com.bagpackers.agency.repository.PageMetadataRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {PageMetadataController.class, GlobalExceptionHandler.class})
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
public class PageMetadataControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PageMetadataRepository pageMetadataRepository;

    @Test
    public void testGetMetadataByPathSuccess() throws Exception {
        PageMetadata meta = new PageMetadata();
        meta.setId(UUID.randomUUID());
        meta.setPath("/about");
        meta.setTitle("About Title");
        meta.setDescription("About Description");
        meta.setKeywords("Keywords");
        meta.setOgTitle("OG Title");
        meta.setOgDescription("OG Desc");
        meta.setOgImage("http://image.png");

        when(pageMetadataRepository.findByPath("/about")).thenReturn(Optional.of(meta));

        mockMvc.perform(get("/api/v1/metadata")
                .param("path", "/about")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.path").value("/about"))
                .andExpect(jsonPath("$.title").value("About Title"))
                .andExpect(jsonPath("$.description").value("About Description"));
    }

    @Test
    public void testGetMetadataByPathNotFound() throws Exception {
        when(pageMetadataRepository.findByPath("/unknown")).thenReturn(Optional.empty());

        mockMvc.perform(get("/api/v1/metadata")
                .param("path", "/unknown")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }

    @Test
    public void testSaveMetadataSuccess() throws Exception {
        PageMetadata meta = new PageMetadata();
        UUID id = UUID.randomUUID();
        meta.setId(id);
        meta.setPath("/about");
        meta.setTitle("About Title");
        meta.setDescription("About Description");
        meta.setKeywords("Keywords");

        when(pageMetadataRepository.save(any(PageMetadata.class))).thenReturn(meta);

        String jsonPayload = """
                {
                    "path": "/about",
                    "title": "About Title",
                    "description": "About Description",
                    "keywords": "Keywords"
                }
                """;

        mockMvc.perform(post("/api/v1/metadata")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(id.toString()))
                .andExpect(jsonPath("$.path").value("/about"))
                .andExpect(jsonPath("$.title").value("About Title"));
    }

    @Test
    public void testSaveMetadataMissingPath() throws Exception {
        String jsonPayload = """
                {
                    "title": "About Title",
                    "description": "About Description",
                    "keywords": "Keywords"
                }
                """;

        mockMvc.perform(post("/api/v1/metadata")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Path is required"));
    }

    @Test
    public void testDeleteMetadataSuccess() throws Exception {
        UUID id = UUID.randomUUID();
        when(pageMetadataRepository.existsById(id)).thenReturn(true);

        mockMvc.perform(delete("/api/v1/metadata/" + id)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNoContent());
    }

    @Test
    public void testDeleteMetadataNotFound() throws Exception {
        UUID id = UUID.randomUUID();
        when(pageMetadataRepository.existsById(id)).thenReturn(false);

        mockMvc.perform(delete("/api/v1/metadata/" + id)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
