const mongoose = require('mongoose');

const dbConnection = async () => {
  try {
    // await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.MONGO_DATABASE}${process.env.MONGO_OPTIONS && `?${process.env.MONGO_OPTIONS}`}`);
    await mongoose.connect(`mongodb://localhost:27017/lumi`);
    console.info('Connected to database');
  }
  catch (error) {
    console.error(`Error connecting to database: ${error.message}`);
    throw error; // 抛出错误，让 Fastify 知道插件初始化失败
  }
};

module.exports = dbConnection;