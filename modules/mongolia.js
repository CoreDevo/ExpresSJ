/**
 * Created by JyaouShingan on 2016-05-13.
 */
var Mongolia = function (room, output) {
	var self = this;
	var database = null;
	var collection = null;
	var mongo = require('mongodb');
	this.resultCallback = output;

	mongo.connect('mongodb://localhost:27017/PrivateRooms', function (err, db) {
		if (err) {
			self.resultCallback(err);
		}
		database = db;
		collection = db.collection(room);
	});

	const Instructions = {
		'set': {
			name:'set',
			start: function () {
				self.state = State.PARAM;
				self.command = Command.SET;
			},
			params: function (param) {
				console.log('Mongolia: Check SET param: ' + param);
				if (param === 'm') {
					self.mode = this.mode.MULTI
				} else {
					self.error = "Invalid parameter " + param + " for command SET";
					self.state = State.ERROR;
					return;
				}
				self.state = State.EXPR;
			},
			process: function (content, finished) {
				var ins = this;
				if(self.mode === ins.mode.MULTI && content.toLowerCase() === 'end') {
					self.state = State.STANDBY;
					finished();
					return;
				}
				var pair = content.split(/[ ]*:[]*/);
				if (pair.length !== 2) {
					self.error = "Syntax Error. Missing \':\' or multiple \':\'";
					self.state = State.ERROR;
				}
				collection.update({'key' : pair[0]}, {'key':pair[0],'value':pair[1]},{'upsert':true}, function (err, res) {
					if (err) {
						self.error = err;
						self.state = State.ERROR;
						finished();
						return;
					} else {
						self.state = (self.mode === ins.mode.MULTI) ? State.EXPR : State.STANDBY;
					}
					finished();
				});
			},
			mode: {
				NORMAL: 0,
				MULTI: 1
			}
		},
		'get': {
			name:'get',
			start: function () {
				self.state = State.PARAM;
				self.command = Command.GET;
			},
			params: function (param) {
				if (param === 'm') {
					self.mode = this.mode.MULTI
				} else {
					self.error = "Invalid parameter " + param + " for command SET";
					self.state = State.ERROR;
					return;
				}
				self.state = State.EXPR;
			},
			process: function (content, finished) {
				var ins = this;
				collection.find({'key':content}, {'value':true}).toArray(function(err, result){
					if(err) {
						self.error = err;
						self.state = State.ERROR;
						finished();
						return;
					}
					console.log(result);
					if (result.length === 0) {
						self.resultCallback("Warn: No result found");
					} else {
						self.resultCallback(result[0]['value']);
					}
					self.state = (self.mode === ins.mode.MULTI) ? State.EXPR : State.STANDBY;
					finished()
				});
			},
			mode: {
				NORMAL: 0,
				MULTI: 1
			}
		},
		'sudo': {
			name: 'sudo',
			start: function () {
				self.state = State.EXPR;
			}
		},
		'list': {
			name:'list',
			start: function () {
				self.state = State.PARAM;
				self.command = Command.LIST;
			}
		},
		'end': {
			name: 'end',
			start: function () {
				self.state = State.STANDBY;
			}
		}
	};

	const Parameters = {
		'set': ['m'],
		'get': ['m'],
		'sudo': [],
		'list': ['a']
	};

	const State = {
		STANDBY: 0,
		PARAM: 1,
		EXPR: 2,
		ERROR: 3
	};

	const Command = {
		SET: 'set',
		GET: 'get',
		LIST: 'list',
		SUDO: 'sudo'
	};

	this.state = State.STANDBY;
	this.command = null;
	this.mode = null;
	var grandPermission = false;
	this.error = null;

	this.consume = function (instruction) {
		console.log('Mongolia: recevied command: ' + instruction);
		var tokens = instruction.split(/[ ]+/).reverse();
		console.log('Mongolia: Tokens - ' + tokens);
		try {
			var processNext = function () {
				if (self.error) {
					self.resultCallback(self.error);
					self.error = null;
					self.state = State.STANDBY;
					return;
				}
				if (tokens.length > 0) {
					processToken(tokens.pop(), processNext);
				}
			};
			processNext();
		} catch (e) {
			self.state = State.STANDBY;
			console.log(e);
			this.resultCallback(e);
		}
	};

	var processToken = function (token, next) {
		console.log('Mongolia: Processing token:' + token + ' under state ' + self.state);
		switch (self.state) {
			case State.STANDBY:
				var instruction = Instructions[token.toLowerCase()];
				if (!instruction) {
					self.error = "Invalid command " + token;
					self.state = State.ERROR;
					next();
					return;
				}
				var inst_name = instruction.name;
				Instructions[inst_name].start();
				next();
				break;
			case State.PARAM:
				if (token.substring(0, 1) === '-') {
					Instructions[self.command].params(token.substr(1));
					self.state = State.EXPR;
					next();
				} else {
					self.state = State.EXPR;
					processToken(token, next);
				}
				break;
			case State.EXPR:
				Instructions[self.command].process(token, next);
				break;
			case State.ERROR:
				throw "Unknown error occurred";
				break;
		}
	}
};
module.exports = Mongolia;