const { sql } = require('../../util/sqlHelpers');
const { withClient, withClientTransaction } = require('../../util/db');

exports.getScenario = async function getScenario(scenarioId) {
    return withClient(async client => {
        const results = await client.query(
            sql` SELECT * FROM scenario WHERE id = ${scenarioId};`
        );
        return results.rows[0];
    });
};

exports.addScenario = async function addScenario(authorId, title, description) {
    return withClientTransaction(async client => {
        const result = await client.query(sql`
INSERT INTO scenario (author_id, title, description)
    VALUES (${authorId}, ${title}, ${description})
    RETURNING *;
        `);

        return result.rows[0];
    });
};

exports.setScenario = async function setScenario(scenarioId, scenarioData) {
    const original = await exports.getScenario(scenarioId);
    const { author_id, title, description } = original;

    return withClientTransaction(async client => {
        const newAuthorId = scenarioData.author_id || author_id;
        const newTitle = scenarioData.title || title;
        const newDescription = scenarioData.description || description;
        const result = await client.query(sql`
UPDATE scenario SET
    author_id = ${newAuthorId},
    title = ${newTitle},
    description = ${newDescription}
WHERE id = ${scenarioId}
RETURNING *;
        `);
        return result.rows[0];
    });
};

exports.deleteScenario = async function deleteScenario(scenarioId) {
    return withClientTransaction(async client => {
        const result = await client.query(
            sql`DELETE FROM scenario WHERE id = ${scenarioId};`
        );

        return { deletedCount: result.rowCount };
    });
};
