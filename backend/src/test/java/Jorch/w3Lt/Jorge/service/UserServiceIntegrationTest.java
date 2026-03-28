package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.AbstractIntegrationTest;
import Jorch.w3Lt.Jorge.model.Role;
import Jorch.w3Lt.Jorge.model.User;
import Jorch.w3Lt.Jorge.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserServiceIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setup() {
        userRepository.deleteAll();
        User admin = User.builder()
                .username("admin")
                .password(passwordEncoder.encode("password"))
                .role(Role.ADMIN)
                .build();
        userRepository.save(admin);
    }

    @Test
    void shouldUpdateUsername() {
        userService.updateUsername("admin", "newadmin");
        
        assertThat(userRepository.findByUsername("newadmin")).isPresent();
        assertThat(userRepository.findByUsername("admin")).isEmpty();
    }

    @Test
    void shouldFailWhenUsernameTaken() {
        User other = User.builder()
                .username("other")
                .password("pass")
                .role(Role.ADMIN)
                .build();
        userRepository.save(other);

        assertThatThrownBy(() -> userService.updateUsername("admin", "other"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Username already taken");
    }

    @Test
    void shouldUpdatePassword() {
        userService.updatePassword("admin", "newpassword");
        
        User updated = userRepository.findByUsername("admin").orElseThrow();
        assertThat(passwordEncoder.matches("newpassword", updated.getPassword())).isTrue();
    }
}
