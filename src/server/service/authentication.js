const { Router } = require('express');
const cors = require('cors');
const {
    createUser,
    duplicatedUser,
    loginUser
} = require('../util/authenticationHelpers');
const {
    validateRequestUsernameAndEmail,
    validateRequestBody
} = require('../util/requestValidation');

const authRouter = Router();

authRouter.post(
    '/signup',
    [validateRequestUsernameAndEmail, validateRequestBody, duplicatedUser],
    async (req, res) => {
        const { username, password, email } = req.body;
        const created = await createUser(email, username, password);

        return created
            ? res.sendStatus(201)
            : res.status(500).send({ error: 'User not created. Server error' });
    }
);

authRouter.post(
    '/login',
    [cors(), validateRequestUsernameAndEmail, loginUser],
    (req, res) => {
        const { username, email } = req.body;
        const { passwordMatch, anonymous } = req;

        let userObj = {};

        if (passwordMatch) {
            req.session.anonymous = false;
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
            req.session.username = '';
            req.session.email = '';
            userObj['anonymous'] = true;
        }

        res.send(userObj);
    }
);

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
    let meObj = {};

    if (req.session.username) meObj['username'] = req.session.username;
    if (req.session.email) meObj['email'] = req.session.email;
    if (req.session.anonymous) meObj['anonymous'] = req.session.anonymous;

    if (!meObj) res.send('Not logged in!');

    res.send(meObj);
});

module.exports = authRouter;
