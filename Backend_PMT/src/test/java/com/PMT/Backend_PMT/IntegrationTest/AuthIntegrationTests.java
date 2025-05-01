package com.PMT.Backend_PMT.IntegrationTest;

import com.PMT.Backend_PMT.dto.UserDto;
import com.PMT.Backend_PMT.repository.UserRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:applicationTest.properties")
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class AuthIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    private final UserDto newUser = UserDto.builder()
            .username("testuser")
            .email("testuser@pmt.com")
            .password("Testpass123!")
            .build();

    @BeforeEach
    void deleteUserIfExists() {
        userRepository.deleteAll();
    }

    @Test
    @Order(1)
    @DisplayName("Création nouvel utilisateur - Succès")
    void signupNewUser_Success() throws Exception {
        UserDto uniqueUser = UserDto.builder()
                .username("uniqueuser")
                .email("uniqueuser@pmt.com")
                .password("UniquePass123!")
                .build();

        String requestBody = objectMapper.writeValueAsString(uniqueUser);

        MvcResult result = mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isCreated())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.email").value(uniqueUser.getEmail()))
                .andExpect(jsonPath("$.username").value(uniqueUser.getUsername()))
                .andReturn();

        String response = result.getResponse().getContentAsString();
        Assertions.assertNotNull(response, "La réponse ne devrait pas être null");
    }
}