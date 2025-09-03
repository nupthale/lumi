const fs = require('fs');
const path = require('path');

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Lumi API',
    description: 'Description'
  },
  host: 'localhost:7100'
};

const outputFile = './swagger-output.json';

// 遍历../routes下的所有文件， 生成routes数组
const routesDir = path.join(__dirname, '../routes');
const files = fs.readdirSync(routesDir);
const routes = [];
for (let i = 0; i < files.length; i++) {
  const file = files[i];
  if (file.endsWith('.js')) {
    routes.push('../routes/' + file);
  }
}

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);