/*
 * minecraft.js - Library for creating the Minecraft Server instance and User instances.
 *
 * Server: A class that creates a minecraft server with events.
 *	- Start: Start the server.
 *	- Write: Write to the server console.
 *  - Stop: Stop the server.
 *  - Emits "start" when the minecraft server has started.
 *  - Emits "data" when data is recieved from the minecraft server.
 *  - Emits "write" when the write function is called.
 *	- Emits "stop" when the stop function is called.
 */

'use strict';

var childProcess = require('child_process')
,	EventEmitter = require('events').EventEmitter
;

class Server extends EventEmitter {
	constructor(jarPath) {
		super();
		if (jarPath && typeof jarPath === 'string') {
			this.jarPath = jarPath;
		} else {
			throw new Error('jarPath argument is required and must be a string.');
		}
		this.minecraftServer = {};
	}

	start() {
		this.minecraftServer = childProcess.spawn(this.jarPath);
		this.minecraftServer.stdin.setEncoding('utf8');
		this.minecraftServer.stdout.setEncoding('utf8');
		this.minecraftServer.stderr.setEncoding('utf8');
		this.minecraftServer.stdout.on('data', onData);
		this.minecraftServer.stderr.on('data', onData);
		var buffer = '';
		function onData(data) {
			buffer += data;
			var lines = buffer.split('\n')
			,	len = lines.length - 1
			,	i;
			for (i = 0; i < len; i++) {
				onLine(data);
			}
			buffer = lines[lines.length - 1];
		}
		function onLine(line) {
			this.emit('data', line);
		}
		this.emit('start');
	}

	write(line) {
		if (typeof this.minecraftServer.write === 'function') {
			this.minecraftServer.write(`${line}\n`);
		}
		this.emit('write');
	}

	stop() {
		if (typeof this.minecraftServer.kill === 'function') {
			this.minecraftServer.kill();
		}
		this.minecraftServer = {};
		this.emit('stop');
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
};