'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Ip Schema
 */
var IpSchema = new Schema({
		groupname: {type: String},
		ip: {type: String},
		status: {type: String},	
		statusping: {type: String},	
		site: {type: String},	
		zone: {type: String},	
		entrance: {type: String},
		devicetype: {type: String},
		devicekey: {type: String},
		entrancekey: {type: String},
		lastin: {type: String},	
		lastout: {type: String},
		lastcount: {type: Date},
		lastvisitas: {type: Date},
		lastpint: {type: Date},
		lastpingsuccess: {type: Date},
		firstdata: {type: Date},
		uptimeminutes: {type: Number},
		uptime: {type: String},
		ttl: {type: String},
		roundtrip: {type: String},
		buffer: {type: String},
		created: {type: Date, default: Date.now},
		user: {
			type: Schema.ObjectId,
			ref: 'User'
		}
});

mongoose.model('Ip', IpSchema);