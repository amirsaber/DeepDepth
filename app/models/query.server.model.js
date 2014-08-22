'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	ValidationError = require('mongoose/lib/error/validation'),
	ValidatorError = require('mongoose/lib/error/validator'),
	Fieldtype = mongoose.model('Fieldtype'),
	Jobtype = mongoose.model('Jobtype'),
	request = require('request'),
	config = require('../../config/config');


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
		trim: true,
		unique: true
	},
	job: {
		type: Schema.Types.ObjectId,
		ref: 'Jobtype',
		required: 'Please select a Job Type'
	},
	fields: {
		type: [Schema.Types.Mixed],
	},
	dbJobId: {
		type: String,
		default: ''
	},
	status: {
		type: String,
		default: 'queued'
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

//More complex validation for fields
QuerySchema.pre('save', function(next) {
	var thisQuery = this,
		validated = true,
		error = new ValidationError(thisQuery);
	error.errors.fields = new ValidatorError('fields', 'Please fill all the fields', thisQuery.fields);

	mongoose.model('Jobtype').findById(thisQuery.job).exec(function(err, query) {
		if (err) {
			validated = false;
		}
		else if (query.fields.length !== thisQuery.fields.length) {
			validated = false;
		}
		else {
			thisQuery.fields.forEach(function(element) {
				if (element === null || element === '') {
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

//Generate the query and send it to database
QuerySchema.pre('save', function(next) {
	var thisQuery = this,
		error = new ValidationError(thisQuery);
	Jobtype.populate(thisQuery, {
		path: 'job',
		model: 'Jobtype'
	}, function(err, query) {
		if (err) {
			error.errors.job = new ValidatorError('job', 'Can\'t get job', thisQuery.job);
			next(err);
		}
		else {
			Fieldtype.populate(query, {
				path: 'job.fields',
				model: 'Fieldtype'
			}, function(err, query) {
				if (err) {
					error.errors.job_fields = new ValidatorError('job_fields', 'Can\'t get job fields', query.job.fields);
					next(err);
				}
				else {
					var dbQuery = query.job.queryPattern;
					for (var i = 0; i < query.job.fields.length; i++) {
						dbQuery = dbQuery.replace('{{' + query.job.fields[i].name + '}}', query.fields[i]);
					}
					request({
						uri: query.job.address,
						method: 'POST',
						headers: {
							'AUTHORIZATION': 'TD1 ' + config.td
						},
						form: {
							//TODO: Put it into job type
							database: 'twitter_db',
							query: dbQuery
						}
					}, function(error, response, body) {
						if (err) {
							error.errors.dbJobId = new ValidatorError('dbJobId', 'Can\'t get db job id', query.dbJobId);
							next(err);
						}
						else {
							body = JSON.parse(body);
							thisQuery.dbJobId = body.job_id;
							next();
						}
					});
				}
			});
		}
	});
});


mongoose.model('Query', QuerySchema);