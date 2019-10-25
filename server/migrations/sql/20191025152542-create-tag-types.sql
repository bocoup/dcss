CREATE TABLE tag_types(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK(name <> '')
);

INSERT INTO tag_types (name)
VALUES
 ('categories'),
 ('topics');
-- Up above
---
-- Down below
DROP TABLE "tag_types";
