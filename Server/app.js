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

var pusher = new Pusher({
    app_id: '653439',
    key: '2391b7299b9c104ab8f7',
    secret: '4268445b26b56bd14d6a',
    cluster: 'ap1',
    encrypted: true
  });

app.post('/message', (req, res) => {
    const payload = req.body;
    console.log(payload);
    pusher.trigger('chat', 'message', payload);
    res.send(payload);
  });

app.use('/customer', cusomer);
app.use('/', login);
app.use('/categories', categoryCtrl);
app.use('/driver',driverCtrl);
app.use('/identifier',identifierCtrl);
var PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API running on PORT ${PORT}`);
});