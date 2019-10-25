CREATE TABLE tag_types(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK(name <> '')
);
-- Up above
---
-- Down below
DROP TABLE "tag_types";
