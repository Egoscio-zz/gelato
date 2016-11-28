/*
 * toolbox.js - A few useful functions.
 */

'use strict'

const path = require('path')
const fs = require('fs')

function random (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function extend (target, object) {
  const keys = Object.keys(object)
  const len = keys.length
  for (let i = 0; i < len; i++) {
    target[keys[i]] = object[keys[i]]
  }
}

function applyNew (constructor, array) {
  const args = [null].concat(array)
  const Func = constructor.bind.apply(constructor, args)
  return new Func()
}

function callNew (constructor) {
  const Func = constructor.bind.apply(constructor, arguments)
  return new Func()
}

function serverFile (serverPath, file) {
  return path.join.apply({}, Array.prototype.concat(serverPath, file))
}

function loadJSON (file, cb) {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      throw err
    }
    try {
      data = JSON.parse(data)
    } catch (e) {
      console.log(`loadJSON: Failed to parse ${file}`)
    }
    if (cb && typeof cb === 'function') {
      cb(data)
    }
  })
}

module.exports = {
  random: random,
  extend: extend,
  applyNew: applyNew,
  callNew: callNew,
  serverFile: serverFile,
  loadJSON: loadJSON
}
