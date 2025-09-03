var express = require('express');
var router = express.Router();

require('./share.js')(router);

/* GET home page. */
router.get('/', function(req, res, next) {
  // #swagger.tags = ['Index']
  res.render('index', { title: 'Express' });
});

module.exports = router;
