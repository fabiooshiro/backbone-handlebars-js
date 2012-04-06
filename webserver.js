/**
 * This file is just to test the application
 */
var express = require('express');
var app = module.exports = express.createServer();
app.configure(function () {
    app.use(express.static(__dirname + '/'));
});
app.listen(8080);