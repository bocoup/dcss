const { Pool } = require('pg');
const { saltHashPassword } = require('./pw_hash');

const pool = new Pool();

const getUser = async function(username, email) {
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

const userExists = async function(username, email) {
    const rows = await getUser(username, email);
    return rows.length > 0;
}

const duplicatedUser = async function(req, res, next) {
    const { username, email } = req.body;
    const exists = await userExists(username, email);
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
};

module.exports = { createUser, duplicatedUser };
