package Jorch.w3Lt.Jorge.service;

import Jorch.w3Lt.Jorge.dto.BlogPostDTO;
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
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return blogPostMapper.toDto(post);
    }

    @Transactional
    public BlogPostDTO savePost(BlogPostDTO blogPostDTO) {
        BlogPost post = blogPostMapper.toEntity(blogPostDTO);
        if (post.getSlug() == null || post.getSlug().isEmpty()) {
            post.setSlug(generateSlug(post.getTitle()));
        }
        return blogPostMapper.toDto(blogPostRepository.save(post));
    }

    @Transactional
    public void deletePost(Long id) {
        blogPostRepository.deleteById(id);
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s]", "")
                .replaceAll("\\s+", "-");
    }
}
