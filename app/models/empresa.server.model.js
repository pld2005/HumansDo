'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Empresa Schema
 */
var EmpresaSchema = new Schema({
	nombre: {
		type: String,
		default: '',
		required: 'Please fill Empresa name',
		trim: true
	},	
	cuit: {
		type: String,
		default: '',
		required: 'Ingrese el CUIT',
		trim: true
	},
	domicilio: {
		type: String,
		default: '',
		trim: true
	},
	email: {
		type: String,
		default: '',
		trim: true
	},
	activo: {
		type: Boolean,
		default: false,
	},
	vigencia: {
		type: Date,
		required: 'Ingrese la fecha de caducidad de la licencia',
		default: Date.now
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

mongoose.model('Empresa', EmpresaSchema);