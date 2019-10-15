const parse = require('url-parse');
const devConfig = require('../database.json').dev;

exports.getDbConfig = function() {
    // This is the environment variable Heroku exposes
    if (process.env.DATABASE_URL) {
        const { username: user, password, hostname: host, port, pathname} = parse(process.env.DATABASE_URL, true);
        return {
            user,
            password,
            host,
            port,
            // the database name is included in the pathname
            //  the pathname string starts with a  '/', so to
            //  get the database name, take the subtring
            database: pathname.substring(1),
            ssl: true
        }
    }

    return devConfig;
}
