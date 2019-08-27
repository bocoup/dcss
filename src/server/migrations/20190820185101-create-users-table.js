'use strict';

var dbm;
// disabiling eslint because db-migrate template default
// eslint-disable-next-line no-unused-vars
var type;
// eslint-disable-next-line no-unused-vars
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function(options, seedLink) {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = function(db) {
    return db.createTable('users', {});
};

exports.down = function(db) {
    return db.dropTable('users');
};

exports._meta = {
    version: 1
};
