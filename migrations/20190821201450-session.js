'use strict';

var dbm;
var type;
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
  return db.createTable('session', {
    sid: { type: 'varchar', notNull: true, collate: "default"},
    sess: { type: 'json', notNull: true },
    expire: { type: 'timestamp', length: 6, notNull: true }
  });
}

exports.down = function(db) {
  return db.dropTable('session');
};

exports._meta = {
  "version": 1
};
