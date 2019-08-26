const express = require('express');
const cors = require('cors');
const session = require('express-session');
const { Pool } = require('pg');
const AWS = require('aws-sdk');

require('dotenv').config();

const app = express();
const port = process.env.SERVER_PORT || 5000;
const pgSession = require('connect-pg-simple')(session);

app.use(cors());

app.use(session({
    secret: 'mit tsl teacher moments',
    resave: false,
    saveUninitialized: true,
    store: new pgSession({
        pool: new Pool(),
        tableName: 'session'
    }),
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }, // 30 days
    secret: 'tsl cookie secret'
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
    req.session.destroy(() => res.send('ok'));
});

app.get('/media/:key', (req, res) => {
    const s3 = new AWS.S3();
    const params = {
        Bucket: process.env.S3_BUCKET,
        Key: req.params.key
    };
    s3.getObject(params, (err, data) => {
        if (data && data.ContentType === 'binary/octet-stream') {
            res.send(data.Body.toString());
        } else {
            res.send('ok');
        }
    });
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
