const PouchDB = require('pouchdb');
const { getDbUrl } = require('../config/database');

// 为每个数据库创建独立的连接，包含认证信息
const files = new PouchDB(getDbUrl('files'));
const wikis = new PouchDB(getDbUrl('wikis'));
const wikitrees = new PouchDB(getDbUrl('wikitrees'));

module.exports = {
    files,
    wikis,
    wikitrees,
};