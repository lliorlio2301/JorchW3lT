CREATE TABLE blog_post_tags (
    blog_post_id BIGINT NOT NULL,
    tag VARCHAR(255) NOT NULL,
    CONSTRAINT fk_blog_post FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);
