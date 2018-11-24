var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();

router.get('/',(req,res) => {
    var driver = db.get('driver');
    if(driver.size() > 0){
        res.json({
            driver
        });
    }
    else{
        res.end('no data');
    }
    console.log(driver);
})

router.post('/updateStatus', (req, res) => {
    var c = {
        UserName: req.body.UserName,
        TrangThai: req.body.TrangThai
    }
    db.get('driver')
        .find({ UserName: c.UserName })
        .assign({ TrangThai: c.TrangThai })//skiped    
        .write();   

    res.statusCode = 201;
    res.json({
        msg: 'updated',
        data: c
    });
})

router.get('/login',(req,res) =>{
    var info = {
        username: req.query.username,
        password: req.query.password
    };

    var driver = db.get('driver').filter(c => c.UserName === info.username && c.Password === info.password);
    
    if(driver.size() > 0){
        res.json({
            driver,
            state: "OK"
            
        });
    }
    else res.end('no result');
})

module.exports = router;