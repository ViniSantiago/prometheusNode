'use strict';


var express = require('express'),
    app = express(),
    port = process.env.PORT || 3443,
    mongoose = require('mongoose'),
    User = require('./models/userModel'),
    Config = require('./config/env'),
    bodyParser = require('body-parser'),
    Prometheus = require('prom-client');



console.log('\nIniciando HOBB Api...\n');
console.log('---   Variaveis consideradas   ---');
console.log('MONGO_URL  . . . . .: ' + Config.Env.db.url);
console.log('MONGO_USER . . . . .: ' + Config.Env.db.user);
console.log('MONGO_PWD  . . . . .: ' + Config.Env.db.pwd);
console.log('API_PORT . . . . . .: ' + Config.Env.server.port);
console.log('KERNEL_AUTHORIZATION: ' + Config.Env.kernel.authorization);
console.log('KERNEL_ACCOUNT . . .: ' + Config.Env.kernel.url_kernel_account);
console.log('');

var mongo_option = {
    // auth: {
    //     authdb: Config.Env.db.pwd,
    // },
    useNewUrlParser: true,
    pass: Config.Env.db.pwd,
    user: Config.Env.db.user,
}

mongoose.Promise = global.Promise;
mongoose.connect(Config.Env.db.url, mongo_option, function(error) {
    if (error) {
        console.log('Erro na conexao com Mongo: ' + error)
        console.log('\nFinalizando HOBB API...\n')
        process.exit(1);
    }
});

const collectDefaultMetrics = Prometheus.collectDefaultMetrics;
collectDefaultMetrics({ prefix: 'hobb_' });
collectDefaultMetrics({ timeout: 5000 });

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//for swagger response
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.setHeader("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    //intercepts OPTIONS method
    if ('OPTIONS' === req.method) {
        //respond with 200
        res.send(200);
    } else {
        //move on
        next();
    }
});

var routes = require('./routes/apiRoutes.js');
routes(app);

app.use(function(req, res) {
    var msgerror = 'Url \'' + req.originalUrl + '\' not found'
    res.status(404).json({ error: msgerror })
});

module.exports = app.listen(port);