const root = require('app-root-path');
global.__base = root + '/back/';
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');

// db
const mongoose = require('mongoose');
const database = require(__base + 'config/database');
console.log('connect to ' + database.url);
mongoose.connect(database.url);
const db  = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// webapp
app.use(express.static(__base + '/public'));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({extended: true})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

//routes
require(__base + 'routes/animalRoutes')(app);
require(__base + 'routes/featureRoutes')(app);
require(__base + 'routes/flowRoutes')(app);

const server = app.listen(3000, function () {
	const host = server.address().address;
	const port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
