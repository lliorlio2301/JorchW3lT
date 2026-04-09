-- Add content column to notes
ALTER TABLE notes ADD COLUMN content TEXT;

-- Migrate existing note items to markdown content
-- Note: This is a bit complex in pure SQL for H2/Postgres compatibility.
-- We will use a simple concatenation strategy.
UPDATE notes n SET content = (
    SELECT COALESCE(STRING_AGG(
        CASE 
            WHEN ni.is_checklist = TRUE THEN 
                CASE WHEN ni.completed = TRUE THEN '- [x] ' ELSE '- [ ] ' END
            ELSE '- ' 
        END || ni.text, 
        E'\n' ORDER BY ni.id
    ), '')
    FROM note_items ni 
    WHERE ni.note_id = n.id
);

-- After migration, we can drop the old table
DROP TABLE note_items;
