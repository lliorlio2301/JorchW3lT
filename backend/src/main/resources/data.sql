-- Insert Resume
INSERT INTO resume (id, name, email, phone, location, summary) VALUES 
(1, 'Jorch', 'jorch@example.com', '+49 123 456789', 'Bautzen, Germany', 'Aspiring software engineer with a focus on Java Spring Boot and React.');

-- Insert Experiences
INSERT INTO experience (id, title, company, location, start_date, end_date, description, resume_id) VALUES 
(1, 'Junior Developer', 'Tech Corp', 'Berlin', '2023-01', 'Present', 'Working on various Spring Boot projects.', 1),
(2, 'Intern', 'Startup Hub', 'Dresden', '2022-06', '2022-12', 'Assisted in frontend development with React.', 1);

-- Insert Education
INSERT INTO education (id, degree, institution, location, start_date, end_date, description, resume_id) VALUES 
(1, 'Bachelor of Science in Computer Science', 'TU Dresden', 'Dresden', '2019-10', '2023-03', 'Focus on Software Engineering and Databases.', 1);

-- Insert Songs
INSERT INTO song (id, title, artist, youtube_url, category) VALUES 
(1, 'Wonderwall', 'Oasis', 'https://www.youtube.com/watch?v=6hzrDeceEKc', 'Acoustic'),
(2, 'Wish You Were Here', 'Pink Floyd', 'https://www.youtube.com/watch?v=IXdNnw99-Ic', 'Acoustic'),
(3, 'Enter Sandman', 'Metallica', 'https://www.youtube.com/watch?v=CD-E-LDc384', 'Electric');

-- Update the auto-increment sequences (H2 specific if needed, but for ID 1 it should be fine)
ALTER TABLE resume ALTER COLUMN id RESTART WITH 2;
ALTER TABLE experience ALTER COLUMN id RESTART WITH 3;
ALTER TABLE education ALTER COLUMN id RESTART WITH 2;
ALTER TABLE song ALTER COLUMN id RESTART WITH 4;
