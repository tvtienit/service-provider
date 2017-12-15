const mongoose = require('mongoose');
const { cfg } = require('../config/app');
const assert = require('assert');

mongoose.Promise = global.Promise;
const dbConnectionString =
    'mongodb://'
    .concat((cfg.DBSync == 1) ? `${cfg.DBUser}:${cfg.DBPwd}@` : '')
    .concat(`${cfg.DBHost}:${cfg.DBPort}/${cfg.DBName}`);

exports.runDatabase = () => {
    mongoose.connect(dbConnectionString, (err, db) => {
        assert.equal(null, err);
    });

    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'Connection error:'));
    db.once('open', () => console.log('MongoDB\'s connected'));
}

exports.nss = require('node-suggestive-search').init({
    dataBase: "mongodb",
    mongoDatabase: dbConnectionString,
    cache: true
});