var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');
    Pusher = require('pusher');

var categoryCtrl = require('./categoryController');
var driverCtrl = require('./driverController');
var identifierCtrl = require('./identifierController');
var app = express();
var login = require('./login');
var cusomer = require('./customer');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/customer', cusomer);
app.use('/', login);
app.use('/categories', categoryCtrl);
app.use('/driver',driverCtrl);
app.use('/identifier',identifierCtrl);
var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
});