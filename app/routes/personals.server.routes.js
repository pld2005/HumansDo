'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var personals = require('../../app/controllers/personals.server.controller');

	// Personals Routes
	app.route('/personals')
		.get(personals.list)
		.post(users.requiresLogin, personals.create);

	app.route('/personals/:personalId')
		.get(personals.read)
		.put(users.requiresLogin, personals.hasAuthorization, personals.update)
		.delete(users.requiresLogin, personals.hasAuthorization, personals.delete);

	// Finish by binding the Personal middleware
	app.param('personalId', personals.personalByID);
};
