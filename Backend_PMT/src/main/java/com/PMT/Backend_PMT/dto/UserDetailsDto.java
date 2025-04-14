package com.PMT.Backend_PMT.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDetailsDto {

    private Long id;
    private String username;
    private String email;

    private String createdAt;


    public UserDetailsDto(Long id, String username, String email, String password, String createdAt) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.createdAt = createdAt;
    }
}
