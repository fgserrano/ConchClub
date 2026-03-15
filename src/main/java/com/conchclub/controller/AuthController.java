package com.conchclub.controller;

import com.conchclub.config.JwtUtils;

import com.conchclub.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request.username(), request.password(), request.inviteCode());
            return ResponseEntity.ok("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        return authService.getUserByUsername(request.username()).map(
            user -> {
                    if (!passwordEncoder.matches(request.password(), user.getPassword())) {
                        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
                    }

                    UserDetails userDetails = authService.loadUserByUsername(request.username());
                    String token = jwtUtils.generateToken(userDetails);

                    Map<String, String> responseMap = new HashMap<>();
                    responseMap.put("token", token);
                    responseMap.put("username", user.getUsername());
                    responseMap.put("role", user.getRole().name());

                    return ResponseEntity.ok(responseMap);
            }
        ).orElse(
            ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials")
        );
    }

    public record RegisterRequest(String username, String password, String inviteCode) {
    }

    public record LoginRequest(String username, String password) {
    }
}
