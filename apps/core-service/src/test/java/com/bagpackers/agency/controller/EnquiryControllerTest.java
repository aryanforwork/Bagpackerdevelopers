package com.bagpackers.agency.controller;

import com.bagpackers.agency.model.Enquiry;
import com.bagpackers.agency.repository.EnquiryRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {EnquiryController.class, GlobalExceptionHandler.class})
@org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc(addFilters = false)
public class EnquiryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private EnquiryRepository enquiryRepository;

    @Test
    public void testSubmitEnquirySuccess() throws Exception {
        UUID expectedId = UUID.randomUUID();
        Enquiry saved = new Enquiry();
        saved.setId(expectedId);
        saved.setName("John Doe");
        saved.setEmail("john.doe@example.com");
        saved.setBrief("I need an enterprise AI document parsing system.");
        saved.setCompany("Acme Corp");
        saved.setCreatedAt(OffsetDateTime.now());
        saved.setUpdatedAt(OffsetDateTime.now());

        when(enquiryRepository.save(any(Enquiry.class))).thenReturn(saved);

        String jsonPayload = """
                {
                    "name": "John Doe",
                    "email": "john.doe@example.com",
                    "brief": "I need an enterprise AI document parsing system.",
                    "company": "Acme Corp"
                }
                """;

        mockMvc.perform(post("/api/v1/enquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(expectedId.toString()))
                .andExpect(jsonPath("$.name").value("John Doe"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"))
                .andExpect(jsonPath("$.brief").value("I need an enterprise AI document parsing system."))
                .andExpect(jsonPath("$.company").value("Acme Corp"));
    }

    @Test
    public void testSubmitEnquiryMissingName() throws Exception {
        String jsonPayload = """
                {
                    "email": "john.doe@example.com",
                    "brief": "I need an enterprise AI document parsing system.",
                    "company": "Acme Corp"
                }
                """;

        mockMvc.perform(post("/api/v1/enquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Bad Request"))
                .andExpect(jsonPath("$.message").value("Name is required"));
    }

    @Test
    public void testSubmitEnquiryBlankName() throws Exception {
        String jsonPayload = """
                {
                    "name": "   ",
                    "email": "john.doe@example.com",
                    "brief": "I need an enterprise AI document parsing system."
                }
                """;

        mockMvc.perform(post("/api/v1/enquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Name is required"));
    }

    @Test
    public void testSubmitEnquiryMissingEmail() throws Exception {
        String jsonPayload = """
                {
                    "name": "John Doe",
                    "brief": "I need an enterprise AI document parsing system."
                }
                """;

        mockMvc.perform(post("/api/v1/enquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Email is required"));
    }

    @Test
    public void testSubmitEnquiryInvalidEmail() throws Exception {
        String jsonPayload = """
                {
                    "name": "John Doe",
                    "email": "invalid-email-format",
                    "brief": "I need an enterprise AI document parsing system."
                }
                """;

        mockMvc.perform(post("/api/v1/enquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid email format"));
    }

    @Test
    public void testSubmitEnquiryMissingBrief() throws Exception {
        String jsonPayload = """
                {
                    "name": "John Doe",
                    "email": "john.doe@example.com"
                }
                """;

        mockMvc.perform(post("/api/v1/enquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(jsonPayload))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Brief is required"));
    }

    @Test
    public void testGetEnquiriesSuccess() throws Exception {
        UUID id1 = UUID.randomUUID();
        Enquiry e1 = new Enquiry();
        e1.setId(id1);
        e1.setName("Alice");
        e1.setEmail("alice@example.com");
        e1.setBrief("Brief 1");

        UUID id2 = UUID.randomUUID();
        Enquiry e2 = new Enquiry();
        e2.setId(id2);
        e2.setName("Bob");
        e2.setEmail("bob@example.com");
        e2.setBrief("Brief 2");

        when(enquiryRepository.findAll()).thenReturn(List.of(e1, e2));

        mockMvc.perform(get("/api/v1/enquiries")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(id1.toString()))
                .andExpect(jsonPath("$[0].name").value("Alice"))
                .andExpect(jsonPath("$[1].id").value(id2.toString()))
                .andExpect(jsonPath("$[1].name").value("Bob"));
    }
}
