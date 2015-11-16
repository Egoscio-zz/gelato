/*
 * example/index.js - An example script.
 */

var gelato = require('../index.js')
,	mcServer = new gelato.minecraft.Server('/Users/egoscio/Desktop/MC/srv/start.sh');

mcServer.start();
mcServer.on('data', (data) => { console.log(data) });