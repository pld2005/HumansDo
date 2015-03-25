'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Group Schema
 */
var GroupSchema = new Schema({
	groupname: {
		type: String,
		default: '',
		trim: true
	},
	site: {
		type: String,
		default: '',
		trim: true
	},
	servicesdown: {
		type: Number,
	},
	serviceswarning: {
		type: Number,
	},
	servicesonline: {
		type: Number,
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Group', GroupSchema);