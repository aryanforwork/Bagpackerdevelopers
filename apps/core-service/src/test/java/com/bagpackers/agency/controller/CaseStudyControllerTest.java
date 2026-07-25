package com.bagpackers.agency.controller;

import com.bagpackers.agency.model.CaseStudy;
import com.bagpackers.agency.repository.CaseStudyRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CaseStudyController.class)
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
public class CaseStudyControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CaseStudyRepository caseStudyRepository;

    @Test
    public void testGetAllCaseStudiesFromDatabase() throws Exception {
        CaseStudy cs = new CaseStudy();
        cs.setId(UUID.randomUUID());
        cs.setTitle("Database Case Study");
        cs.setSlug("db-case-study");
        cs.setTechStack(List.of("Java", "PostgreSQL"));
        cs.setContent("Db Content");
        cs.setCreatedAt(OffsetDateTime.now());

        when(caseStudyRepository.findAll()).thenReturn(List.of(cs));

        mockMvc.perform(get("/api/v1/cases")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Database Case Study"))
                .andExpect(jsonPath("$[0].slug").value("db-case-study"));
    }

    @Test
    public void testGetAllCaseStudiesFallbackOnEmpty() throws Exception {
        when(caseStudyRepository.findAll()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/v1/cases")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Enterprise AI Document Ingestion & IDP Pipeline"))
                .andExpect(jsonPath("$[1].title").value("High-Performance Next.js Client Portal & CMS Migration"));
    }

    @Test
    public void testGetAllCaseStudiesFallbackOnException() throws Exception {
        when(caseStudyRepository.findAll()).thenThrow(new RuntimeException("Database down"));

        mockMvc.perform(get("/api/v1/cases")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Enterprise AI Document Ingestion & IDP Pipeline"))
                .andExpect(jsonPath("$[1].title").value("High-Performance Next.js Client Portal & CMS Migration"));
    }

    @Test
    public void testGetCaseStudyBySlugFromDatabase() throws Exception {
        CaseStudy cs = new CaseStudy();
        cs.setId(UUID.randomUUID());
        cs.setTitle("Database Case Study");
        cs.setSlug("db-case-study");

        when(caseStudyRepository.findBySlug("db-case-study")).thenReturn(Optional.of(cs));

        mockMvc.perform(get("/api/v1/cases/db-case-study")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Database Case Study"))
                .andExpect(jsonPath("$.slug").value("db-case-study"));
    }

    @Test
    public void testGetCaseStudyBySlugFallbackOnExceptionOrNotFound() throws Exception {
        when(caseStudyRepository.findBySlug(anyString())).thenThrow(new RuntimeException("Database down"));

        // Should fallback to mock and find the existing slug
        mockMvc.perform(get("/api/v1/cases/enterprise-ai-document-ingestion-pipeline")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Enterprise AI Document Ingestion & IDP Pipeline"));

        // Should return 404 if not found in mock list either
        mockMvc.perform(get("/api/v1/cases/non-existent-slug")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());
    }
}
