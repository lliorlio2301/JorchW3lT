package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.BlogPostDTO;
import Jorch.w3Lt.Jorge.exception.ResourceNotFoundException;
import Jorch.w3Lt.Jorge.mapper.BlogPostMapper;
import Jorch.w3Lt.Jorge.model.BlogPost;
import Jorch.w3Lt.Jorge.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlogPostService {

    private final BlogPostRepository blogPostRepository;
    private final BlogPostMapper blogPostMapper;

    public List<BlogPostDTO> getAllPosts() {
        return blogPostRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(blogPostMapper::toDto)
                .collect(Collectors.toList());
    }

    public BlogPostDTO getPostBySlug(String slug) {
        BlogPost post = blogPostRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with slug: " + slug));
        return blogPostMapper.toDto(post);
    }

    @Transactional
    public BlogPostDTO savePost(BlogPostDTO blogPostDTO) {
        BlogPost post = blogPostMapper.toEntity(blogPostDTO);
        
        // If it's a new post or the slug is empty, generate it
        if (post.getId() == null || post.getSlug() == null || post.getSlug().isEmpty()) {
            String slug = generateSlug(post.getTitle());
            String uniqueSlug = slug;
            int counter = 1;

            // Ensure uniqueness
            while (blogPostRepository.findBySlug(uniqueSlug).isPresent()) {
                uniqueSlug = slug + "-" + counter;
                counter++;
            }
            post.setSlug(uniqueSlug);
        }
        
        return blogPostMapper.toDto(blogPostRepository.save(post));
    }

    @Transactional
    public void deletePost(Long id) {
        blogPostRepository.deleteById(id);
    }

    private String generateSlug(String title) {
        if (title == null || title.isEmpty()) {
            return "untitled";
        }
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // Allow hyphens
                .replaceAll("\\s+", "-")         // Replace spaces with hyphens
                .replaceAll("-+", "-")           // Collapse multiple hyphens
                .replaceAll("^-|-$", "");        // Remove leading/trailing hyphens
    }
}
