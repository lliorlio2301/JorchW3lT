package Jorch.w3Lt.Jorge.controller;

import Jorch.w3Lt.Jorge.dto.BlogPostDTO;
import Jorch.w3Lt.Jorge.service.BlogPostService;
import lombok.RequiredArgsConstructor;
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
    public List<BlogPostDTO> getAllPosts() {
        return blogPostService.getAllPosts();
    }

    @GetMapping("/{slug}")
    public BlogPostDTO getPostBySlug(@PathVariable String slug) {
        return blogPostService.getPostBySlug(slug);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public BlogPostDTO savePost(@RequestBody BlogPostDTO blogPostDTO) {
        return blogPostService.savePost(blogPostDTO);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public BlogPostDTO updatePost(@PathVariable Long id, @RequestBody BlogPostDTO blogPostDTO) {
        blogPostDTO.setId(id);
        return blogPostService.savePost(blogPostDTO);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deletePost(@PathVariable Long id) {
        blogPostService.deletePost(id);
    }
}
