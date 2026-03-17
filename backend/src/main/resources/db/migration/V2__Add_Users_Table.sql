CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

-- Insert a default admin user (password: JORGE)
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2a$10$uZ3.OGkQwAsCGKbzQLOwFuXjPwd09Ogp5GTv7FtbtG3PmPzUZ2X1C', 'ADMIN');
