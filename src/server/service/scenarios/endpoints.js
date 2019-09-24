const { asyncMiddleware } = require('../../util/api');

const db = require('./db');

const { getUserById } = require('../../util/authenticationHelpers');

exports.getScenarioAsync = async function(req, res) {
    const scenarioId = Number(req.params.scenario_id);
    const scenarioData = await db.getScenario(scenarioId);

    if (!scenarioData) {
        const noScenarioFoundError = new Error('Invalid scenario id');
        noScenarioFoundError.status = 404;

        throw noScenarioFoundError;
    }

    res.send(scenarioData);
};

exports.getScenario = asyncMiddleware(exports.getScenarioAsync);

exports.addScenarioAsync = async function(req, res) {
    const { userId, title, description } = req.body;

    if (!userId || !title || !description) {
        const scenarioCreateError = new Error(
            "The scenario's title and description must be provided by a valid user"
        );
        scenarioCreateError.status = 409;
        throw scenarioCreateError;
    }

    try {
        const result = await db.addScenario(userId, title, description);
        result.status = 201;

        res.send(result);
    } catch (apiError) {
        const error = new Error('Error while creating scenario');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
};

exports.addScenario = asyncMiddleware(exports.addScenarioAsync);

exports.setScenarioAsync = async function(req, res) {
    const { author_id, title, description } = req.body;
    const scenarioId = req.params.scenario_id;

    if (!author_id && !title && !description) {
        const scenarioUpdateError = new Error(
            "The scenario's title and description must be provided by a valid user"
        );
        scenarioUpdateError.status = 409;
        throw scenarioUpdateError;
    }

    try {
        const scenario = await db.setScenario(scenarioId, {
            author_id,
            title,
            description
        });
        const result = { scenario, status: 200 };

        res.send(result);
    } catch (apiError) {
        const error = new Error('Error while updating scenario');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
};

exports.setScenario = asyncMiddleware(exports.setScenarioAsync);

exports.deleteScenarioAsync = async function(req, res) {
    const scenarioId = req.params.scenario_id;

    if (!scenarioId) {
        scenarioDeleteError = new Error(
            'Scenario id required for scenario deletion'
        );
        scenarioDeleteError.status = 409;
        throw scenarioDeleteError;
    }

    try {
        const result = await db.deleteScenario(scenarioId);
        result.status = 200;

        res.send(result);
    } catch (apiError) {
        const error = new Error('Error while deleting scenario');
        error.status = 500;
        error.stack = apiError.stack;
        throw error;
    }
};

exports.deleteScenario = asyncMiddleware(exports.deleteScenarioAsync);
