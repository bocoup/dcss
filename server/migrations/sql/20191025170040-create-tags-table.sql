CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK(name <> ''),
    tag_type_id INT NOT NULL,
    FOREIGN KEY(tag_type_id) REFERENCES tag_types(id)
);

INSERT INTO tags (name, tag_type_id)
VALUES 
 ('official', 1), 
 ('community', 1);
-- Up above
---
-- Down below
DROP TABLE "tags";
