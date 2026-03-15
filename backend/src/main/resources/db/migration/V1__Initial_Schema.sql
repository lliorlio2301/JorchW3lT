CREATE TABLE resume (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(255),
    location_de VARCHAR(255),
    location_en VARCHAR(255),
    location_es VARCHAR(255),
    summary_de TEXT,
    summary_en TEXT,
    summary_es TEXT
);

CREATE TABLE experience (
    id BIGSERIAL PRIMARY KEY,
    company VARCHAR(255),
    start_date VARCHAR(255),
    end_date VARCHAR(255),
    title_de VARCHAR(255),
    title_en VARCHAR(255),
    title_es VARCHAR(255),
    location_de VARCHAR(255),
    location_en VARCHAR(255),
    location_es VARCHAR(255),
    description_de TEXT,
    description_en TEXT,
    description_es TEXT,
    resume_id BIGINT REFERENCES resume(id)
);

CREATE TABLE education (
    id BIGSERIAL PRIMARY KEY,
    institution VARCHAR(255),
    start_date VARCHAR(255),
    end_date VARCHAR(255),
    degree_de VARCHAR(255),
    degree_en VARCHAR(255),
    degree_es VARCHAR(255),
    location_de VARCHAR(255),
    location_en VARCHAR(255),
    location_es VARCHAR(255),
    description_de TEXT,
    description_en TEXT,
    description_es TEXT,
    resume_id BIGINT REFERENCES resume(id)
);

CREATE TABLE song (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255),
    artist VARCHAR(255),
    youtube_url VARCHAR(255),
    category VARCHAR(255)
);

CREATE TABLE project (
    id BIGSERIAL PRIMARY KEY,
    title_de VARCHAR(255),
    title_en VARCHAR(255),
    title_es VARCHAR(255),
    description_de TEXT,
    description_en TEXT,
    description_es TEXT,
    image_url VARCHAR(255),
    github_url VARCHAR(255),
    demo_url VARCHAR(255)
);

CREATE TABLE project_tags (
    project_id BIGINT REFERENCES project(id),
    tag VARCHAR(255)
);

CREATE TABLE list_item (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    quantity VARCHAR(255),
    completed BOOLEAN DEFAULT FALSE
);
