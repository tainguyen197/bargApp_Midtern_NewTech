var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');
var path = require('path');
var productCtrl = require('./apiControllers/productControllers');
var vntojp = require('./vntojp');
var jptovn = require('./apiControllers/jptovn');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));//copy thieu dong nay ne
app.use(cors());

app.get('/', (req, res) => {
   res.render('index');
});

app.use('/api/products/', productCtrl);
app.use('/vntojp/', vntojp);
app.use('/jptovn/', jptovn);
var port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`QLBH API is running on port ${port}`);
});