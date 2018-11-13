var express = require('express'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    cors = require('cors');

var categoryCtrl = require('./categoryController');

var app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());

app.use('/app3', categoryCtrl);

var PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
});