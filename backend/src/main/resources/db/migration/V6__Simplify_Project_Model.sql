-- Migration to simplify Project model (Removing 3 languages)

-- 1. Add new columns
ALTER TABLE project ADD COLUMN title VARCHAR(255);
ALTER TABLE project ADD COLUMN description TEXT;

-- 2. Migrate existing data (Prefer DE, fallback to EN, fallback to ES)
UPDATE project 
SET title = COALESCE(title_de, title_en, title_es),
    description = COALESCE(description_de, description_en, description_es);

-- 3. Drop old columns
ALTER TABLE project DROP COLUMN title_de;
ALTER TABLE project DROP COLUMN title_en;
ALTER TABLE project DROP COLUMN title_es;
ALTER TABLE project DROP COLUMN description_de;
ALTER TABLE project DROP COLUMN description_en;
ALTER TABLE project DROP COLUMN description_es;
