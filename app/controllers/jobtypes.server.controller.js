'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Jobtype = mongoose.model('Jobtype'),
	_ = require('lodash');

/**
 * Create a Jobtype
 */
exports.create = function(req, res) {
	var jobtype = new Jobtype(req.body);
	jobtype.user = req.user;

	jobtype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobtype);
		}
	});
};

/**
 * Show the current Jobtype
 */
exports.read = function(req, res) {
	res.jsonp(req.jobtype);
};

/**
 * Update a Jobtype
 */
exports.update = function(req, res) {
	var jobtype = req.jobtype ;

	jobtype = _.extend(jobtype , req.body);

	jobtype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobtype);
		}
	});
};

/**
 * Delete an Jobtype
 */
exports.delete = function(req, res) {
	var jobtype = req.jobtype ;

	jobtype.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobtype);
		}
	});
};

/**
 * List of Jobtypes
 */
exports.list = function(req, res) { Jobtype.find().sort('-created').populate('user', 'displayName').exec(function(err, jobtypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(jobtypes);
		}
	});
};

/**
 * Jobtype middleware
 */
exports.jobtypeByID = function(req, res, next, id) { Jobtype.findById(id).populate('user', 'displayName').exec(function(err, jobtype) {
		if (err) return next(err);
		if (! jobtype) return next(new Error('Failed to load Jobtype ' + id));
		req.jobtype = jobtype ;
		next();
	});
};

/**
 * Jobtype authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.jobtype.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};