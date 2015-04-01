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
			            _id: '$status',
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


/**
 * Dashboard wheel
 */
exports.wheel = function(req, res) { 
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log('Connected correctly to server');
	  	var ips = db.collection('ips');
	  	ips.find({}).sort({ groupname: 1, site: 1, zone: 1, status: 1 }).toArray(function(err, result) {
	        	if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				} else {
					var _groupnames = [];
					var _sites = [];
					var _zones = [];
					var _entrances = [];

					var groupname;
					var site;
					var zone;

					var _jsondb = [];

					var cant_error;
					var cant_warning;
					var cant_success;

					var cant_zones_error;
					var cant_zones_warning;
					var cant_zones_success;
					
					var cant_site_error;
					var cant_site_warning;
					var cant_site_success;

					var cant_entrances;
					var cant_zones;
					var cant_sites;

					var colour_error = '#dd4b39';
					var colour_warning = '#f0ad4e';
					var colour_success = '#00a65a';
					var colour;
					for(var i=0; i < result.length; i++){
						if (i===0){
							//inicializa
							groupname=result[i].groupname;
							site=result[i].site;
							zone=result[i].zone;
						}


						
						if (zone!==result[i].zone) {
							var coloourzone;
							if (cant_error===cant_entrances){
								coloourzone = colour_error;
								cant_zones_error++;
							}else if (cant_success===cant_entrances){
								coloourzone = colour_success;
								cant_zones_success++;
							}else{
								coloourzone = colour_warning;
								cant_zones_warning++;
							}

							//--------agregar entrnces to zone
							_zones.push({'name': zone, 'colour': coloourzone, 'children': _entrances});
							cant_zones++;
							//--------reset entrances
							_entrances = [];
							cant_entrances=0;
							cant_error=0;
							cant_warning=0;
							cant_success=0;

							if (result[i].status==='error') {
								colour = colour_error;
								cant_error++;
							}else if (result[i].status==='warning') {
								colour = colour_warning;
								cant_warning++;
							}else{
								colour = colour_success;
								cant_success++;
							}

							_entrances.push({'name': result[i].entrance, 'colour': colour});
							cant_entrances++;

							zone=result[i].zone;
						}else{
							
							if (result[i].status==='error') {
								colour = colour_error;
								cant_error++;
							}else if (result[i].status==='warning') {
								colour = colour_warning;
								cant_warning++;
							}else{
								colour = colour_success;
								cant_success++;
							}


							_entrances.push({'name': result[i].entrance, 'colour': colour});
							cant_entrances++;
						}

						if (site!==result[i].site) {
							var colooursite;
							if (cant_zones_error===cant_zones){
								colooursite = colour_error;
								cant_site_error++;
							}else if (cant_zones_success===cant_zones){
								colooursite = colour_success;
								cant_site_success++;
							}else{
								colooursite = colour_warning;
								cant_site_warning++;
							}


							//--------agregar entrnces to site
							_sites.push({'name': site, 'colour': colooursite, 'children': _zones});
							cant_sites++;
							//--------reset entrances
							_zones = [];
							cant_zones=0;
							cant_zones_error=0;
							cant_zones_success=0;
							cant_zones_warning=0;
							site=result[i].site;
						}

						if (groupname!==result[i].groupname) {
							var coloourgroup;
							if (cant_site_error===cant_sites){
								colooursite = colour_error;
							}else if (cant_site_success===cant_sites){
								colooursite = colour_success;
							}else{
								colooursite = colour_warning;
							}


							//--------agregar entrnces to groupname
							_groupnames.push({'name': groupname, 'colour': coloourgroup, 'children': _sites});
							//--------reset entrances
							_sites = [];
							cant_sites=0;
							cant_site_warning=0;
							cant_site_success=0;
							cant_site_error=0;
							groupname=result[i].groupname;
						}

						if (i===result.length-1){
							_zones.push({'name': result[i].zone, 'colour': colour, 'children': _entrances});
							_sites.push({'name': result[i].site, 'colour': colour, 'children': _zones});
							_groupnames.push({'name': result[i].groupname, 'colour': colour, 'children': _sites});

							
						}
					}
					res.jsonp(_groupnames);
				}
				db.close();
			});
		
	});
};


/**
 * combogroup
 */
exports.combogroup = function(req, res) { 
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log('Connected correctly to server');
	  	var ips = db.collection('ips');
	  	ips.distinct('groupname',function(err, result) {
	  		if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}else{
				res.jsonp(result);
			}
			db.close();
	  	});
	});
}

/**
 * combosite
 */
exports.combosite = function(req, res) { 
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log('Connected correctly to server');
	  	var ips = db.collection('ips');
	  	ips.distinct('site', {groupname: req.query.groupname}, function(err, result) {
	  		
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}else{
				result.sort();
				res.jsonp(result);
			}

			db.close();
	  	});
	});
}


/**
 * combozone
 */
exports.combozone = function(req, res) { 
	// Use connect method to connect to the Server
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  console.log('Connected correctly to server');
	  	var ips = db.collection('ips');
	  	ips.distinct('zone', {groupname: req.query.groupname, site: req.query.site}, function(err, result) {
	  		
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			}else{
				result.sort();
				res.jsonp(result);
			}

			db.close();
	  	});
	});
}

exports.listWithParams = function(req, res) {
	var g = (req.params.param1 === '-- All --') ? '' : req.params.param1;
	var s = (req.params.param2 === '-- All --') ? '' : req.params.param2;
	var z = (req.params.param3 === '-- All --') ? '' : req.params.param3;


	var regexGroup = new RegExp(g, 'i');
	var regexSite = new RegExp(s, 'i');
	var regexZone = new RegExp(z, 'i');

    Ip.find()
    .and([
    		{ groupname: regexGroup }, 
    		{ site: regexSite },
    		{ zone: regexZone }
    	])
    .sort('-created').populate('user', 'displayName')
    .exec(function(err, ips) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        } else {
            res.jsonp(ips);
        }
    });
};
  