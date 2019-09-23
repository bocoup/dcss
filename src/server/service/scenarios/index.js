const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');

const scenariosRouter = Router();

const {
    getScenario,
    addScenario
} = require('./endpoints.js');

scenariosRouter.get('/:scenario_id', [getScenario]);

scenariosRouter.put('/:scenario_id', [
    validateRequestBody
]);

scenariosRouter.post('/add', [
    validateRequestBody,
    addScenario
]);

scenariosRouter.post('/scenario_id/delete', [
    validateRequestBody
]);

module.exports = scenariosRouter;