'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Query Schema
 */
var QuerySchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Query name',
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

mongoose.model('Query', QuerySchema);