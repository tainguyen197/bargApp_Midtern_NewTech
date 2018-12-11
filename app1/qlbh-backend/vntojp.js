var express = require('express');
var productRepo = require('./repos/wordRepo');
var moment = require('moment');
var low = require('lowdb');
var fileSync = require('lowdb/adapters/FileSync');
const jwt = require('jsonwebtoken');
var axios = require('axios');

var router = express.Router();

var adapter = new fileSync('./db.json');
//var adapter = new fileSync('../../app3/backend/db.json');
var db = low(adapter);
var Au = '';
router.get('/', verifyToken, (req, res) => {
    /*console.log("456");
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
    res.render('index');*/
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
            console.log(authData);
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
        console.log(req.token);
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
/*router.post('/', (req, res) => {
	console.log(req.body.name);
	console.log(req.body.number);
	console.log(req.body.address);
	console.log(req.body.note);
	db.
	db.get('categories').filter(c => c.iat >= ts);
	productRepo.senData(req.body.name, req.body.number, req.body.address, req.body.note)
		.then(rows => {
			res.render('index', { vietnamese:req.body.vietnamese,japanese:rows[0].japanese});
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.render('index');
		})
})*/

router.post('/', verifyToken, (req, res) => {
    /*jwt.verify(req.token, '123456key', (err, authData) => {
		if(err){
            console.log("2");
            console.log(err);
			res.render('login');
		}
		else{
			console.log("-----------");
            console.log(authData);
            authData = authData.thisUser;
			var user = db.get('categories').filter(c => c.id === authData.id && c.password === authData.password);
        	if(user.value().length === 0){
                console.log("5");
				res.render('login');
			}
			else{
                var c = {
                    id: authData.id,
                    password: authData.password,
                    name: req.body.name,
                    number: req.body.number,
                    sourceAddress: req.body.address,
                    note: req.body.note,
                    iat: moment().unix()
                }
                console.log(c);
                db.get('categories').push(c).write();
                res.render('index', {idName: authData.id});
			}
		}
    })*/
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
                        var instance1 = axios.create({
                            baseURL: 'http://localhost:3000/customer/add',
                            headers:{
                                cookie: 'Bearer='+req.token
                            },
                            timeout: 15000
                        });
                        instance1.post('?HoTen=' + req.body.name + '&SDT=' + req.body.number + '&DiaChi=' + req.body.address + '&GhiChu=' + req.body.note)
                            .then(function (res1) {
                                if (res1.status === 200) {
                                    res.render('index', {idNameName: authData.HoTen});
                                }
                            }).catch(function (err) {
                                    res.render('login');
                            })
                        //db.get('categories').push(c).write();
                        res.render('index', {idNameName: authData.HoTen, note1: 'Đặt xe thành công!'});
                    }
				}).catch(function (err) {
                        res.render('login');
                })
		}
    })
})

router.get('/load', (req, res) => {
    var ts = 0;
    if (req.query.ts) {
        ts = +req.query.ts;
    }
    
    var loop = 0;
    var fn = () => {
        var categories = db.get('categories').filter(c => c.iat >= ts);//k 
        var return_ts = moment().unix();
        if (categories.size() > 0) {
            console.log('co moi');
            res.json({
                return_ts,
                categories
            });
        } else {
            loop++;
            console.log(`loop: ${loop}`);
            if (loop < 4) {
                setTimeout(fn, 2500);
            } else {
                res.statusCode = 204;
                res.end('no data');
            }
        }
    }
    //chỗ nào lấy dữ liệu đâu
    fn();
})


module.exports = router;