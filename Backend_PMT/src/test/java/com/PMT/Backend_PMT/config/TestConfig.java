package com.PMT.Backend_PMT.config;

import com.PMT.Backend_PMT.IntegrationTest.AuthIntegrationTests;
import com.PMT.Backend_PMT.IntegrationTest.UserIntegrationTests;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class TestConfig {

    @Bean
    public AuthIntegrationTests authIntegrationTests() {
        return new AuthIntegrationTests();
    }

    @Bean
    public UserIntegrationTests userIntegrationTests() {
        return new UserIntegrationTests();
    }
}
