var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  if(!req.session.user){
    //로그인 안 됨
    res.render('',{user:"N"});
  }else{
    //로그인 됨
    res.render('',{user: req.session.user.data});
  }
});

module.exports = router;
