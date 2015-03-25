'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Devicetype = mongoose.model('Devicetype'),
	_ = require('lodash');

/**
 * Create a Devicetype
 */
exports.create = function(req, res) {
	var devicetype = new Devicetype(req.body);
	devicetype.user = req.user;

	devicetype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(devicetype);
		}
	});
};

/**
 * Show the current Devicetype
 */
exports.read = function(req, res) {
	res.jsonp(req.devicetype);
};

/**
 * Update a Devicetype
 */
exports.update = function(req, res) {
	var devicetype = req.devicetype ;

	devicetype = _.extend(devicetype , req.body);

	devicetype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(devicetype);
		}
	});
};

/**
 * Delete an Devicetype
 */
exports.delete = function(req, res) {
	var devicetype = req.devicetype ;

	devicetype.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(devicetype);
		}
	});
};

/**
 * List of Devicetypes
 */
exports.list = function(req, res) { 
	Devicetype.find().sort('-created').populate('user', 'displayName').exec(function(err, devicetypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(devicetypes);
		}
	});
};

/**
 * Devicetype middleware
 */
exports.devicetypeByID = function(req, res, next, id) { 
	Devicetype.findById(id).populate('user', 'displayName').exec(function(err, devicetype) {
		if (err) return next(err);
		if (! devicetype) return next(new Error('Failed to load Devicetype ' + id));
		req.devicetype = devicetype ;
		next();
	});
};

/**
 * Devicetype authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.devicetype.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
