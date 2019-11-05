const { Router } = require('express');

const { validateRequestBody } = require('../../util/requestValidation');
const { requireUser } = require('../auth/middleware');
const router = Router();

const { createCohort, listUserCohorts } = require('./endpoints');

router.put('/', [requireUser, validateRequestBody, createCohort]);
router.get('/', [requireUser, listUserCohorts]);

module.exports = router;
