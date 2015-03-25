'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var devicetypes = require('../../app/controllers/devicetypes.server.controller');

	// Devicetypes Routes
	app.route('/devicetypes')
		.get(devicetypes.list)
		.post(users.requiresLogin, devicetypes.create);

	app.route('/devicetypes/:devicetypeId')
		.get(devicetypes.read)
		.put(users.requiresLogin, devicetypes.hasAuthorization, devicetypes.update)
		.delete(users.requiresLogin, devicetypes.hasAuthorization, devicetypes.delete);

	// Finish by binding the Devicetype middleware
	app.param('devicetypeId', devicetypes.devicetypeByID);
};
