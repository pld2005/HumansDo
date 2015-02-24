'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Empresa = mongoose.model('Empresa'),
	_ = require('lodash');

/**
 * Create a Empresa
 */
exports.create = function(req, res) {
	var empresa = new Empresa(req.body);
	empresa.user = req.user;

	empresa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(empresa);
		}
	});
};

/**
 * Show the current Empresa
 */
exports.read = function(req, res) {
	res.jsonp(req.empresa);
};

/**
 * Update a Empresa
 */
exports.update = function(req, res) {
	var empresa = req.empresa ;

	empresa = _.extend(empresa , req.body);

	empresa.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(empresa);
		}
	});
};

/**
 * Delete an Empresa
 */
exports.delete = function(req, res) {
	var empresa = req.empresa ;

	empresa.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(empresa);
		}
	});
};

/**
 * List of Empresas
 */
exports.list = function(req, res) { 
	Empresa.find().sort('-created').populate('user', 'displayName').exec(function(err, empresas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(empresas);
		}
	});
};

/**
 * Empresa middleware
 */
exports.empresaByID = function(req, res, next, id) { 
	Empresa.findById(id).populate('user', 'displayName').exec(function(err, empresa) {
		if (err) return next(err);
		if (! empresa) return next(new Error('Failed to load Empresa ' + id));
		req.empresa = empresa ;
		next();
	});
};

/**
 * Empresa authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.empresa.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
