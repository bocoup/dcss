const { asyncMiddleware } = require('../../util/api');

const db = require('./db');

exports.getScenarioAsync = async function(req, res) {
    const scenarioId = Number(req.params.scenario_id);
    const scenarioData = await db.getScenario(scenarioId);

    if (!scenarioData) {
        const noScenarioFoundError = new Error('Invalid scenario id.');
        noScenarioFoundError.status = 404;

        throw noScenarioFoundError;
    }

    res.send(scenarioData);
}

exports.getScenario = asyncMiddleware(exports.getScenarioAsync);