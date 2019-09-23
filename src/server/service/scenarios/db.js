const { sql } = require('../../util/sqlHelpers');
const { withClient, withClientTransaction } = require('../../util/db');

exports.getScenario = async function getScenario(scenarioId) {
    return withClient( async client => {
        const results = await client.query(
            sql` SELECT * FROM scenario WHERE id = ${scenarioId};`
        );
        return results.rows[0];
    });
}

exports.addScenario = async function addScenario(authorId, title, description) {
    console.log('authorId', authorId);
    return withClientTransaction( async client => {
        const result = await client.query(sql`
INSERT INTO scenario (author_id, title, description)
    VALUES (${authorId}, ${title}, ${description})
    RETURNING scenario.id;
        `);

        return {scenarioId: result.rows[0]};
    });
}