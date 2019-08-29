const validateRequestUsernameAndEmail = function(req, res, next) {
    const { username, email } = req.body;

    if (!username && !email) {
        res.status(400).send({ error: 'Username or email must be defined.' });
        return;
    }

    if (email && !email.includes('@')) {
        res.status(400).send({ error: 'Email address not in correct format.' });
        return;
    }

    next();

}

const validateRequestBody = function(req, res, next) {
    if (!req.body) {
        res.status(400).send({ error: 'No request body!' });
        return;
    }

    next();
}


module.exports = { validateRequestUsernameAndEmail, validateRequestBody };