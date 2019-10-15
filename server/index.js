const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);

const authRouter = require('./service/authentication');
const rolesRouter = require('./service/roles');
const scenariosRouter = require('./service/scenarios');
const s3Router = require('./service/s3');
const { getDbConfig } = require('./util/dbConfig');

const { errorHandler } = require('./util/api');

const app = express();
// Heroku uses $PORT
const port = process.env.PORT || 5000;
const poolConfig = getDbConfig();

app.use(express.static('../../dist'));
app.use(bodyParser.json());
app.use(cors());
console.log('poolConfig', poolConfig);
app.use(
    session({
        secret: 'mit tsl teacher moments',
        resave: false,
        saveUninitialized: true,
        store: new pgSession({
            pool: new Pool(poolConfig),
            tableName: 'session'
        }),
        cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
    })
);

app.use('/auth', authRouter);
app.use('/roles', rolesRouter);
app.use('/scenarios', scenariosRouter);
app.use('/media', s3Router);

// This handles 404 results from router -- answers all remaining requests
app.use((req, res, next) => {
    const e404 = new Error('API Endpoint not found');
    e404.status = 404;
    next(e404);
});
// This handles api errors that are thrown -- needs to be after all the endpoints
app.use(errorHandler);

const listener = express();
listener.use('/api', app);
listener.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on ${port}`);
});
