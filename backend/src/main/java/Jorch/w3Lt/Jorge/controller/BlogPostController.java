package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.BlogPostDTO;
import Jorch.w3Lt.Jorge.service.BlogPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/blog")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BlogPostController {

    private final BlogPostService blogPostService;

    @GetMapping
    public ResponseEntity<List<BlogPostDTO>> getAllPosts() {
        return ResponseEntity.ok(blogPostService.getAllPosts());
    }

    @GetMapping("/{slug}")
    public ResponseEntity<BlogPostDTO> getPostBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(blogPostService.getPostBySlug(slug));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogPostDTO> savePost(@RequestBody BlogPostDTO blogPostDTO) {
        return ResponseEntity.ok(blogPostService.savePost(blogPostDTO));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<BlogPostDTO> updatePost(@PathVariable Long id, @RequestBody BlogPostDTO blogPostDTO) {
        blogPostDTO.setId(id);
        return ResponseEntity.ok(blogPostService.savePost(blogPostDTO));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogPostService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}
