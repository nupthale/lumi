var createError = require('http-errors');
var express = require('express');
var path = require('path');
var PouchDB = require('pouchdb');

// 进程级别的错误处理 - 防止服务崩溃
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // 记录错误但不退出进程
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // 记录错误但不退出进程
});

var indexRouter = require('./routes/index');
var { createAllFilters } = require('./pouchdb/filter');

var dbPath = path.join(__dirname, 'dbs/'); // 你可以自定义路径
var PouchDBWithPrefix = PouchDB.defaults({ prefix: dbPath });

var app = express();

app.use('/share-api', indexRouter);

// 配置 express-pouchdb 并启用认证
app.use('/', require('express-pouchdb')(PouchDBWithPrefix, {
  mode: 'fullCouchDB', // 启用完整的 CouchDB 功能，包括认证
  configPath: path.join(__dirname, 'config.json'), // 指定配置文件路径
  logPath: path.join(__dirname, 'pouchdb-logs.txt'), // 日志路径（可选）
  inMemoryConfig: false, // 不从内存读取配置
  // builds a full HTTP API but excludes express-pouchdb's authentication logic (say, because it interferes with custom authentication logic used in our own express app):
  overrideMode: {
    exclude: [
      'routes/authentication',
      // disabling the above, gives error messages which require you to disable the
      // following parts too. Which makes sense since they depend on it.
      'routes/authorization',
      'routes/session'
    ]
  }
}));

// 监听数据库打开事件 - 每次连接都会触发
PouchDB.on('created', (dbName) => {
  if (dbName === '_users') {
      console.log('Files database opened, ensuring filters exist...');
      createAllFilters();
  }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

module.exports = app;
