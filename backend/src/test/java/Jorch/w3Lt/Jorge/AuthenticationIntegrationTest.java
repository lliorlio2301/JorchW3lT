package Jorch.w3Lt.Jorge;

import Jorch.w3Lt.Jorge.dto.auth.AuthenticationRequest;
import Jorch.w3Lt.Jorge.dto.auth.AuthenticationResponse;
import Jorch.w3Lt.Jorge.exception.InvalidRefreshTokenException;
import Jorch.w3Lt.Jorge.model.Role;
import Jorch.w3Lt.Jorge.model.User;
import Jorch.w3Lt.Jorge.repository.UserRepository;
import Jorch.w3Lt.Jorge.service.AuthenticationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class AuthenticationIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        User user = User.builder()
                .username("testuser")
                .password(passwordEncoder.encode("password"))
                .role(Role.ADMIN)
                .build();
        userRepository.save(user);
    }

    @Test
    void shouldAuthenticateAndGenerateRefreshToken() {
        AuthenticationRequest request = AuthenticationRequest.builder()
                .username("testuser")
                .password("password")
                .rememberMe(true)
                .build();

        AuthenticationResponse response = authenticationService.authenticate(request);

        assertThat(response.getToken()).isNotNull();
        assertThat(response.getRefreshToken()).isNotNull();

        User user = userRepository.findByUsername("testuser").orElseThrow();
        assertThat(user.getRefreshToken()).isNotEqualTo(response.getRefreshToken());
        assertThat(passwordEncoder.matches(response.getRefreshToken(), user.getRefreshToken())).isTrue();
        assertThat(user.getRefreshTokenExpiration()).isAfter(java.time.LocalDateTime.now());
    }

    @Test
    void shouldRefreshToken() {
        AuthenticationRequest loginRequest = AuthenticationRequest.builder()
                .username("testuser")
                .password("password")
                .rememberMe(true)
                .build();
        AuthenticationResponse loginResponse = authenticationService.authenticate(loginRequest);

        AuthenticationResponse refreshResponse = authenticationService.refreshToken(loginResponse.getRefreshToken());

        assertThat(refreshResponse.getToken()).isNotNull();
        assertThat(refreshResponse.getRefreshToken()).isNotEqualTo(loginResponse.getRefreshToken());

        User user = userRepository.findByUsername("testuser").orElseThrow();
        assertThat(passwordEncoder.matches(refreshResponse.getRefreshToken(), user.getRefreshToken())).isTrue();
        assertThat(passwordEncoder.matches(loginResponse.getRefreshToken(), user.getRefreshToken())).isFalse();
    }

    @Test
    void shouldFailWithInvalidRefreshToken() {
        assertThatThrownBy(() -> authenticationService.refreshToken("invalid-token"))
                .isInstanceOf(InvalidRefreshTokenException.class);
    }
}
