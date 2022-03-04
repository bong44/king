var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.session.new = 1;
  res.render('main', { title: 'Express' });
});

module.exports = router;
