const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');

const scenariosRouter = Router();

const {
    getScenario
} = require('./endpoints.js');

scenariosRouter.get('/:scenario_id', [getScenario]);

scenariosRouter.put('/:scenario_id', [
    validateRequestBody
]);

scenariosRouter.post('/:scenario_id/add', [
    validateRequestBody
]);

scenariosRouter.post('/scenario_id/delete', [
    validateRequestBody
]);

module.exports = scenariosRouter;