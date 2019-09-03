const { apiError } = require('./api');

const validateRequestUsernameAndEmail = function(req, res, next) {
    const { username, email } = req.body;

    if (!username && !email) {
        return apiError(res, new Error('Username or email must be defined.'));
    }

    if (email && !email.includes('@')) {
        return apiError(res, new Error('Email address not in correct format.'));
    }
    next();
};

const validateRequestBody = function(req, res, next) {
    if (!req.body) {
        res.status(400).send({ error: 'No request body!' });
        return;
    }

    next();
};

module.exports = { validateRequestUsernameAndEmail, validateRequestBody };
