const express = require('express');
const router = express.Router();

var log_controller = require('../controllers/log_controller');

//login 구현
//GET
router.get('/login', function(req, res) {
    
    console.log(req.session);
    if(!req.session.user){
        res.render('login');
    }else{
        //이미 로그인된 유저 로그인
        res.redirect('/');
    }
});
//POST
router.post('/login', async function(req, res){
    //로그인위한 컨트롤러 호출
    var result = await log_controller.SignIn(req, res);
    console.log(result);
    req.session.user = result;
    //console.log(result);
    res.send(result);

});

//logout 구현
router.get('/logout', function(req, res){
    //세션정보 삭제
    req.session.destroy();
    res.redirect('/');
});

//signup 구현
//GET
router.get('/signup', function(req,res){
    res.render('signup');
})

//POST
router.post('/signup', async function(req, res){
    //회원가입 위한 컨트롤러 호출
    var result = await log_controller.SignUp(req, res);
    res.send(result);
});

module.exports = router;