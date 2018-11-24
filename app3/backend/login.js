var express = require('express');
var low = require('lowdb');
var fileSync = require('lowdb/adapters/FileSync');
var router = express.Router();
const jwt = require('jsonwebtoken');
var axios = require('axios');
var adapter = new fileSync('./db.json');
//var adapter = new fileSync('../../app3/backend/db.json');
var db = low(adapter);

router.get('/', verifyToken, (req, res) => {
    /*var ts = 0;
    if (req.query.ts) {
        ts = +req.query.ts;
    }

    var categories = db.get('categories').filter(c => c.iat >= ts);
    var return_ts = moment().unix();
    res.json({
        return_ts,
        categories
    });*/
    console.log("456");
	jwt.verify(req.token, '123456key', (err, authData) => {
		if(err){
			res.render('login');
		}
		else{
			console.log("-----------");
            console.log(authData);
            authData = authData.thisUser;
            console.log("6666");
            console.log("authData");
			var instance = axios.create({
                baseURL: 'http://localhost:3000/login',
				timeout: 15000
			});
			instance.post('?id=' + authData.UserName + '&password=' + authData.Password)
				.then(function (res1) {
					if (res1.status === 200) {
                        res.render('index', {idNameName: authData.HoTen});
                    }
				}).catch(function (err) {
                        res.render('login');
                })
		}
    })
})

function verifyToken(req, res, next){
    console.log("4444");
    console.log(req.headers.cookie);
    var bearerHeader = req.headers.cookie || req.query.token || req.body.token;
	if(typeof bearerHeader !== 'undefined'){
        req.token = getCookie('Bearer', bearerHeader);
    }
    next();
}

function getCookie(cname, cookie) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}





router.post('/login/test', verifyToken, (req, res) => {
	jwt.verify(req.token, '123456key', (err, authData) => {
		if(err){
			res.json({
				test: 0
			})
		}
		else{
			var user = db.get('categories').filter(c => c.id === authData.id && c.password === authData.password);
        	if(user.value().length === 0){
                res.json({
					test: 0
				})
			}
			else{
				res.json({
					test: 1
				})
			}
		}
    })
})

router.post('/login', (req, res) => {
		var user = db.get('categories').filter(c => c.id === req.query.id);//k 
        if(user.value().length === 0){
			res.statusCode = 401;
            res.end('Tài khoảng không đúng');
        }
        else{
			var password = db.get('categories').filter(c => c.password === req.query.password);//k 
			if(password.value().length === 0){
				res.statusCode = 402;
				res.end('Mật khẩu không đúng');
			}
			else{
				var thisUser = {
					id: user.value()[0].id,
					password: user.value()[0].password
				}
				const token = jwt.sign({thisUser}, '123456key');
				console.log(thisUser);
				console.log("123456789");
				console.log(token);
				res.json({
					token
				})
			}
		}
})

module.exports = router;