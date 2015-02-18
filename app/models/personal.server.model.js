'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Personal Schema
 */
var PersonalSchema = new Schema({
	legajo: {
		type: String,
		default: '',
		required: 'Ingrese el Nr. de Legajo',
		trim: true
	},
	nombre: {
		type: String,
		default: '',
		required: 'Ingrese el nombre',
		trim: true
	},
	dni: {
		type: String,
		default: '',
		required: 'Ingrese el nro de documento de identidad',
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

mongoose.model('Personal', PersonalSchema);