const { asyncMiddleware } = require('../../util/api');
const db = require('./db');
const { runForRequest } = require('./middleware');
const { getScenarioConsent } = require('../scenarios/db');

async function newOrExistingRunAsync(req, res) {
    const { scenario_id } = req.params;
    const { id: user_id } = req.session.user;

    // TODO: investigate using ON CONFLICT RETURN *
    let run = await db.fetchRun({ scenario_id, user_id });

    if (!run) {
        const { id: consent_id } = await getScenarioConsent(scenario_id);
        run = await db.createRun({ scenario_id, user_id, consent_id });
    }

    res.json({ status: 200, run });
}

async function upsertResponseAsync(req, res) {
    const { id: run_id, user_id } = await runForRequest(req);
    const { response_id } = req.params;
    const response = req.body;
    res.json(
        await db.upsertResponse({ run_id, response_id, response, user_id })
    );
}

async function updateRunAsync(req, res) {
    const { id } = await runForRequest(req);
    const body = req.body;
    const run = await db.updateRun(id, body);

    res.json({ status: 200, run });
}

async function revokeConsentForRunAsync(req, res) {
    const { id } = await runForRequest(req);
    const run = await db.updateRun(id, { consent_granted_by_user: false });
    res.json({ status: 200, run });
}

async function finishRunAsync(req, res) {
    const { id } = await runForRequest(req);
    res.json(await db.finishRun(id));
}

exports.finishRun = asyncMiddleware(finishRunAsync);
exports.newOrExistingRun = asyncMiddleware(newOrExistingRunAsync);
exports.revokeConsentForRun = asyncMiddleware(revokeConsentForRunAsync);
exports.updateRun = asyncMiddleware(updateRunAsync);
exports.upsertResponse = asyncMiddleware(upsertResponseAsync);
