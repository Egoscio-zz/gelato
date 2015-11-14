// proxy.js

'use strict';

var mc = require('minecraft-protocol');

class Proxy extends mc.createServer {
	constructor(options) {
		super({
			'online-mode': options['online-mode'],
			port: options.proxyPort,
			keepAlive: options.keepAlive,
			version: options.version
		});
		this.clients = [];
		this.offlineToOnline = {};
		this
			.on('login', (client) => {
				this.clients.push(client);
				var endedClient = false
				,	endedTargetClient = false
				,	clientIP = client.socket.remoteAddress
				;
				client
					.on('end', () => {
						endedClient = true;
						console.log(`Connection closed by client (${clientIP})`);
						if (!endedTargetClient) targetClient.end('End');
					})
					.on('error', () => {
						console.log(`Connection error by client (${clientIP})`);
					})
					.on('packet', (data, meta) => {
						if (targetClient.state === mc.states.PLAY &&
							meta.state === mc.states.PLAY &&
							!endedTargetClient) {
							targetClient.write(meta.name, data);
						}
					});
					
				var targetClient = mc.createClient({
					username: client.username,
					host: options.serverHost,
					port: options.serverPort,
					keepAlive: options.keepAlive,
					version: options.version
				});
				
				targetClient
					.on('login', (meta, data) => {
						this.offlineToOnline[targetClient.uuid] = client.uuid;
						if (meta.name === 'player_info') {
							data.data.forEach((player) => {
								player.UUID = this.offlineToOnline[player.UUID];
								if (data.action === 0) {
									player.properties = this.clients.filter(client => client.username === player.name)[0].profile.properties.map((property) => ({
										name: property.name,
										value: property.value,
										isSigned: true,
										signature: property.signature
									}));
								}
							});
						}
					})
					.on('packet', (data, meta) => {
						if (meta.state == mc.states.PLAY &&
							client.state == mc.states.PLAY &&
							!endedClient) {
							if (meta.name==='player_info') {
								data.data.forEach((player) => {
									player.UUID = this.offlineToOnline[player.UUID];
									if (data.action === 0) {
										player.properties = client.profile.properties.map((property) => ({
											name: property.name,
											value: property.value,
											isSigned: true,
											signature: property.signature
										}));
									}
								});
							} else if (meta.name==='named_entity_spawn') {
								data.playerUUID = this.offlineToOnline[data.playerUUID];
							}
							client.write(meta.name, data);
						}
					})
					.on('end', () => {
						endedTargetClient = true;
						console.log(`Connection closed by server (${clientIP})`);
						if (!endedClient) client.end('End');
						this.clients.splice(this.clients.indexOf(client), 1);
					})
					.on('error', (err) => {
						endedTargetClient = true;
						console.log(`Connection closed by server (${clientIP})`);
						console.log(err.stack);
						if (!endedClient) client.end('Error');
					});
			});
	}
}

module.exports = Proxy;