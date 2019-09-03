const { Pool } = require('pg');
const { sql } = require('./sqlHelpers');
const { saltHashPassword, validateHashPassword } = require('./pwHash');

const pool = new Pool();

const getUserInDatabase = async function(username, email) {
    const client = await pool.connect();
    const result = await client.query(
        sql`SELECT * FROM users WHERE email = ${email} OR username = ${username};`
    );
    client.release();
    return result.rows;
};

const userExistsInDatabase = async function(username, email) {
    const rows = await getUserInDatabase(username, email);
    let user = null;
    if (rows.length > 0) {
        user = rows[0];

        // Undo user setting if username or email mismatches
        if (username && user.username !== username) user = null;
        if (email && user.email !== email) user = null;
    }

    return user;
};

const duplicatedUser = async function(req, res, next) {
    const { username, email } = req.body;
    const user = await userExistsInDatabase(username, email);
    if (user) {
        res.status(409).send({
            error: 'Duplicated user. User already exists!'
        });
        return;
    }

    next();
};

const loginUser = async function(req, res, next) {
    const { username, email, password } = req.body;
    const user = await userExistsInDatabase(username, email);

    // Case when user is found
    if (user) {
        const { salt, hash } = user;

        // Case of anonymous user, where only the username / email stored
        if (!password && !hash && !salt) {
            // disabling because not using an await or generator
            // eslint-disable-next-line require-atomic-updates
            req.anonymous = true;
            next();
            return;
        }

        // Case when a passwordless user passes a password
        else if (password && !hash && !salt) {
            res.status(400).send({ error: 'Anonymous user supplied.' });
            return;
        }

        // Case when a user with a password is supplied without a password
        else if (!password && hash && salt) {
            res.status(400).send({
                error: 'Username / email supplied requires a password'
            });
            return;
        }
        // Case when user has a password is supplied with a password
        else {
            const { passwordHash } = validateHashPassword(password, salt);
            // disabling because not using an await or generator
            // eslint-disable-next-line require-atomic-updates
            req.passwordMatch = hash === passwordHash;
            next();
            return;
        }
    }

    res.status(404).send({ error: 'User not found.' });
    return;
};

const createUser = async function(email, username, password) {
    const client = await pool.connect();
    try {
        let salt, passwordHash;
        if (password) {
            let passwordObj = saltHashPassword(password);
            salt = passwordObj.salt;
            passwordHash = passwordObj.passwordHash;
        }
        await client.query('BEGIN');
        await client.query(sql`INSERT INTO users(email, username, hash, salt)
            VALUES(${email}, ${username}, ${passwordHash}, ${salt});`);
        await client.query('COMMIT');
        return true;
    } catch (e) {
        await client.query('ROLLBACK');
    } finally {
        client.release();
    }
};

module.exports = { createUser, duplicatedUser, loginUser };
