CREATE TABLE tag_type (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK(name <> '')
);

INSERT INTO tag_type (name)
VALUES
 ('categories'),
 ('topics');

 CREATE TABLE tag (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL CHECK(name <> ''),
    tag_type_id INT NOT NULL REFERENCES tag_type(id)
);

INSERT INTO tag (name, tag_type_id)
VALUES
 ('official', 1),
 ('community', 1);

CREATE TABLE scenario_tag (
    scenario_id INT NOT NULL REFERENCES scenario(id),
    tag_id INT NOT NULL REFERENCES tag(id),
    PRIMARY KEY (scenario_id, tag_id)
);
-- Up above
---
-- Down below
DROP TABLE "tag_type";
DROP TABLE "tag";
DROP TABLE "scenario_tag";
