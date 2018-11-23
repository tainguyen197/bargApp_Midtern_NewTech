var express = require('express');
var productRepo = require('../repos/wordRepo');
var low = require('lowdb');
var fileSync = require('lowdb/adapters/FileSync');
var router = express.Router();
const jwt = require('jsonwebtoken');
var adapter = new fileSync('./db.json');
//var adapter = new fileSync('../../app3/backend/db.json');
var db = low(adapter);

router.get('/', (req, res) => {
	productRepo.loadAll()
		.then(rows => {
			res.json(rows);
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.end('View error log on console');
		})
})





router.post('/', verifyToken, (req, res) => {
		jwt.verify(req.token, '123456key', (err, authData) => {
			if(err){
				console.log(err);
			}
			else{
				console.log("-----------");
				console.log(authData);
			}
		})
		var user = db.get('categories').filter(c => c.id === req.query.id);//k 
        if(user.value().length === 0){
			console.log("aaaaaaaa");
			res.statusCode = 401;
			console.log("nnnnnnnnn");
            res.end('Tài khoảng không đúng');
        }
        else{
			var password = db.get('categories').filter(c => c.password === req.query.password);//k 
			console.log(password.value());
			if(password.value().length === 0){
				res.statusCode = 402;
				res.end('Mật khẩu không đúng');
			}
			else{
				var thisUser = {
					id: user.value()[0].id,
					password: user.value()[0].password
				}
				console.log(thisUser);
				const token = jwt.sign({thisUse0r: thisUser}, '123456key');
				console.log(token);
				res.json({
					token
				})
			}
		}
})

function verifyToken(req, res, next){
	var bearerHeader = req.headers.authorization;
	if(typeof bearerHeader !== 'undefined'){
		var bearer = bearerHeader.split(' ');
		var bearerToken = bearer[1];
		req.token = bearerToken;
		next();
	}
	else{
		res.sendStatus(403);
	}
}

module.exports = router;