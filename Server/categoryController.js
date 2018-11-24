var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();

router.get('/', (req, res) => {
    var ts = 0;

    if (req.query.ts) {
        ts = +req.query.ts;
        console.log('ts = ' + ts);
    }
    var categories = db.get('categories').filter(c => c.iat >= ts);
    var return_ts = moment().unix();

    res.json({
        categories
    });
})

router.get('/lp', (req, res) => {
    var ts = 0;
    if (req.query.ts) {
        ts = +req.query.ts;
    }

    var loop = 0;
    var fn = () => {
        console.log("AHIHI");
        var categories = db.get('categories').filter(c => c.iat >= ts);
        var return_ts = moment().unix();
        if (categories.size() > 0) {
            console.log('catelories > 0');
            res.json({
                return_ts,
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
})


router.get('/customer', (req, res) => {
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
})

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

router.post('/updateReq', (req, res) => {
    var c = {
        SDT: req.body.SDT,
    }
    console.log(c.SDT);
    db.get('categories')
        .find({ SDT: c.SDT })
        .assign({ Skip: 1 })//skiped    
        .write();   

    res.statusCode = 201;
    res.json({
        msg: 'updated',
        data: c
    });
})


router.post('/updateStatus', (req, res) => {
    var c = {
        SDT: req.body.SDT,
    }
    console.log(c.SDT);
    db.get('categories')
        .find({ SDT: c.SDT })
        .assign({ TrangThai: 'Done' })//skiped    
        .write();   

    res.statusCode = 201;
    res.json({
        msg: 'updated',
        data: c
    });
})

router.post('/update', (req, res) => {
    var c = {
        SDT: req.body.SDT,
        DiaChi: req.body.DiaChi,
    }

    db.get('categories')
        .find({ SDT: c.SDT })
        .assign({ DiaChi: c.DiaChi })
        .write();

    res.statusCode = 201;
    res.json({
        msg: 'updated',
        data: c
    });
})

router.post('/', (req, res) => {
    var c = {
        HoTen: req.body.HoTen,
        SDT: req.body.SDT,
        DiaChi: req.body.DiaChi,
        GhiChu: req.body.GhiChu,
        TrangThai: 'Wait',
        Skip: 0,
        iat: moment().unix()
    }

    db.get('categories').push(c).write();

    res.statusCode = 201;
    res.json({
        msg: 'added',
        data: c
    });
})

module.exports = router;