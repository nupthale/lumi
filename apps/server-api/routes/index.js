var express = require('express');
var router = express.Router();

const authMiddleware = require('../middleware/auth');
require('./auth.js')(router);

//所有下面的路由都需要登录。
router.use(authMiddleware);

require('./user.js')(router);
require('./storage.js')(router);

/* GET home page. */
router.get('/', function(req, res, next) {
  // #swagger.tags = ['Index']
  res.render('index', { title: 'Express' });
});

module.exports = router;
