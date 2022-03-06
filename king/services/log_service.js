var bkfd2Password = require('pbkdf2-password'); 
var hasher = bkfd2Password(); 

const config = require('../database/config');
const pool = config;

exports.SignIn = async function(req){ 
    var json = {}; json.code = 0; 
    //var conn = await pool.getConnection(); 
    try {
        var conn = await pool.getConnection(); 
    } catch (error) {
        if(conn) conn.release();
    }
    var userid = req.body.userid; 
    var password = req.body.password; 
    var query = "SELECT * FROM user where user_id='" + userid +"' ;"; 
    try {
        var rows = await conn.query(query); 
        // 쿼리 실행 
        if(rows[0]) { 
            //저장된 password 와 hash password 가 같은지를 체크하여 로그은 성공, 실패 처리 
        var userSalt = rows[0].user_salt; 
        var userPass = rows[0].user_pass; 
        
        return new Promise((resolve, reject) =>{ 
            hasher({password:password, salt:userSalt}, (err, pass, salt, hash) => { 
                if(hash != userPass) 
                { 
                    json.code = 100; 
                    json.msg = "패스워드 일치하지 않습니다.(운영환경 : ID 및 비밀번호가 일치하지 않습니다)"; 
                    json.data = {}; 
                }else { 
                    json.data = rows[0]; 
                } 
                resolve(json);
            }); 
        }); 
        } else { 
            json.code = 100; 
            json.msg = "ID 일치하지 않습니다."; 
            json.data = {};
            return json; 
        } 
    } catch (error) {
}
};

// 회원가입 
exports.SignUp = async function(req,res){ 
    var resultcode = 0; 
    var conn = await pool.getConnection();
    var userid = req.body.userid; 
    var password = req.body.password; 
    var name = req.body.name; 
    //추가된 내용

    var email = req.body.email;
    var phoneNum = req.body.phoneNum;

    //추가된 내용

    
    var query = "SELECT * FROM user where user_id='" + userid +"';"; 
    try {
        var rows = await conn.query(query); 

        // 쿼리 실행 
        if(rows[0] == undefined) { 
            hasher({password:password}, async (err, pass, salt, hash) => { 
                var query = " insert into user (user_id, user_pass, user_name, user_salt, user_email, user_phone_num, user_reg_date) values ('" + userid +"','" + hash +"','" + name +"', '"+ salt +"', '"+ email +"', '"+ phoneNum +"', CURRENT_TIMESTAMP());"; 
                
                    var rows = await conn.query(query);
                
                // 쿼리 실행 
            }); 

    } else { 
        // 이미 있음 
        resultcode = 100; 
    } 
    return resultcode; 
    } catch (error) {
        resultcode = 500;
    }
};
