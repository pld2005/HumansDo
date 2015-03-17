'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Personal = mongoose.model('Personal'),
	_ = require('lodash');

/**
 * Create a Personal
 */
exports.create = function(req, res) {
	var personal = new Personal(req.body);
	personal.user = req.user;

	personal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(personal);
		}
	});
};

/**
 * Show the current Personal
 */
exports.read = function(req, res) {
	res.jsonp(req.personal);
};

/**
 * Update a Personal
 */
exports.update = function(req, res) {
	var personal = req.personal ;

	personal = _.extend(personal , req.body);

	personal.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(personal);
		}
	});
};

/**
 * Delete an Personal
 */
exports.delete = function(req, res) {
	var personal = req.personal ;

	personal.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(personal);
		}
	});
};

/**
 * List of Personals
 */
exports.list = function(req, res) { 
	Personal.find().sort('-created').populate('user', 'displayName').exec(function(err, personals) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(personals);
		}
	});
};

/**
 * Personal middleware
 */
exports.personalByID = function(req, res, next, id) { 
	Personal.findById(id).populate('user', 'displayName').exec(function(err, personal) {
		if (err) return next(err);
		if (! personal) return next(new Error('Failed to load Personal ' + id));
		req.personal = personal ;
		next();
	});
};

/**
 * Personal authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	var role = ['superadmin'];
	
	if (!_.intersection(req.user.roles, role).length){
		if (req.personal.user.id !== req.user.id) {
			return res.status(403).send('User is not authorized');
		}
	}
	next();
};
