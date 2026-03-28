package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.AccountUpdateDTO;
import Jorch.w3Lt.Jorge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PutMapping("/update-username")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUsername(@RequestBody AccountUpdateDTO dto, Authentication authentication) {
        try {
            userService.updateUsername(authentication.getName(), dto.getNewUsername());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/update-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updatePassword(@RequestBody AccountUpdateDTO dto, Authentication authentication) {
        try {
            userService.updatePassword(authentication.getName(), dto.getNewPassword());
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
