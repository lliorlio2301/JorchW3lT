package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.auth.AuthenticationRequest;
import Jorch.w3Lt.Jorge.dto.auth.AuthenticationResponse;
import Jorch.w3Lt.Jorge.model.User;
import Jorch.w3Lt.Jorge.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );
        var user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var jwtToken = jwtService.generateToken(user);
        
        String refreshToken = null;
        if (request.isRememberMe()) {
            refreshToken = jwtService.generateRefreshToken(user);
            user.setRefreshToken(refreshToken);
            user.setRefreshTokenExpiration(LocalDateTime.now().plus(java.time.Duration.ofMillis(jwtService.getRefreshExpiration())));
            userRepository.save(user);
        }

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse refreshToken(String refreshToken) {
        final String username = jwtService.extractUsername(refreshToken);
        if (username != null) {
            var user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));
            
            if (jwtService.isTokenValid(refreshToken, user) && 
                refreshToken.equals(user.getRefreshToken()) &&
                user.getRefreshTokenExpiration().isAfter(LocalDateTime.now())) {
                
                var accessToken = jwtService.generateToken(user);
                return AuthenticationResponse.builder()
                        .token(accessToken)
                        .refreshToken(refreshToken)
                        .build();
            }
        }
        throw new RuntimeException("Invalid refresh token");
    }
}
