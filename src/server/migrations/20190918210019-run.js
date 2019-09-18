'use strict';

exports.up = function(db) {
    return db.runSql(
        `
CREATE TABLE run (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    scenario_id INT NOT NULL REFERENCES scenario(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
    `
    );
};

exports.down = function(db) {
    return db.dropTable('run');
};

exports._meta = {
    version: 1
};
