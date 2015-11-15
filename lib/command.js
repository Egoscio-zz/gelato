/*
 * command.js - class for making commands.
 *
 * Options:
 *  - Admin: Define whether or not the command is for admins only.
 *  - Proxy: Define whether or not the command is for proxy only.
 *  - Name: Define a name for the command.
 *  - Alias: Define an array of aliases that would trigger the command.
 *  - Help: Define the help page for the command.
 *  - Function: Define the function to be be triggered.
 * makeHelp: Return
 */

'use strict';

class Command {
	constructor(options) {
		options = options || {};
		this.options = options;
		this.admin = typeof options.admin === 'boolean' && options.admin;
		this.proxy = typeof options.proxy === 'boolean' && options.proxy;
		this.name = options.name || 'Unknown';
		this.alias = typeof options.alias === 'object' && options.alias instanceof Array ? options.alias : [this.name.toLocaleLowerCase()];
		this.help = options.help || 'There is no help for this command.';
		this.function = typeof options.function === 'function' ? options.function : () => {};
	}

	makeHelp(template) {
		template = template && typeof template === 'string' || '';
		return template
			.replace('$name', this.name)
			.replace('$help', this.help);
	}

	static makeHelp(command, template) {
		if (command instanceof Command) {
			return command.makeHelp(template);
		} else {
			throw new Error('The argument "command" must be an instance of Command.');
		}
	}
}

module.exports = Command;