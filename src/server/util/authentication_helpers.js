const { Pool } = require('pg');
const { sql } = require('./sql_helpers');
const { saltHashPassword } = require('./pw_hash');

const pool = new Pool();

const getUser = async function(req, res, next) {
    const { username, email } = req.body;
    const client = await pool.connect();

    const result = await client.query(sql`SELECT * FROM users WHERE email = ${email} OR username = ${username};`);
    client.end();

    if(result.rows.length > 0) {
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

module.exports = { createUser, getUser };
