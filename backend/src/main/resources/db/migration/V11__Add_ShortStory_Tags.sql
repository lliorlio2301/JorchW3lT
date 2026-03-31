CREATE TABLE short_story_tags (
    short_story_id BIGINT NOT NULL,
    tag VARCHAR(255) NOT NULL,
    CONSTRAINT fk_short_story FOREIGN KEY (short_story_id) REFERENCES short_stories(id) ON DELETE CASCADE,
    CONSTRAINT pk_short_story_tags PRIMARY KEY (short_story_id, tag)
);

CREATE INDEX idx_short_story_tags_short_story_id ON short_story_tags(short_story_id);
