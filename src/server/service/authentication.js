const { Router } = require('express');
const cors = require('cors');
const { createUser, duplicatedUser, loginUser } = require('../util/authentication_helpers');
const { validateRequestUsernameAndEmail, validateRequestBody } = require('../util/request_validation');

const authRouter = Router();

authRouter.post('/signup', [validateRequestUsernameAndEmail, validateRequestBody, duplicatedUser], async (req, res) => {
    const created = await createUser(email, username, password);

    created
        ? res.sendStatus(201)
        : res.status(500).send({ error: 'User not created. Server error' });
});

authRouter.post('/login', [cors(), validateRequestUsernameAndEmail, loginUser], (req, res) => {
    const { username, email } = req.body;
    const { passwordMatch, anonymous } = req;

    let userObj = {};

    if (passwordMatch) {
        if (username) {
            req.session.username = username;
            userObj['username'] = username;
        }
        if (email) {
            req.session.email = email;
            userObj['email'] = email;
        }
    }

    if (anonymous) {
        req.session.anonymous = true;
        userObj['anonymous'] = true;
    }

    res.send(userObj);
});

/**
 *  This is a stubbed endpoint for logging out.
 *  When a user hits this endpoint, the user 'boo'
 *  is no longer the active session user.
 */
authRouter.post('/logout', (req, res) => {
    delete req.session.username;
    req.session.destroy(() => res.send('ok'));
});

authRouter.get('/me', (req, res) => {
    if (!req.session.username) res.send('Not logged in!');
    res.send({ username: req.session.username });
});

module.exports = authRouter;
