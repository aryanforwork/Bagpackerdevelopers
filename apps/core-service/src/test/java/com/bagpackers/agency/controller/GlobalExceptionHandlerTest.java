package com.bagpackers.agency.controller;

import com.bagpackers.agency.exception.RateLimitExceededException;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.dao.QueryTimeoutException;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {GlobalExceptionHandlerTest.TestController.class, GlobalExceptionHandler.class})
@AutoConfigureMockMvc(addFilters = false)
@Import(GlobalExceptionHandlerTest.TestConfig.class)
public class GlobalExceptionHandlerTest {

    @org.springframework.boot.test.context.TestConfiguration
    static class TestConfig {
        @Bean
        public TestController testController() {
            return new TestController();
        }
    }

    @Autowired
    private MockMvc mockMvc;

    @RestController
    static class TestController {
        @GetMapping("/test/rate-limit")
        public void rateLimit() {
            throw new RateLimitExceededException("Rate limit exceeded!");
        }

        @GetMapping("/test/db")
        public void dbException() {
            throw new QueryTimeoutException("Database connection timeout");
        }

        @GetMapping("/test/generic")
        public void genericException() {
            throw new RuntimeException("Generic system failure");
        }
    }

    @Test
    public void testHandleRateLimitExceeded() throws Exception {
        mockMvc.perform(get("/test/rate-limit")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isTooManyRequests())
                .andExpect(jsonPath("$.status").value(429))
                .andExpect(jsonPath("$.error").value("Too Many Requests"))
                .andExpect(jsonPath("$.message").value("Rate limit exceeded!"))
                .andExpect(jsonPath("$.path").value("/test/rate-limit"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    public void testHandleDatabaseException() throws Exception {
        mockMvc.perform(get("/test/db")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.status").value(503))
                .andExpect(jsonPath("$.error").value("Database Error"))
                .andExpect(jsonPath("$.message").value("A database error occurred. Please try again later."))
                .andExpect(jsonPath("$.path").value("/test/db"))
                .andExpect(jsonPath("$.timestamp").exists());
    }

    @Test
    public void testHandleGenericException() throws Exception {
        mockMvc.perform(get("/test/generic")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.error").value("Internal Server Error"))
                .andExpect(jsonPath("$.message").value("An unexpected error occurred. Please contact support or try again later."))
                .andExpect(jsonPath("$.path").value("/test/generic"))
                .andExpect(jsonPath("$.timestamp").exists());
    }
}
