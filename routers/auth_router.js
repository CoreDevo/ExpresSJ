/**
 * Created by JyaouShingan on 2016-05-13.
 */

var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

router.post('/register', function(req, res, next){
	console.log('New Register Request: ' + req.body.username);
	next();
});