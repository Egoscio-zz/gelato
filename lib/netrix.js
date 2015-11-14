// netrix.js

'use strict';

var crypto = require('crypto')
,	net = require('net')
;

function logger() {
	if (this.verbose) console.log.apply(console, arguments);
}

function toArray(object) {
	return Array.prototype.slice.call(object);
}

function set() {
	var args = toArray(arguments);
	if (args.length === 1 && args[0] instanceof Object) {
		var obj = args[0]
		,	keys = Object.keys(obj)
		,	len = keys.length
		,	i;
		for (i = 0; i < len; i++) {
			this[keys[i]] = obj[keys[i]];
		}
	} else if (args.length === 2) {
		this[args[0]] = args[1];
	}
	return this;
}

function get() {
	var args = toArray(arguments);
	if (args.length === 1) {
		return this[args[0]];
	} else {
		var obj = {}
		,	len = args.length
		,	i;
		for (i = 0; i < len; i++) {
			obj[args[i]] = this[args[i]];
		}
		return obj;
	}
}

function sInit(socket) {
	socket.id = crypto.randomBytes(5).toString('hex');
	if (this.encoding) socket.setEncoding(this.encoding);
	var log = logger.bind(this);
	socket
		.on('connect', () => {
			log(`${socket.id} connected to ${toArray(this.params).reduce((a, b) => `${b}, ${a}`)}.`);
			this.onSocketOpen(socket);
		})
		.on('data', (data) => {
			log(`${socket.id} recieved "${data.toString().trim()}" from data event.`);
			this.onData(data);
		})
		.on('end', () => {
			log(`${socket.id} ended.`);
		})
		.on('error', (err) => {
			log(`${socket.id} closed with "${err}" from error event.`);
		})
		.on('close', (err) => {
			log(`${socket.id} ${err ? 'crashed' : 'closed'}.`);
			this.onSocketClose(socket);
			if (this.sockets && this.sockets instanceof Array) this.sockets.splice(this.sockets.indexOf(socket), 1);
		});
}

class Server extends net.Server {
	constructor() {
		super();
		this.params = arguments;
		this.encoding = false;
		this.verbose = false;
		this.onData = function() {};
		this.onClose = function() {};
		this.onConnection = function() {};
		this.onSocketOpen = function() {};
		this.onSocketClose = function() {};
		this.sockets = [];
		var log = logger.bind(this);
		this
			.on('listening', () => {
				log(`Hub listening to ${toArray(this.params).reduce((a, b) => `${b}, ${a}`)}.`);
			})
			.on('connection', (socket) => {
				this.sockets.push(socket);
				sInit.call(this, socket);
				log(`Socket ${socket.id} connected to hub.`);
				this.onConnection(socket);
			})
			.on('error', (err) => {
				log(`Hub closed with ${err} from error event.`);
			})
			.on('close', (err) => {
				log(`Hub ${err ? 'crashed' : 'closed'}.`);
				this.onClose();
			});
	}
	
	set() {
		return set.apply(this, arguments);
	}
	
	get() {
		return get.apply(this, arguments);
	}
	
	start() {
		this.sockets = [];
		this.listen.apply(this, this.params);
		return this;
	}
	
	stop() {
		this.close();
		this.doAll(() => {
			this.destroy();
		});
		this.sockets = [];
		return this;
	}
	
	doAll(fn) {
		var i
		,	len = this.sockets.length;
		for (i = 0; i < len; i++) {
			fn.call(this, this.sockets[i]);
		}
		return this;
	}
}

class Client extends net.Socket {
	constructor() {
		super();
		this.params = arguments;
		this.encoding = false;
		this.verbose = false;
		this.onData = function() {};
		this.onSocketOpen = function() {};
		this.onSocketClose = function() {};
		sInit.call(this, this);
	}
	
	set() {
		return set.apply(this, arguments);
	}
	
	get() {
		return get.apply(this, arguments);
	}
	
	start() {
		this.connect.apply(this, this.params);
		return this;
	}
}

module.exports = {
	Server: Server,
	Client: Client,
	utils: {
		logger: logger,
		toArray: toArray,
		set: set,
		get: get,
		sInit: sInit
	}
};