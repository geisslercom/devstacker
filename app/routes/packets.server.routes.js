'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var packets = require('../../app/controllers/packets.server.controller');

	// Packets Routes
	app.route('/packets')
		.get(packets.list)
		.post(users.requiresLogin, packets.create);
/*
	app.route('/packets/:packetId')
		.get(packets.read)
		.put(users.requiresLogin, packets.hasAuthorization, packets.update)
		.delete(users.requiresLogin, packets.hasAuthorization, packets.delete);
*/
	app.route('/packets/gen')
		.post(packets.gen);
	// Finish by binding the Packet middleware
	app.param('packetId', packets.packetByID);
};
