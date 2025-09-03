const fs = require('fs');
const path = require('path');

// 数据库配置
const dbConfig = {
    host: 'localhost',
    port: 3001,
};

// 生成数据库连接字符串
const getDbUrl = (dbName) => {
    return `http://${dbConfig.host}:${dbConfig.port}/${dbName}`;
};

module.exports = {
    dbConfig,
    getDbUrl
}; 