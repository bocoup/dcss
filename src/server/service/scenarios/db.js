const { sql } = require('../../util/sqlHelpers');
const { withClient, withClientTransaction } = require('../../util/db');

exports.getScenario = async function getScenario(scenarioId) {
    return withClient( async client => {
        const results = await client.query(
            sql` SELECT * FROM scenario WHERE id = ${scenarioId};`
        );
        return results.rows[0];
    });
};

exports.addScenario = async function addScenario(authorId, title, description) {
    return withClientTransaction( async client => {
        const result = await client.query(sql`
INSERT INTO scenario (author_id, title, description)
    VALUES (${authorId}, ${title}, ${description})
    RETURNING scenario.id;
        `);

        return {scenarioId: result.rows[0]};
    });
};

exports.setScenario = async function setScenario(scenarioId, scenarioData) {
    const original = await withClient( async client => {
        return await client.query(
            sql` SELECT * FROM scenario WHERE id = ${scenarioId};`
        );
    });
    const {author_id, title, description} = original.rows[0];

    return withClientTransaction( async client => {
        const newAuthorId = scenarioData.author_id || author_id;
        const newTitle = scenarioData.title || title;
        const newDescription = scenarioData.description || description;
        const result = await client.query(sql`
UPDATE scenario SET
    author_id = ${newAuthorId},
    title = ${newTitle},
    description = ${newDescription}
    WHERE id = ${scenarioId};
        `);
        return {updatedCount: result.rowCount};
    });
};