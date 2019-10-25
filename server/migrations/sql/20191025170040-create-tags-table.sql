CREATE TABLE tags(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK(name <> ''),
    type_type_id INT NOT NULL,
    FOREIGN KEY(type_type_id) REFERENCES tag_types(id)
);
-- Up above
---
-- Down below
DROP TABLE "tags";
