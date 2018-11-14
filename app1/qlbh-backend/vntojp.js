var express = require('express');
var productRepo = require('./repos/wordRepo');
var moment = require('moment');
var low = require('lowdb');
var fileSync = require('lowdb/adapters/FileSync');
var router = express.Router();

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

router.post('/', (req, res) => {
    var c = {
        name: req.body.name,
        number: req.body.number,
        sourceAddress: req.body.address,
        note: req.body.note,
        iat: moment().unix()
	}
	/*var c = {
        name: req.body.name,
        iat: moment().unix()
	}*/
	console.log(c);
    db.get('categories').push(c).write();
    res.statusCode = 201;
    res.json({
        msg: 'added',
        data: c
    });
})

router.get('/load/', (req, res) => {
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