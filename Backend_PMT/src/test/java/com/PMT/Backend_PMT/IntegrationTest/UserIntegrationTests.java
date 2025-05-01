package com.PMT.Backend_PMT.IntegrationTest;

import com.PMT.Backend_PMT.dto.UserDto;
import com.PMT.Backend_PMT.util.TokenHolder;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:applicationTest.properties")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class UserIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private com.PMT.Backend_PMT.util.TokenHolder tokenHolder;

    @Test
    @Order(1)
    @DisplayName("Create user - Success")
    void createUser_Success() throws Exception {
        String token = tokenHolder.getToken();
        Assertions.assertNotNull(token, "Le token d'authentification ne doit pas être null");
        Assertions.assertFalse(token.isBlank(), "Le token d'authentification ne doit pas être vide");

        UserDto newUser = UserDto.builder()
                .username("newuser")
                .email("newuser@pmt.com")
                .password("Newpass123!")
                .build();

        String requestBody = objectMapper.writeValueAsString(newUser);

        mockMvc.perform(post("/api/users/")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header("Authorization", "Bearer " + token)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.username").value(newUser.getUsername()))
                .andExpect(jsonPath("$.email").value(newUser.getEmail()));
    }


}