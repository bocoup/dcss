const { sql, updateQuery } = require('../../util/sqlHelpers');
const { query } = require('../../util/db');

async function getScenarioCategories(scenarioId) {
    const scenarioCategoriesResults = await query(
        sql`
            SELECT c.name as name
            FROM scenario_tag s
            INNER JOIN categories c
            ON s.tag_id = c.id
            where scenario_id = ${scenarioId};`
    );

    return scenarioCategoriesResults.rows.map(r => r.name);
}

exports.getScenario = async function getScenario(scenarioId) {
    const results = await query(
        sql` SELECT * FROM scenario WHERE id = ${scenarioId};`
    );

    const categories = await getScenarioCategories(scenarioId);

    return {
        ...results.rows[0],
        categories
    };
};

exports.getAllScenarios = async function getAllScenarios() {
    const results = await query(
        sql`SELECT * FROM scenario ORDER BY created_at DESC;`
    );

    let resultsWithCategories = [];
    for (let r of results.rows) {
        let categories = await getScenarioCategories(r.id);
        resultsWithCategories.push({ ...r, categories });
    }

    return resultsWithCategories;
};

exports.addScenario = async function addScenario(
    authorId,
    title,
    description,
    status
) {
    const result = await query(sql`
INSERT INTO scenario (author_id, title, description, status)
    VALUES (${authorId}, ${title}, ${description}, ${status})
    RETURNING *;
        `);
    return result.rows[0];
};

exports.setScenario = async function setScenario(scenarioId, scenarioData) {
    const result = await query(
        updateQuery('scenario', { id: scenarioId }, scenarioData)
    );
    return result.rows[0];
};

async function addScenarioCategory(scenarioId, category) {
    const insertedRow = await query(sql`
        WITH t AS (SELECT id as tag_id FROM tag WHERE name=${category})
        INSERT INTO scenario_tag (scenario_id, tag_id)
        SELECT CAST(${scenarioId} as INTEGER) as scenario_id, tag_id from t;
    `);

    return insertedRow;
}

async function deleteScenarioCategory(scenarioId, category) {
    const deletedRow = await query(sql`
        DELETE
        FROM scenario_tag s
        USING categories c
        WHERE
            s.tag_id = c.id AND
            s.scenario_id=${scenarioId} AND
            c.name=${category};
    `);

    return deletedRow;
}

exports.setScenarioCategories = async function setScenarioCategories(
    scenarioId,
    categories
) {
    const currentCategoriesResults = await query(
        sql`
        SELECT s.scenario_id, c.name as category
        FROM scenario_tag s
        INNER JOIN categories c on s.tag_id = c.id
        WHERE scenario_id=${scenarioId};
        `
    );

    // This is the list of categories that already exist in current categories
    const currentCategories = currentCategoriesResults.rows.map(
        r => r.category
    );

    // We want to get the diff of currentCategories and categoriesChecked
    //     to delete the current categories that are left over
    const categoriesChecked = [];
    let promises = [];

    for (let category of categories) {
        if (
            currentCategories.length > 0 &&
            currentCategories.includes(category)
        ) {
            categoriesChecked.push(category);
        } else {
            promises.push(addScenarioCategory(scenarioId, category));
        }
    }

    // This filter will return all the categories that need to be deleted
    const toDelete = currentCategories.filter(
        c => categoriesChecked.indexOf(c) < 0
    );

    for (let category of toDelete) {
        promises.push(deleteScenarioCategory(scenarioId, category));
    }

    return Promise.all(promises);
};

exports.deleteScenario = async function deleteScenario(scenarioId) {
    let result;

    result = await query(
        sql`DELETE FROM scenario_tag WHERE scenario_id = ${scenarioId};`
    );

    // TODO: need to handle the previous result

    result = await query(
        sql`DELETE FROM slide WHERE scenario_id = ${scenarioId};`
    );

    // TODO: need to handle the previous result

    result = await query(sql`DELETE FROM scenario WHERE id = ${scenarioId};`);
    return { deletedCount: result.rowCount };
};
