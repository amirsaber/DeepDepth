'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Graphtype Schema
 */
var GraphtypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Graphtype name',
		trim: true
	},
	script: {
		type: String,
		default: '',
		required: 'Please fill Graphtype script'
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

mongoose.model('Graphtype', GraphtypeSchema);