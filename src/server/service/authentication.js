const { Router } = require('express');
const cors = require('cors');
const { createUser, duplicatedUser, loginUser } = require('../util/authentication_helpers');

const authRouter = Router();

authRouter.post('/signup', duplicatedUser, async (req, res) => {
    if (!req.body) res.status(400).send({ error: 'No request body!' });
    const { username, password, email } = req.body;

    if (!username && !email)
        res.status(400).send({ error: 'Username or email must be defined.' });

    if (email && !email.includes('@'))
        res.status(400).send({ error: 'Email address not in correct format.' });

    const created = await createUser(email, username, password);

    created
        ? res.sendStatus(201)
        : res.status(500).send({ error: 'User not created. Server error' });
});

/**
 *  This is a stubbed endpoint for logging in.
 *  When a user hits this endpoint, the user 'boo'
 *  becomes the active session user.
 */
authRouter.post('/login', [cors(), loginUser], (req, res) => {
    const { username, email } = req.body;
    const { passwordMatch } = req;

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
