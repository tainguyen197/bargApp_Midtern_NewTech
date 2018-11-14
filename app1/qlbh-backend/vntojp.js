var express = require('express');
var productRepo = require('./repos/wordRepo');
var moment = require('moment');
var low = require('lowdb');
var fileSync = require('lowdb/adapters/FileSync');
var router = express.Router();

var adapter = new fileSync('./db.json');
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
        address: req.body.address,
        note: req.body.note,
        iat: moment().unix()
    }
	console.log(c);
    db.get('categories').push(c).write();
    res.statusCode = 201;
    res.json({
        msg: 'added',
        data: c
    });
})


module.exports = router;