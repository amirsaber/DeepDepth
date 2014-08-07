'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Jobtype Schema
 */
var JobtypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Jobtype name',
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

mongoose.model('Jobtype', JobtypeSchema);