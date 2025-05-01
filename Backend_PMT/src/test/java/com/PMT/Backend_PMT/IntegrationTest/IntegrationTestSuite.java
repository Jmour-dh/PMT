package com.PMT.Backend_PMT.IntegrationTest;

import com.PMT.Backend_PMT.dto.AuthDto;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.repository.UserRepository;
import com.PMT.Backend_PMT.util.TokenHolder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
@TestPropertySource(locations = "classpath:applicationTest.properties")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class IntegrationTestSuite {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private TokenHolder tokenHolder;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthIntegrationTests authIntegrationTests;

    @Autowired
    private UserIntegrationTests userIntegrationTests;

    @BeforeAll
    void initializeDatabase() throws Exception {
        userRepository.deleteAll();

        userRepository.save(User.builder()
                .username("testuser")
                .email("testuser@pmt.com")
                .passwordHash(passwordEncoder.encode("Testpass123!"))
                .build());

        AuthDto loginRequest = new AuthDto("testuser@pmt.com", "Testpass123!");
        String requestBody = objectMapper.writeValueAsString(loginRequest);

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andReturn();

        String token = result.getResponse().getContentAsString();
        tokenHolder.setToken(token);
    }

    @Test
    @Order(1)
    void runAuthIntegrationTests() throws Exception {
        authIntegrationTests.signupNewUser_Success();
//        authIntegrationTests.loginUser_Success();
    }

    @Test
    @Order(2)
    void runUserIntegrationTests() throws Exception {
        userIntegrationTests.createUser_Success();
    }
}