'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Query = mongoose.model('Query'),
	Fieldtype = mongoose.model('Fieldtype'),
	Graphtype = mongoose.model('Graphtype'),
	_ = require('lodash');

/**
 * Create a Query
 */
exports.create = function(req, res) {
	var job;
	if (req.body.job) {
		job = req.body.job._id;
	}
	var query = new Query({
		name: req.body.name,
		job: job,
		fields: req.body.fields
	});

	query.user = req.user;

	query.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			res.jsonp(query);
		}
	});
};

/**
 * Show the current Query
 */
exports.read = function(req, res) {
	res.jsonp(req.query);
};

/**
 * Update a Query
 */
exports.update = function(req, res) {
	var query = req.query;

	query = _.extend(query, req.body);

	query.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			res.jsonp(query);
		}
	});
};

/**
 * Update status of a Query
 */
exports.updateStatus = function(query, next) {
	Query.findByIdAndUpdate(query._id, {
		$set: {
			status: query.status
		}
	}, next);
};


/**
 * Delete an Query
 */
exports.delete = function(req, res) {
	var query = req.query;

	query.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			res.jsonp(query);
		}
	});
};

/**
 * List of Queries
 */
exports.list = function(req, res) {
	Query.find().sort('-created').populate('user', 'displayName').populate('job').exec(function(err, queries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		}
		else {
			Fieldtype.populate(queries, {
				path: 'job.fields',
				model: 'Fieldtype'
			}, function(err, queries) {
				if (err) {
					return res.status(400).send({
						message: errorHandler.getErrorMessage(err)
					});
				}

				res.jsonp(queries);
			});
		}
	});
};

/**
 * List of Queries with Status other than success or error
 */
exports.findIncompletes = function(req, res, next) {
	Query.find({
		$and: [{
			status: {
				$ne: 'success'
			}
		}, {
			status: {
				$ne: 'error'
			}
		}, {
			status: {
				$ne: 'killed'
			}
		}]
	}).sort('created').populate('user', 'displayName').populate('job').exec(function(err, queries) {
		if (err) return next(err);
		if (!queries) return next(new Error('Failed to load Incomplete Queries'));
		req.queries = queries;
		next();
	});
};

/**
 * Query middleware
 */
exports.queryByID = function(req, res, next, id) {
	Query.findById(id).populate('user', 'displayName').populate('job').exec(function(err, query) {
		if (err) return next(err);
		if (!query) return next(new Error('Failed to load Query ' + id));
		Fieldtype.populate(query, {
			path: 'job.fields',
			model: 'Fieldtype'
		}, function(err, query) {
			if (err) return next(err);
			if (!query) return next(new Error('Failed to load Query ' + id));
			Graphtype.populate(query, {
				path: 'job.graphs',
				model: 'Graphtype'
			}, function(err, query) {
				if (err) return next(err);
				if (!query) return next(new Error('Failed to load Query ' + id));
				req.query = query;
				next();
			});
		});
	});
};

/**
 * Query authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.query.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};