
var service_main = require("../services/log_service");

exports.SignIn = async function(req,res){

    var result = await service_main.SignIn(req);

    return result;
};

exports.SignUp = async function(req,res){

    var result = await service_main.SignUp(req); 
    
    var msg = "가입완료"; 
    if(result == 100) { 
        msg = "이미 존재하는 ID 입니다."; 
    } 
    var json = {code:result, msg:msg}; console.log(json); 
    return json; 
};

