'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Validation functions
 */
var validateArrayLength = function(value) {
	return value.length > 0;
};

/**
 * Jobtype Schema
 */
var JobtypeSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Job Type name',
		trim: true,
		unique: true
	},
	address: {
		type: String,
		default: '',
		required: 'Please fill Job Type address',
		trim: true
	},
	fields: [{
		type: Schema.Types.ObjectId,
		ref: 'Fieldtype'
	}],
	graphs: [{
		type: Schema.Types.ObjectId,
		ref: 'Graphtype'
	}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Jobtype', JobtypeSchema).schema.path('fields').validate(validateArrayLength, 'Please add at least one field');
mongoose.model('Jobtype', JobtypeSchema).schema.path('graphs').validate(validateArrayLength, 'Please add at least one graph');