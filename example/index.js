/*
 * example/index.js - An example script.
 */

const gelato = require('../index.js')
const startPath = '/Users/egoscio/Desktop/MC/start.sh'
const mcServer = new gelato.minecraft.Server(startPath) // Change this according to your setup.

mcServer.start()
mcServer.on('data', (data) => {
  console.log(data)
})
