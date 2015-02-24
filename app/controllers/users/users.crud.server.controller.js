'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('../errors.server.controller'),
	ManagmentUser = mongoose.model('User'),
	_ = require('lodash');



/**
 * Show the current Personal
*/ 
exports.read = function(req, res) {
	res.jsonp(req.managmentuser);
};

/**
 * Update user details
 */
exports.adminUpdate = function(req, res) {
	// Init Variables


	
	var user = req.managmentuser;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	//delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				res.json(user);
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};
 /* Delete an Personal
 
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
};*/

/**
 * List of Personals
 */
exports.list = function(req, res) { 
	ManagmentUser.find().sort('-created').populate('empresa', 'nombre').exec(function(err, users) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(users);
		}
	});
};


exports.getUser = function(req, res, next, id) { 
	
	ManagmentUser.findById(id).populate('empresa', 'nombre').exec(function(err, managmentuser) {
		if (err) return next(err);
		if (! managmentuser) return next(new Error('Failed to load managmentuser ' + id));
		req.managmentuser = managmentuser ;
		next();
	});
};
/**
 * Personal authorization middleware
*/
exports.isSuperadmin = function(req, res, next) {
	var role = ['admin'];
	if (!req.isAuthenticated()) {
		return res.status(401).send({
			message: 'User is not logged in'
		});
	}
	
	if (!_.intersection(req.user.roles, role).length){
        return res.status(401).send({
			message: 'User does not have a '+ role[0] +' role',
			redirectTo: '/'
		});
	}
 
	next();
}; 

