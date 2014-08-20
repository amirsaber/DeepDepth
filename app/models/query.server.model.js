'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ValidationError = require('mongoose/lib/error/validation'),
	ValidatorError = require('mongoose/lib/error/validator');

/**
 * Validation functions
 */
var validateFields = function(value) {
	console.log(value);
	return true;
};

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
	job: {
		type: Schema.Types.ObjectId,
		ref: 'Jobtype',
		required: 'Please select a Job Type'
	},
	fields: {
		type: [Schema.Types.Mixed],
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

QuerySchema.pre('save', function(next) {
	var validated = true;
	var error = new ValidationError(this);
	var fields = this.fields;
	error.errors.fields = new ValidatorError('fields', 'Please fill all the fields', fields);

	mongoose.model('Jobtype').findById(this.job).exec(function(err, query) {
		if (err) {
			validated = false;
		}
		else if (query.fields.length !== fields.length) {
			validated = false;
		}
		else {
			fields.forEach(function(element) {
				if (element === null) {
					validated = false;
				}
			});
		}
		if (validated) {
			next();
		}
		else {
			console.log(false);
			next(error);
		}
	});
});

mongoose.model('Query', QuerySchema);