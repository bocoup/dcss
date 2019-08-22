const express = require('express');

const app = express();
const cors = require('cors');
const session = require('express-session');
const port = process.env.SERVER_PORT || 5000;
const { Pool } = require('pg');

const pgSession = require('connect-pg-simple')(session);
const pool = new Pool({
    host: 'localhost',
    user: 'tm',
    password: 'teachermoments',
    database: 'teachermoments',
    port: 5432
});

app.use(cors());

app.use(session({
    secret: 'mit tsl teacher moments',
    resave: true,
    saveUninitialized: true,
    store: new pgSession({pool})
}));

app.post('/login', cors() , (req, res) => {
    req.session.username = 'boo';
    res.send({ ok: true, username: req.session.username});
});

app.get('/me', (req, res) => {
    if (!req.session.username) res.send('Not logged in!');
    res.send({username: req.session.username});
});

app.post('/logout', (req, res) => {
    delete req.session.username;
    res.send('ok');
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
