const config = require('../database/connect/config');
const pool = config;

exports.docList = async function(){ 
    try {
        var conn = await pool.getConnection(); 
    } catch (error) {
        if(conn) conn.release();
    }
    var query = "SELECT name, userid FROM member WHERE isdoctor = 'Y';";
    try {
        var rows = await conn.query(query);
        const contentQueryResult = rows;
        conn.release();
        const result = {contentQueryResult};
        return result;
    } catch (error) {
    }
};

exports.chatList = async function(loginedUserId){ 
    try {
        var conn = await pool.getConnection(); 
    } catch (error) {
        if(conn) conn.release();
    }
    var query = "SELECT d.userid, name, c.roomid, isdoctor FROM member as d INNER JOIN (SELECT userid, b.roomid FROM chatroomjoin as a INNER JOIN (SELECT roomid FROM chatroomjoin WHERE userid = '"+loginedUserId+"') as b ON a.roomid = b.roomid WHERE userid NOT IN('"+loginedUserId+"')) as c ON d.userid = c.userid;";
    try {
        var rows = await conn.query(query);
        const contentQueryResult = rows;
        conn.release();
        const result = {contentQueryResult};
        return result;
    } catch (error) {
    }
};

exports.beforeCreateCheck = async function(toUser, fromUser){ 
    try {
        var conn = await pool.getConnection(); 
    } catch (error) {
        if(conn) conn.release();
    }
    //중복 확인용 sql
    var query = "SELECT userid FROM chatroomjoin as a INNER JOIN (SELECT roomid FROM chatroomjoin WHERE userid = '"+fromUser+"') as b ON a.roomid = b.roomid WHERE userid = '"+toUser+"';";
    try {
        var rows = await conn.query(query);
        conn.release();
        const result = rows[0].userid;
        return result;
    } catch (error) {
    }
};

exports.createChat = async function(toUser, fromUser){ 
    try {
        var conn = await pool.getConnection(); 
    } catch (error) {
        if(conn) conn.release();
    }
    var today = new Date();

    var year = today.getFullYear();
    var month = ('0' + (today.getMonth() + 1)).slice(-2);
    var day = ('0' + today.getDate()).slice(-2);

    var dateString = year + '-' + month  + '-' + day;

    var query = "INSERT INTO chatroom (date) VALUES ('"+dateString+"');";
    var query_getRoomid = "SELECT roomid FROM chatroom ORDER BY roomid DESC LIMIT 1;";
    try {
        var responseCode = await conn.query(query);
        var roomid = await conn.query(query_getRoomid);
        roomid = Number(roomid[0].roomid);
        var query2 = "INSERT INTO chatroomjoin (roomid, userid) VALUES ("+roomid+", '"+toUser+"');";
        var query3 = "INSERT INTO chatroomjoin (roomid, userid) VALUES ("+roomid+", '"+fromUser+"');";
        responseCode += await conn.query(query2);
        responseCode += await conn.query(query3);
        conn.release();
        return responseCode;
    } catch (error) {
    }
};