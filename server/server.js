const express = require('express');
const cors = require('cors');
const session = require('express-session');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const pgSession = require('connect-pg-simple')(session);

const authRouter = require('./service/auth');
const chatsRouter = require('./service/chats');
const cohortsRouter = require('./service/cohorts');
const componentsRouter = require('./service/components');
const historyRouter = require('./service/history');
const logsRouter = require('./service/logs');
const mediaRouter = require('./service/media');
const notificationsRouter = require('./service/notifications');
const personasRouter = require('./service/personas');
const rolesRouter = require('./service/roles');
const runsRouter = require('./service/runs');
const scenariosRouter = require('./service/scenarios');
const statusRouter = require('./service/status');
const tagsRouter = require('./service/tags');
const tracesRouter = require('./service/traces');

const { logRequestAndResponse } = require('./service/logs/middleware');
const { getDbConfig } = require('./util/dbConfig');
const { errorHandler } = require('./util/api');

const app = express();
const poolConfig = getDbConfig();

app.use(bodyParser.json());
app.use(cors());

app.use(
  session({
    secret: process.env['SESSION_SECRET'] || 'mit tsl teacher moments',
    resave: false,
    saveUninitialized: true,
    store: new pgSession({
      pool: new Pool(poolConfig),
      tableName: 'session'
    }),
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  })
);

app.use(logRequestAndResponse);

app.use('/auth', authRouter);
app.use('/chats', chatsRouter);
app.use('/cohorts', cohortsRouter);
app.use('/components', componentsRouter);
app.use('/history', historyRouter);
app.use('/logs', logsRouter);
app.use('/media', mediaRouter);
app.use('/notifications', notificationsRouter);
app.use('/personas', personasRouter);
app.use('/roles', rolesRouter);
app.use('/runs', runsRouter);
app.use('/scenarios', scenariosRouter);
app.use('/status', statusRouter);
app.use('/tags', tagsRouter);
app.use('/traces', tracesRouter);

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
module.exports = { listener, app };
