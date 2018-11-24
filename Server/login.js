var express = require('express');
var low = require('lowdb');
var fileSync = require('lowdb/adapters/FileSync');
var router = express.Router();
const jwt = require('jsonwebtoken');
var adapter = new fileSync('./db.json');
//var adapter = new fileSync('../../app3/backend/db.json');
var db = low(adapter);

/*router.get('/', verifyToken, (req, res) => {
	jwt.verify(req.token, '123456key', (err, authData) => {
		if(err){
            console.log("2");
            console.log(err);
			res.render('login');
		}
		else{
			console.log("-----------");
            console.log(authData);
			console.log("6");
			authData = authData.thisUser;
			var user = db.get('categories').filter(c => c.id === authData.id && c.password === authData.password);
        	if(user.value().length === 0){
                console.log("5");
				res.render('login');
			}
			else{
                console.log("4");
				res.render('index', {idName: authData.id});
			}
		}
    })
    res.render('index');
})*/

function verifyToken(req, res, next){
    var bearerHeader = req.headers.cookie || req.query.token || req.body.token;
	if(typeof bearerHeader !== 'undefined'){
        req.token = getCookie('Bearer', bearerHeader);
	}
	console.log("abc");
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





/*router.post('/login/test', verifyToken, (req, res) => {
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
})*/

router.post('/login', (req, res) => {
        var user = db.get('admin').filter(c => c.UserName === req.query.id);//k 
        if(user.value().length === 0){
			res.statusCode = 401;
            res.end('Tài khoảng không đúng');
        }
        else{
			if(user.value()[0].Password !== req.query.password){
				res.statusCode = 402;
				res.end('Mật khẩu không đúng');
			}
			else{
				var thisUser = {
                    HoTen: user.value()[0].HoTen,
					UserName: user.value()[0].UserName,
					Password: user.value()[0].Password
                }
				const token = jwt.sign({thisUser}, '123456key');
				res.json({
					token
				})
			}
		}
})

router.get('/vntojp', verifyToken, (req, res) => {
    console.log("456");
	jwt.verify(req.token, '123456key', (err, authData) => {
		if(err){
            console.log("2");
            console.log(err);
			res.render('login');
		}
		else{
			console.log("-----------");
            console.log(authData);
            authData = authData.thisUser;
            console.log("6");
			var user = db.get('admin').filter(c => c.id === authData.id && c.password === authData.password);
        	if(user.value().length === 0){
                console.log("5");
				res.render('login');
			}
			else{
                console.log("4");
				res.render('index', {idName: authData.id});
			}
		}
    })
})


module.exports = router;