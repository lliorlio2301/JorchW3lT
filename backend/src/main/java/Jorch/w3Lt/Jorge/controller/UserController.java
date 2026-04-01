package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.AccountUpdateDTO;
import Jorch.w3Lt.Jorge.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PutMapping("/account")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> updateAccount(@RequestBody AccountUpdateDTO updateDTO, Principal principal) {
        String currentUsername = principal.getName();
        
        if (updateDTO.getNewUsername() != null && !updateDTO.getNewUsername().isEmpty()) {
            userService.updateUsername(currentUsername, updateDTO.getNewUsername());
        }
        
        if (updateDTO.getNewPassword() != null && !updateDTO.getNewPassword().isEmpty()) {
            // Use the updated username if it was changed in the same request, 
            // otherwise use the current one.
            String targetUser = (updateDTO.getNewUsername() != null && !updateDTO.getNewUsername().isEmpty()) 
                ? updateDTO.getNewUsername() 
                : currentUsername;
            userService.updatePassword(targetUser, updateDTO.getNewPassword());
        }
        
        return ResponseEntity.ok().build();
    }
}
