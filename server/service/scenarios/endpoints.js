const { asyncMiddleware } = require('../../util/api');

const { reqScenario } = require('./middleware');
const db = require('./db');

exports.getScenario = asyncMiddleware(async function getScenarioAsync(
    req,
    res
) {
    res.send({ scenario: reqScenario(req), status: 200 });
});

exports.getAllScenarios = asyncMiddleware(async function getAllScenariosAsync(
    req,
    res
) {
    try {
        const scenarios = await db.getAllScenarios();
        const result = { scenarios, status: 200 };

        res.send(result);
    } catch (apiError) {
        const error = new Error('Error while getting all scenarios');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
});

exports.addScenario = asyncMiddleware(async function addScenarioAsync(
    req,
    res
) {
    const userId = req.session.user.id;
    const { title, description, categories, status } = req.body;

    if (!userId || !title || !description || !status) {
        const scenarioCreateError = new Error(
            "The scenario's title, description, and draft status must be provided by a valid user"
        );
        scenarioCreateError.status = 409;
        throw scenarioCreateError;
    }

    try {
        const scenario = await db.addScenario(
            userId,
            title,
            description,
            status
        );
        await db.setScenarioCategories(scenario.id, categories);
        const result = { scenario, status: 201 };

        res.send(result);
    } catch (apiError) {
        const error = new Error('Error while creating scenario');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
});

exports.setScenario = asyncMiddleware(async function setScenarioAsync(
    req,
    res
) {
    const { author_id, title, description, categories, status } = req.body;
    const scenarioId = req.params.scenario_id;

    if (!author_id && !title && !description) {
        const scenarioUpdateError = new Error(
            'Must provide author_id, title, or description to update'
        );
        scenarioUpdateError.status = 409;
        throw scenarioUpdateError;
    }

    try {
        const scenario = await db.setScenario(scenarioId, {
            author_id,
            title,
            description,
            status
        });

        await db.setScenarioCategories(scenarioId, categories);

        const result = { scenario, status: 200 };

        res.send(result);
    } catch (apiError) {
        const error = new Error('Error while updating scenario');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
});

exports.deleteScenario = asyncMiddleware(async function deleteScenarioAsync(
    req,
    res
) {
    const scenarioId = req.params.scenario_id;

    if (!scenarioId) {
        const scenarioDeleteError = new Error(
            'Scenario id required for scenario deletion'
        );
        scenarioDeleteError.status = 409;
        throw scenarioDeleteError;
    }

    try {
        const scenario = await db.deleteScenario(scenarioId);
        const result = { scenario, status: 200 };

        res.send(result);
    } catch (apiError) {
        const error = new Error('Error while deleting scenario');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
});
