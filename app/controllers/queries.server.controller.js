'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Query = mongoose.model('Query'),
	_ = require('lodash');

/**
 * Create a Query
 */
exports.create = function(req, res) {
	var query = new Query(req.body);
	query.user = req.user;

	query.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
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
	var query = req.query ;

	query = _.extend(query , req.body);

	query.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(query);
		}
	});
};

/**
 * Delete an Query
 */
exports.delete = function(req, res) {
	var query = req.query ;

	query.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(query);
		}
	});
};

/**
 * List of Queries
 */
exports.list = function(req, res) { Query.find().sort('-created').populate('user', 'displayName').exec(function(err, queries) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(queries);
		}
	});
};

/**
 * Query middleware
 */
exports.queryByID = function(req, res, next, id) { Query.findById(id).populate('user', 'displayName').exec(function(err, query) {
		if (err) return next(err);
		if (! query) return next(new Error('Failed to load Query ' + id));
		req.query = query ;
		next();
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