// Required packages
var http = require('http');
var sockjs = require('sockjs');
var low = require('lowdb');
var _ = require("underscore");
var fileSync = require('lowdb/adapters/FileSync');
var moment = require('moment');
var adapter = new fileSync('./db.json');
var db = low(adapter);
var fetch = require('node-fetch');
// Clients list
var clients = {};
var driver = {};
var customer = null;
var i = -1;
var flag = false;
var flag_time = false;
var return_ts = 0;
var _json = null;
function loadNewCustomer() {
  console.log('loadNewCustomer');
  fetch('http://localhost:3000/categories/customer')
    .then(res => {
      return res.json();
    })
    .then(json => {
      for (id in driver) {
        console.log(id + '------------');
        console.log(driver[id].data.driverInfo[0].TrangThai);
        if (driver[id].data.driverInfo[0].TrangThai === 'ready') {
          console.log(driver[id].id);
          if (clients[driver[id].id])
            clients[driver[id].id].write(JSON.stringify(json));
        }
      }
    })
    .catch(err => {
      console.log('loi');
      console.log(err);
    })

}

// create sockjs server
var echo = sockjs.createServer();

// on new connection event
echo.on('connection', function (conn) {
  console.log('new connection');
  // add this client to clients object

  i = i + 1;
  console.log(i);
  clients[conn.id] = conn;
  if (!flag) {
    flag = !flag;
    setInterval(loadNewCustomer, 12000)
  }
  // on receive new data from client event
  conn.on('data', function (message) {
    var a = JSON.parse(message);
    var _driver = {
      id: conn.id,
      data: a
    };


    console.log(_driver.data.driverInfo[0]);
    //Kiểm tra 1 client có gửi req nhiều lần
    for (j in driver) {
      console.log('---------------');
      console.log(driver[j].data.driverInfo[0].UserName);
      console.log(_driver.data.driverInfo[0].UserName);

      if (driver[j].data.driverInfo[0].UserName === _driver.data.driverInfo[0].UserName) {
        console.log('trung');
        driver[j].id = conn.id;
        driver[j].data = _driver.data;
        return;
      }
    }

    console.log('ok');
    driver[i] = _driver;
    //broadcast(a);
  });

  // on connection close event
  conn.on('close', function () {
    console.log('close a connection');
    delete clients[conn.id];
    for (i in driver) {
      if (driver[i].id === conn.id) {
        driver[i] === null;
        break;
      }
    }
  });

});

// Create an http server
var server = http.createServer();

// Integrate SockJS and listen on /echo
echo.installHandlers(server, { prefix: '/echo' });

// Start server
server.listen(9999, '127.0.0.1');