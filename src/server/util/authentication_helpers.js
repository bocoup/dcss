const { Pool } = require('pg');
const { saltHashPassword, validateHashPassword } = require('./pw_hash');

const pool = new Pool();

const getUserInDatabase = async function(username, email) {
    const client = await pool.connect();
    let rows;

    // In this case, check email and username separately since the
    //  user may have already signed up with either or both
    if (email && username) {
        const emailQuery = `SELECT * FROM users WHERE email = '${email}';`;
        const emailResult = await client.query(emailQuery);
        const usernameQuery = `SELECT * FROM users WHERE username = '${username}';`;
        const usernameResult = await client.query(usernameQuery);

        rows = [...emailResult.rows, ...usernameResult.rows];

    // Handle the case when only email or username supplied
    } else {
        if (email && !username) {
            condition = `email = '${email}'`;
        }
        if (!email && username) {
            condition = `username = '${username}'`;
        }
        const queryText = `SELECT * FROM users WHERE ${condition};`;
        const result = await client.query(queryText);
        rows = result.rows;
    }

    return rows;
}

const userExistsInDatabase = async function(username, email) {
    const rows = await getUserInDatabase(username, email);
    let user, exists = rows.length > 0;
    if (exists) {
        user = rows[0];
        if (username) exists = exists && user.username === username;
        if (email) exists = exists && user.email === email;
    }
        
    return { exists, user };
}

const loginUser = async function(req, res, next) {
    const { username, email, password } = req.body;
    const { exists, user } = await userExistsInDatabase(username, email);

    // Case when user is found
    if (exists) {
        const { salt, hash } = user;
        
        // Case of anonymous user, where only the username / email stored
        if (!password && !hash && !salt) {
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
            res.status(400).send({ error: 'Username / email supplied requires a password'});
            return;

        }
        // Case when user with is a password is supplied with a password
        else {
            const { passwordHash } = validateHashPassword(password, salt);
            req.passwordMatch = hash === passwordHash;
            next();
            return;
        }
    }

    res.status(404).send({ error: 'User not found.'});
    return;
}

const duplicatedUser = async function(req, res, next) {
    const { username, email } = req.body;
    const { exists } = await userExistsInDatabase(username, email);
    if(exists) {
        res.status(409).send({ error: 'Duplicated user. User already exists!' });
        return;
    }

    next();
}

const createUser = async function(email, username, password) {
    let pw_salt, pw_hash;
    if (password) {
        const { salt, passwordHash } = saltHashPassword(password);
        pw_salt = salt;
        pw_hash = passwordHash;
    }

    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const queryText = `INSERT INTO users(email, username, hash, salt)
        VALUES($1, $2, $3, $4);
        `;
        await client.query(queryText, [
            !email ? null : email,
            !username ? null : username,
            !pw_hash ? null : pw_hash,
            !pw_salt ? null : pw_salt
        ]);
        await client.query('COMMIT');
        return true;
    } catch (e) {
        await client.query('ROLLBACK');
    } finally {
        client.end();
    }
}

module.exports = { createUser, duplicatedUser, loginUser };
