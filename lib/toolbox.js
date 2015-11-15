/*
 * toolbox.js - A few useful functions.
 */

'use strict';

var path = require('path')
,	fs = require('fs')
;

function random(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function extend(target, object) {
	var keys = Object.keys(object)
	,	len = keys.length
	,	i;
	for (i = 0; i < len; i++) {
		target[keys[i]] = object[keys[i]];
	}
}

function applyNew(constructor, array) {
	var args = [null].concat(array)
	,	func = constructor.bind.apply(constructor, args);
	return new func();
}

function callNew(constructor) {
	var func = constructor.bind.apply(constructor, arguments);
	return new func();
}

function serverFile(serverPath, file) {
	return path.join.apply({}, Array.prototype.concat(serverPath, file));
}

function loadJSON(file, cb) {
	fs.readFile(file, 'utf8', function(err, data) {
		if (err) throw err;
		try {
			data = JSON.parse(data);
		} catch(e) {
			console.log(`loadJSON: Failed to parse ${file}`);
		}
		if (cb && typeof cb === 'function') cb(data);
	});
}

module.exports = {
	random: random,
	extend: extend,
	applyNew: applyNew,
	callNew: callNew,
	serverFile: serverFile,
	loadJSON: loadJSON
};