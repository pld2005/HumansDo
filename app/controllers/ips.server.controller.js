'use strict';

/**
 * Module dependencies.
 */
var MongoClient = require('mongodb').MongoClient,
 assert = require('assert');
// Connection URL
var url = 'mongodb://localhost/mra-dev';



var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Ip = mongoose.model('Ip'),
	_ = require('lodash');

/**
 * Create a Ip
 */
exports.create = function(req, res) {
	var ip = new Ip(req.body);
	ip.user = req.user;

	ip.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ip);
		}
	});
};

/**
 * Show the current Ip
 */
exports.read = function(req, res) {
	res.jsonp(req.ip);
};

/**
 * Update a Ip
 */
exports.update = function(req, res) {
	var ip = req.ip ;

	ip = _.extend(ip , req.body);

	ip.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ip);
		}
	});
};

/**
 * Delete an Ip
 */
exports.delete = function(req, res) {
	var ip = req.ip ;

	ip.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ip);
		}
	});
};

/**
 * List of Ips
 */
exports.list = function(req, res) { 
	Ip.find().sort('-created').populate('user', 'displayName').exec(function(err, ips) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(ips);
		}
	});
};

/**
 * Ip middleware
 */
exports.ipByID = function(req, res, next, id) { 
	Ip.findById(id).populate('user', 'displayName').exec(function(err, ip) {
		if (err) return next(err);
		if (! ip) return next(new Error('Failed to load Ip ' + id));
		req.ip = ip ;
		next();
	});
};

/**
 * Ip authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.ip.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};


/**
 * Cantidad de registridos agrupados
 */
exports.cantreg = function(req, res) { 
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log('Connected correctly to server');

	  	var ips = db.collection('ips');

		
	  	ips.aggregate([
			    {
			        $group: {
			            _id: "$status",
			            cantidad: { $sum : 1 }
			        }
			    }
			],function(err, result) {
	        	if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					res.jsonp(result);
				}
				db.close();
			});
		
	});
};
  