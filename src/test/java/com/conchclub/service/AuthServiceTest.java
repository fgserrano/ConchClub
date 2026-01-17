package com.conchclub.service;

import com.conchclub.model.User;
import com.conchclub.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private static final String INVITE_CODE = "secret-code";

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(authService, "requiredInviteCode", INVITE_CODE);
    }

    @Test
    void loadUserByUsername_ReturnsUserDetails_WhenUserExists() {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("encodedPassword");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        UserDetails userDetails = authService.loadUserByUsername("testuser");

        assertThat(userDetails.getUsername()).isEqualTo("testuser");
        assertThat(userDetails.getPassword()).isEqualTo("encodedPassword");
    }

    @Test
    void loadUserByUsername_ThrowsException_WhenUserDoesNotExist() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.loadUserByUsername("unknown"))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void register_CreatesUser_WhenValidRequest() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User registered = authService.register("newuser", "password", INVITE_CODE);

        assertThat(registered.getUsername()).isEqualTo("newuser");
        assertThat(registered.getPassword()).isEqualTo("encodedPassword");
    }

    @Test
    void register_ThrowsException_WhenInvalidInviteCode() {
        assertThatThrownBy(() -> authService.register("user", "pass", "wrong-code"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Invalid invite code");
    }

    @Test
    void register_ThrowsException_WhenUsernameExists() {
        when(userRepository.existsByUsername("existing")).thenReturn(true);

        assertThatThrownBy(() -> authService.register("existing", "pass", INVITE_CODE))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Username already exists");
    }
}
