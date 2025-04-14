package com.PMT.Backend_PMT.service;

import com.PMT.Backend_PMT.dto.UserDetailsDto;
import com.PMT.Backend_PMT.dto.UserDto;
import com.PMT.Backend_PMT.entity.User;
import com.PMT.Backend_PMT.exception.ResourceNotFoundException;
import com.PMT.Backend_PMT.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //Create
    @Transactional
    public User createUser(UserDto userDto) {
        if (userDto.getPassword() == null || userDto.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be null or blank");
        }

        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }
        if (userRepository.existsByUsername(userDto.getUsername())) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User();
        user.setUsername(userDto.getUsername());
        user.setEmail(userDto.getEmail());
        user.setPasswordHash(passwordEncoder.encode(userDto.getPassword()));
        return userRepository.save(user);
    }

    //Read
    public List<UserDetailsDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> {
                    if (user.getCreatedProjects() != null) {
                        user.getCreatedProjects().size();
                    }
                    return new UserDetailsDto(user);
                })
                .collect(Collectors.toList());
    }

    public UserDetailsDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getCreatedProjects() != null) {
            user.getCreatedProjects().size();
        }

        return new UserDetailsDto(user);
    }

    //Update
    @Transactional
    public User updateUser(Long id, UserDto userDto) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (userDto.getUsername() != null && !userDto.getUsername().isBlank()) {
            if (userRepository.existsByUsername(userDto.getUsername()) && !existingUser.getUsername().equals(userDto.getUsername())) {
                throw new IllegalArgumentException("Username already exists");
            }
            existingUser.setUsername(userDto.getUsername());
        }

        if (userDto.getEmail() != null && !userDto.getEmail().isBlank()) {
            if (userRepository.existsByEmail(userDto.getEmail()) && !existingUser.getEmail().equals(userDto.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }
            existingUser.setEmail(userDto.getEmail());
        }

        if (userDto.getPassword() != null && !userDto.getPassword().isBlank()) {
            existingUser.setPasswordHash(passwordEncoder.encode(userDto.getPassword()));
        }

        return userRepository.save(existingUser);
    }

    //Delete
    @Transactional
    public void deleteUser(Long id){
        if (!userRepository.existsById(id)){
            throw new ResourceNotFoundException("User not found with id:" + id);
        }
        userRepository.deleteById(id);
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
    }
}
