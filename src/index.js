const express = require('express');

const app = express();
const session = require('express-session')
const port = process.env.SERVER_PORT || 5000;

app.use(session({
    secret: 'mit tsl teacher moments',
    resave: true,
    saveUninitialized: true
}));

app.post('/login', (req, res) => {
    req.session.username = 'boo';
    res.send('ok');
});

app.get('/me', (req, res) => {
    if (!req.session.username) res.send('Not logged in!');
    res.send(req.session.username);
});

app.post('/logout', (req, res) => {
    delete req.session.username;
    res.send('ok');
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
