var express = require('express');
var productRepo = require('../repos/wordRepo');

var router = express.Router();

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

router.post('/', (req, res) => {
	productRepo.loadDataJP(req.body.nihon)
		.then(rows => {
			console.log(rows);
			res.render('index', { nihongo:req.body.nihon,betonamugo:rows[0].vietnamese});
		}).catch(err => {
			console.log(err);
			res.statusCode = 500;
			res.render('index');
		})
})

module.exports = router;