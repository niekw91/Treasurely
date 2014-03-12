/**
 * Treasurely API - Main entry file
 */
var express = require('express')
	, fs = require('fs')
	, http = require('http')

// Load configurations
var env = process.env.NODE_ENV || 'development'
	, config = require('./config/config')[env]
	, mongoose = require('mongoose')

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/app/models'
fs.readdirSync(models_path).forEach(function (file) {
	require(models_path+'/'+file)
})

var app = express()
// Load express settings
require('./config/express')(app, config)

// Bootstrap routes
require('./config/routes')(app)

// Get index.html
app.get('/', function indexHTML(req, res, next) {
    fs.readFile('public/index.html', function (err, data) {
        if (err) { next(err); return; }
        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
        next();
	});
});

// Start the app by listening on <port>
var port = process.env.PORT || 8000
var server = app.listen(port);
console.log('Express listening at port ' + port);
require('./config/socket-io')(app, server);

// Expose app
exports = module.exports = app
