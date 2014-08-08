'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Fieldtype Schema
 */
var FieldtypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Fieldtype name',
		trim: true
	},
	description: {
		type: String,
		default: '',
		required: 'Please fill Fieldtype Desciption',
		trim: true
	},
	type: {
		type: String,
		enum: ['Integer', 'String', 'Boolean', 'Date'],
		required: 'Please select one of the Fieldtype types'
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

mongoose.model('Fieldtype', FieldtypeSchema);