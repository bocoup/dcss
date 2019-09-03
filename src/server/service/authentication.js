const { Router } = require('express');
const cors = require('cors');
const {
    createUser,
    duplicatedUser,
    loginUser,
    requireUser
} = require('../util/authenticationHelpers');
const {
    validateRequestUsernameAndEmail,
    validateRequestBody
} = require('../util/requestValidation');

const authRouter = Router();

authRouter.post('/signup', [
    validateRequestUsernameAndEmail,
    validateRequestBody,
    duplicatedUser,
    createUser
]);

authRouter.post(
    '/login',
    [cors(), validateRequestUsernameAndEmail, loginUser],
    (req, res) => {
        res.json(req.session.user);
    }
);

/**
 *  This is a stubbed endpoint for logging out.
 *  When a user hits this endpoint, the user 'boo'
 *  is no longer the active session user.
 */
authRouter.post('/logout', async (req, res) => {
    delete req.session.username;
    req.session.destroy(() => res.send('ok'));
});

authRouter.get('/me', requireUser, (req, res) => {
    return res.json(req.session.user);
});

module.exports = authRouter;
