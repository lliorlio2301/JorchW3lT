package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.auth.AuthenticationRequest;
import Jorch.w3Lt.Jorge.dto.auth.AuthenticationResponse;
import Jorch.w3Lt.Jorge.exception.InvalidRefreshTokenException;
import Jorch.w3Lt.Jorge.model.User;
import Jorch.w3Lt.Jorge.repository.UserRepository;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

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
            user.setRefreshToken(passwordEncoder.encode(refreshToken));
            user.setRefreshTokenExpiration(LocalDateTime.now().plus(java.time.Duration.ofMillis(jwtService.getRefreshExpiration())));
        } else {
            user.setRefreshToken(null);
            user.setRefreshTokenExpiration(null);
        }
        userRepository.save(user);

        return AuthenticationResponse.builder()
                .token(jwtToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AuthenticationResponse refreshToken(String refreshToken) {
        if (refreshToken == null || refreshToken.isBlank()) {
            throw new InvalidRefreshTokenException();
        }

        final String username;
        try {
            username = jwtService.extractUsername(refreshToken);
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidRefreshTokenException();
        }

        if (username == null) {
            throw new InvalidRefreshTokenException();
        }

        var user = userRepository.findByUsername(username)
                .orElseThrow(InvalidRefreshTokenException::new);

        boolean tokenMatchesStored = user.getRefreshToken() != null
                && passwordEncoder.matches(refreshToken, user.getRefreshToken());
        boolean refreshWindowValid = user.getRefreshTokenExpiration() != null
                && user.getRefreshTokenExpiration().isAfter(LocalDateTime.now());

        boolean jwtValid;
        try {
            jwtValid = jwtService.isTokenValid(refreshToken, user);
        } catch (JwtException | IllegalArgumentException e) {
            throw new InvalidRefreshTokenException();
        }

        if (!tokenMatchesStored || !refreshWindowValid || !jwtValid) {
            throw new InvalidRefreshTokenException();
        }

        String rotatedRefreshToken = jwtService.generateRefreshToken(user);
        user.setRefreshToken(passwordEncoder.encode(rotatedRefreshToken));
        user.setRefreshTokenExpiration(LocalDateTime.now().plus(java.time.Duration.ofMillis(jwtService.getRefreshExpiration())));
        userRepository.save(user);

        var accessToken = jwtService.generateToken(user);
        return AuthenticationResponse.builder()
                .token(accessToken)
                .refreshToken(rotatedRefreshToken)
                .build();
    }
}
