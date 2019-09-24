const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');

const scenariosRouter = Router();

const {
    getScenario,
    addScenario,
    setScenario
} = require('./endpoints.js');

scenariosRouter.get('/:scenario_id', [getScenario]);

scenariosRouter.post('/add', [
    validateRequestBody,
    addScenario
]);

scenariosRouter.put('/:scenario_id', [
    validateRequestBody,
    setScenario
]);

scenariosRouter.post('/:scenario_id/delete', [
    validateRequestBody
]);

module.exports = scenariosRouter;