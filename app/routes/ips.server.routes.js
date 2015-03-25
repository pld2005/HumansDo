'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var ips = require('../../app/controllers/ips.server.controller');

	// Ips Routes
	app.route('/ips')
		.get(ips.list, ips.cantreg)
		.post(users.requiresLogin, ips.create);

app.route('/cantreg')
		.get(ips.cantreg);

	app.route('/ips/:ipId')
		.get(ips.read)
		.put(users.requiresLogin, ips.hasAuthorization, ips.update)
		.delete(users.requiresLogin, ips.hasAuthorization, ips.delete);

	// Finish by binding the Ip middleware
	app.param('ipId', ips.ipByID);
};
