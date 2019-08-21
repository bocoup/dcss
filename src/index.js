const express = require('express');

const app = express();
const session = require('express-session')
const port = process.env.SERVER_PORT || 5000;

app.use(session({
    secret: 'mit tsl teacher moments',
    resave: true,
    saveUninitialized: true
}));

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});
