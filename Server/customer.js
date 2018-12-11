var express = require('express');
var low = require('lowdb');
var fileSync = require('lowdb/adapters/FileSync');
var router = express.Router();
const jwt = require('jsonwebtoken');
var adapter = new fileSync('./db.json');
var moment = require('moment');
//var adapter = new fileSync('../../app3/backend/db.json');
var db = low(adapter);
var check = true;


router.get('/getCusInfo',(req,res) =>{
    var info = {
        SDT: req.query.SDT
    };

    var cusInfo = db.get('categories').filter(c => c.SDT === info.SDT);
    
    if(cusInfo.size() > 0){
        res.json({
            cusInfo,
            state: "OK"
        });
    }
    else res.end('no result');
})

router.post('/updateAdress', (req, res) => {
    var c = {
        SDT: req.body.SDT,
        DiaChi: req.body.DiaChi,
    }

    var now = moment().unix();
    db.get('categories')
        .find({ SDT: c.SDT })
        .assign({ DiaChi: c.DiaChi,
        iat: now })
        .write();

    res.statusCode = 201;
    res.json({
        msg: 'updated',
        data: c
    });
})

router.get('/loadnewcustomer', (req, res) => {
    if(check){
        check = false;
        var ts = 'Wait';
        var loop = 0;
        var fn = () => {
            var categories = db.get('categories').filter(c => c.TrangThai === ts & c.Skip === 0);
            if (categories.size() > 0) {
                console.log('catelories > 0');
                res.json({
                    categories
                });
            } else {
                loop++;
                console.log('catelories <= 0');
                console.log(`loop: ${loop}`);
                if (loop < 4) {
                    setTimeout(fn, 2500);
                } else {
                    res.statusCode = 204;
                    res.end('no data');
                }
            }
        }
        fn();
    }
   check = true;
})


router.post('/add', verifyToken, (req, res) => {
    console.log("3");
	jwt.verify(req.token, '123456key', (err, authData) => {
		if(err){
            console.log("4");
            res.statusCode = 401;
            res.end('Không thể giải mã token');
		}
		else{
            console.log("5");
			console.log("-----------");
            authData = authData.thisUser;
            console.log(authData);
            console.log("6");
			var user = db.get('admin').filter(c => c.UserName === authData.UserName && c.Password === authData.Password);
        	if(user.value().length === 0){
                console.log("6");
                res.statusCode = 401;
                res.end('Tài khoản và mật khẩu không đúng');
			}
			else{
                console.log("7");
                var c = {
                    HoTen: req.query.HoTen,
                    SDT: req.query.SDT,
                    DiaChi: req.query.DiaChi,
                    GhiChu: req.query.GhiChu,
                    TrangThai: 'Wait',
                    Skip: 0,
                    iat: moment().unix(),
                    iat2: moment().unix()
                }
                console.log(c);
                db.get('categories').push(c).write();
                res.json({
                    status: 'ok',
                    data: c
                })
			}
		}
    })
})

function verifyToken(req, res, next){
    console.log(req);

    var bearerHeader = req.headers.cookie || req.query.token || req.body.token;
	if(typeof bearerHeader !== 'undefined'){
        req.token = getCookie('Bearer', bearerHeader);
	}
	console.log("abc");
    next();
}

function getCookie(cname, cookie) {
    console.log("2");
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


router.post('/updateStatus', (req, res) => {
    var c = {
        SDT: req.body.SDT,
    }
    console.log(c.SDT);
    var now = moment().unix();
    console.log(now);
    db.get('categories')
        .find({ SDT: c.SDT })
        .assign({ TrangThai: 'Done',
        iat: now})//skiped    
        .write();   

    res.statusCode = 201;
    res.json({
        msg: 'updated',
        data: c
    });
})

router.post('/updateMovingStatus', (req, res) => {
    var c = {
        SDT: req.body.SDT,
    }
    console.log(c.SDT);
    var now = moment().unix();
    console.log(now);
    db.get('categories')
        .find({ SDT: c.SDT })
        .assign({ TrangThai: 'Moving',
        iat: now})//skiped    
        .write();   

    res.statusCode = 201;
    res.json({
        msg: 'updated',
        data: c
    });
})

router.post('/updateSkipStatus', (req, res) => {
    var c = {
        SDT: req.body.SDT,
    }
    var now = moment().unix();
    console.log(c.SDT);
    db.get('categories')
        .find({ SDT: c.SDT })
        .assign({ TrangThai: 'Không có xe',
    iat: now })//skiped    
        .write();   

    res.statusCode = 201;
    res.json({
        msg: 'updated',
        data: c
    });
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


router.get('/loadts1', (req, res) => {
    var ts = 0;
    if (req.query.ts) {
        ts = +req.query.ts;
    }
    
    var loop = 0;
    var fn = () => {
        var categories = db.get('categories').filter(c => c.iat2 >= ts);//k 
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