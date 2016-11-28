/*
 * votifier.js - Class for creating a minecraft votifier.
 * Only tested with MCSL, but should work with any server list.
 */

const EventEmitter = require('events').EventEmitter
const netrix = require('./netrix.js')
const ursa = require('ursa')

class Votifier extends EventEmitter {
  constructor (privateKey, host, port) {
    super()
    this.host = host || '0.0.0.0'
    this.port = port || 8192
    this.key = ursa.createPrivateKey(privateKey)
    this.connection = {}
  }

  start () {
    this.connection = new netrix.Server(this.host, this.port)
    this.connection
      .set({
        verbose: true,
        encoding: 'utf8',
        onData: (data) => {
          const vote = this.key.decrypt(data, 'utf8', 'utf8', ursa.RSA_PKCS1_PADDING).split('\n').slice(0, 5)
          this.emit('vote', vote)
        }
      })
    this.emit('start')
  }

  stop () {
    this.connection.stop()
    this.emit('stop')
  }
}

module.exports = Votifier
