var express = require('express'),
    moment = require('moment'),
    low = require('lowdb'),
    fileSync = require('lowdb/adapters/FileSync');

var adapter = new fileSync('./db.json');
var db = low(adapter);

var router = express.Router();

router.get('/',(req,res) => {
    var driver = db.get('identifier');
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
router.get('/login',(req,res) =>{
    var info = {
        username: req.query.username,
        password: req.query.password
    };

    var driver = db.get('identifier').filter(c => c.UserName === info.username && c.Password === info.password);
    
    if(driver.size() > 0){
        res.json({
            driver,
            state: "OK"
            
        });
    }
    else res.end('no result');
})

module.exports = router;