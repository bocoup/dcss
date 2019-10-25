CREATE TABLE scenarios_to_tags(
    id SERIAL PRIMARY KEY,
    scenario_id INT NOT NULL,
    tag_id INT NOT NULL,
    FOREIGN KEY(scenario_id) REFERENCES scenario(id),
    FOREIGN KEY(tag_id) REFERENCES tags(id)
);
-- Up above
---
-- Down below
DROP TABLE "scenarios_to_tags";
