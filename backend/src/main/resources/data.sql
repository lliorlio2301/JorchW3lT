-- Insert Resume with Multi-Language Support
INSERT INTO resume (id, name, email, phone, location_de, location_en, location_es, summary_de, summary_en, summary_es) VALUES 
(1, 'Jorch', 'jorch@example.com', '+49 123 456789', 
'Bautzen, Deutschland', 'Bautzen, Germany', 'Bautzen, Alemania',
'Angehender Softwareentwickler mit Fokus auf Java Spring Boot und React.', 
'Aspiring software engineer with a focus on Java Spring Boot and React.',
'Aspirante a ingeniero de software centrado en Java Spring Boot und React.');

-- Insert Experiences with Multi-Language Support
INSERT INTO experience (id, company, start_date, end_date, title_de, title_en, title_es, location_de, location_en, location_es, description_de, description_en, description_es, resume_id) VALUES 
(1, 'Tech Corp', '2023-01', 'Present', 
'Junior Entwickler', 'Junior Developer', 'Desarrollador Junior',
'Berlin, Deutschland', 'Berlin, Germany', 'Berlín, Alemania',
'Arbeit an verschiedenen Spring Boot Projekten.', 
'Working on various Spring Boot projects.',
'Trabajando en varios proyectos de Spring Boot.', 1),
(2, 'Startup Hub', '2022-06', '2022-12', 
'Praktikant', 'Intern', 'Pasante',
'Dresden, Deutschland', 'Dresden, Germany', 'Dresde, Alemania',
'Unterstützung bei der Frontend-Entwicklung mit React.', 
'Assisted in frontend development with React.',
'Asistencia en el desarrollo frontend con React.', 1);

-- Insert Education with Multi-Language Support
INSERT INTO education (id, institution, start_date, end_date, degree_de, degree_en, degree_es, location_de, location_en, location_es, description_de, description_en, description_es, resume_id) VALUES 
(1, 'TU Dresden', '2019-10', '2023-03', 
'Bachelor of Science in Informatik', 'Bachelor of Science in Computer Science', 'Grado en Ciencias de la Computación',
'Dresden, Deutschland', 'Dresden, Germany', 'Dresde, Alemania',
'Fokus auf Software Engineering und Datenbanken.', 
'Focus on Software Engineering and Databases.',
'Enfoque en Ingeniería de Software y Bases de Datos.', 1);

-- Insert Songs (Category names could also be localized if needed later)
INSERT INTO song (id, title, artist, youtube_url, category) VALUES 
(1, 'Wonderwall', 'Oasis', 'https://www.youtube.com/watch?v=6hzrDeceEKc', 'Acoustic'),
(2, 'Wish You Were Here', 'Pink Floyd', 'https://www.youtube.com/watch?v=IXdNnw99-Ic', 'Acoustic'),
(3, 'Enter Sandman', 'Metallica', 'https://www.youtube.com/watch?v=CD-E-LDc384', 'Electric');

-- Insert Projects
INSERT INTO project (id, title_de, title_en, title_es, description_de, description_en, description_es, image_url, github_url, demo_url) VALUES
(1, 'Portfolio Webseite', 'Portfolio Website', 'Sitio Web de Portafolio',
'Diese Webseite, gebaut mit Spring Boot und React.',
'This very website, built with Spring Boot and React.',
'Este sitio web, construido con Spring Boot und React.',
'https://via.placeholder.com/400x250', 'https://github.com/lliorlio2301/JorchW3lT', 'https://jorch.w3lt'),
(2, 'Einkaufsliste App', 'Shopping List App', 'Aplicación de Lista de Compras',
'Eine einfache App zur Verwaltung von Einkaufslisten.',
'A simple app to manage shopping lists.',
'Una aplicación sencilla para gestionar listas de la compra.',
'https://via.placeholder.com/400x250', 'https://github.com/lliorlio2301/shopping-list', NULL);

-- Insert Project Tags
INSERT INTO project_tags (project_id, tag) VALUES
(1, 'Java'), (1, 'Spring Boot'), (1, 'React'), (1, 'TypeScript'),
(2, 'Java'), (2, 'Spring Boot'), (2, 'H2');

-- Insert List Items
INSERT INTO list_item (id, name, quantity, completed) VALUES
(1, 'Milch', '2 Liter', false),
(2, 'Brot', '1 Leib', true),
(3, 'Eier', '10 Stück', false);

-- Update the auto-increment sequences
ALTER TABLE resume ALTER COLUMN id RESTART WITH 2;
ALTER TABLE experience ALTER COLUMN id RESTART WITH 3;
ALTER TABLE education ALTER COLUMN id RESTART WITH 2;
ALTER TABLE song ALTER COLUMN id RESTART WITH 4;
ALTER TABLE project ALTER COLUMN id RESTART WITH 3;
ALTER TABLE list_item ALTER COLUMN id RESTART WITH 4;
