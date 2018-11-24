var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');
var path = require('path');
var categoryCtrl = require('./categoryController');
var login = require('./login');
const jwt = require('jsonwebtoken');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

/*app.get('/', (req, res) => {
    res.render('index');
 });*/
app.use('/app3', categoryCtrl);
app.use('/', login);


var PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
});