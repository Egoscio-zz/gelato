/*
 * proxy.js - Library for setting up a Minecraft server proxy.
 */

'use strict'

var mc = require('minecraft-protocol')

function isPlay (obj) {
  return obj.state === mc.states.PLAY
}

class Proxy extends mc.createServer {
  constructor (options) {
    options = options || {}
    super({
      'online-mode': typeof options.onlineMode === 'boolean' ? options.onlineMode : true,
      host: options.host || '127.0.0.1',
      port: options.proxyPort || '25565',
      keepAlive: typeof options.keepAlive === 'boolean' ? options.keepAlive : false,
      version: options.version || '1.8'
    })
    this.clients = []
    this.offlineToOnline = {}
    this
      .on('login', (client) => {
        this.clients.push(client)
        var endedClient = false
        var endedTargetClient = false
        var clientIP = client.socket.remoteAddress

        client
          .on('end', () => {
            endedClient = true
            console.log(`Connection closed by client (${clientIP})`)
            if (!endedTargetClient) targetClient.end('End')
          })
          .on('error', () => {
            console.log(`Connection error by client (${clientIP})`)
          })
          .on('packet', (data, meta) => {
            if (isPlay(targetClient) && isPlay(meta) && !endedTargetClient) {
              targetClient.write(meta.name, data)
            }
          })

        var targetClient = mc.createClient({
          username: client.username,
          host: options.serverHost,
          port: options.serverPort,
          keepAlive: options.keepAlive,
          version: options.version
        })

        targetClient
          .on('login', (meta, data) => {
            this.offlineToOnline[targetClient.uuid] = client.uuid
            if (meta.name === 'player_info') {
              data.data.forEach((player) => {
                player.UUID = this.offlineToOnline[player.UUID]
                if (data.action === 0) {
                  player.properties = this.clients.filter(client => client.username === player.name)[0].profile.properties.map((property) => ({
                    name: property.name,
                    value: property.value,
                    isSigned: true,
                    signature: property.signature
                  }))
                }
              })
            }
          })
          .on('packet', (data, meta) => {
            if (isPlay(meta) && isPlay(client) && !endedClient) {
              if (meta.name === 'player_info') {
                data.data.forEach((player) => {
                  player.UUID = this.offlineToOnline[player.UUID]
                  if (data.action === 0) {
                    player.properties = client.profile.properties.map((property) => ({
                      name: property.name,
                      value: property.value,
                      isSigned: true,
                      signature: property.signature
                    }))
                  }
                })
              } else if (meta.name === 'named_entity_spawn') {
                data.playerUUID = this.offlineToOnline[data.playerUUID]
              }
              client.write(meta.name, data)
            }
          })
          .on('end', () => {
            endedTargetClient = true
            console.log(`Connection closed by server (${clientIP})`)
            if (!endedClient) client.end('End')
            this.clients.splice(this.clients.indexOf(client), 1)
          })
          .on('error', (err) => {
            endedTargetClient = true
            console.log(`Connection closed by server (${clientIP})`)
            console.log(err.stack)
            if (!endedClient) client.end('Error')
          })
      })
  }
}

module.exports = Proxy
