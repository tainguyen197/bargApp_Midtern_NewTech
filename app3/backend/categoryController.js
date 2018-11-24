var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');
var axios = require('axios');
var adapter = new fileSync('../../app1/qlbh-backend/db.json');
const jwt = require('jsonwebtoken');
//var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();

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
            console.log("2");
            console.log(err);
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
                        console.log(".......");
                        res.render('index', {idNameName: authData.id});
                    }
				}).catch(function (err) {
                    console.log(err);
                        res.render('login');
                })
		}
    })
})

function verifyToken(req, res, next){
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

router.get('/lp', (req, res) => {
    res.render('map');
})

/*router.get('/lp', (req, res) => {
    var ts = 0;
    if (req.query.ts) {
        ts = +req.query.ts;
    }
    //
    //? api đâu
    // truyền vào cái api để lấy dữ liệu. sao lại lấy trực tiếp vậy laf sao?? bật lại cái nãy cais nay la cai gi, này là phái server thôi nó chỉ cấp dữ liệu mới. lây về là bên lient
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
})*/

router.post('/', (req, res) => {
    var c = {
        name: req.body.name,
        iat: moment().unix()
    }

    db.get('categories').push(c).write();

    res.statusCode = 201;
    res.json({
        msg: 'added'
    });
})

module.exports = router;