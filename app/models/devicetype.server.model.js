'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Devicetype Schema
 */
var DevicetypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Devicetype name',
		trim: true
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

mongoose.model('Devicetype', DevicetypeSchema);