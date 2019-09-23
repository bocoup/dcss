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