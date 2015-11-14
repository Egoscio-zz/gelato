// minecraft.js

'use strict';

var config = require('../config.json')
,	childProcess = require('child_process')
,	$ = require('./toolbox.js')
;

function Server(onLine) {
	var server = childProcess.spawn($.serverFile(config.serverExec))
	,	buffer = '';
	server.stdin.setEncoding('utf8');
	server.stdout.setEncoding('utf8');
	server.stderr.setEncoding('utf8');
	server.stdout.on('data', onData);
	server.stderr.on('data', onData);
	function onData(data) {
		buffer += data;
		var lines = buffer.split('\n')
		,	len = lines.length - 1
		,	i;
		for (i = 0; i < len; i++) {
			onLine(lines[i]);
		}
		buffer = lines[lines.length - 1];
	}
}

class Player {
	constructor(name) {
		this.name = name;
		this.isAdmin = false;
	}

	set admin(value) {
		this.isAdmin = !!value;
	}

	get admin() {
		return this.isAdmin;
	}
}

module.exports = {
	Server: Server,
	Player: Player
}