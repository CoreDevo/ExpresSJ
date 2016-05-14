var express = require('express');
var app = express();
var index = '/index.html';
var notFound = '/notFound.html';
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var path = require('path');
var logger = require('morgan');

var indexRouter = require('./routers/index');
var chatRouter = require('./routers/chat_router');
var loginRouter = require('./routers/login');
var accessCodeGenerator = require('./routers/accessCode');

connections = [];
room = ['lobby'];
users = [0];
roomUsers = {lobby:[]};

app.use(logger('dev'));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(express.static(path.join(__dirname + '/public')));

app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/chat', chatRouter);
app.use('/generateAccessCode', accessCodeGenerator);

app.use(function(req, res){
	console.log('someone just viewed 404 page');
	res.sendFile(path.resolve('public/notFound.html'));
});

module.exports = app;
