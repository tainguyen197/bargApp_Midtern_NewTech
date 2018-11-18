var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

var adapter = new fileSync('../../app1/qlbh-backend/db.json');
//var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();

router.get('/', (req, res) => {
    var ts = 0;
    if (req.query.ts) {
        ts = +req.query.ts;
    }

    var categories = db.get('categories').filter(c => c.iat >= ts);
    var return_ts = moment().unix();
    res.json({
        return_ts,
        categories
    });
})

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