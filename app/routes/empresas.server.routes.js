'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var empresas = require('../../app/controllers/empresas.server.controller');

	// Empresas Routes
	app.route('/empresas')
		.get(empresas.list)
		.post(users.requiresLogin, empresas.create);

	app.route('/empresas/:empresaId')
		.get(empresas.read)
		.put(users.requiresLogin, empresas.hasAuthorization, empresas.update)
		.delete(users.requiresLogin, empresas.hasAuthorization, empresas.delete);

	// Finish by binding the Empresa middleware
	app.param('empresaId', empresas.empresaByID);
};
