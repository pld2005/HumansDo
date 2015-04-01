'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var ips = require('../../app/controllers/ips.server.controller');

	// Ips Routes
	app.route('/ips')
		.get(users.requiresLogin, ips.list, ips.cantreg)
		.post(users.requiresLogin, ips.create);

	app.route('/cantreg')
		.get(users.requiresLogin, ips.cantreg);
	app.route('/wheel')
		.get(users.requiresLogin, ips.wheel);
	app.route('/comboGroup')
		.get(users.requiresLogin, ips.combogroup);
	app.route('/comboSite')
		.get(users.requiresLogin, ips.combosite);
	app.route('/comboZone')
		.get(users.requiresLogin, ips.combozone);
	app.route('/ips/:param1/:param2/:param3')
    	.get(ips.listWithParams);

	app.route('/ips/:ipId')
		.get(ips.read)
		.put(users.requiresLogin, ips.hasAuthorization, ips.update)
		.delete(users.requiresLogin, ips.hasAuthorization, ips.delete);

	// Finish by binding the Ip middleware
	app.param('ipId', ips.ipByID);
};
