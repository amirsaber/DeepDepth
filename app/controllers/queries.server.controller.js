'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Query = mongoose.model('Query'),
	_ = require('lodash');

/**
 * Get the error message from error object
 */
var getErrorMessage = function(err) {
	var message = '';

	if (err.code) {
		switch (err.code) {
		case 11000:
		case 11001:
			message = 'Query already exists';
			break;
		default:
			message = 'Something went wrong';
		}
	}
	else {
		for (var errName in err.errors) {
			if (err.errors[errName].message) message = err.errors[errName].message;
		}
	}

	return message;
};

/**
 * Create a Query
 */
exports.create = function(req, res) {
	var query = new Query(req.body);
	query.user = req.user;

	query.save(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
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
			return res.send(400, {
				message: getErrorMessage(err)
			});
		}
		else {
			res.jsonp(query);
		}
	});
};

/**
 * Delete an Query
 */
exports.delete = function(req, res) {
	var query = req.query;

	query.remove(function(err) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
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
	Query.find().sort('-created').populate('user', 'displayName').exec(function(err, queries) {
		if (err) {
			return res.send(400, {
				message: getErrorMessage(err)
			});
		}
		else {
			res.jsonp(queries);
		}
	});
};

/**
 * Query middleware
 */
exports.queryByID = function(req, res, next, id) {
	Query.findById(id).populate('user', 'displayName').exec(function(err, query) {
		if (err) return next(err);
		if (!query) return next(new Error('Failed to load Query ' + id));
		req.query = query;
		next();
	});
};

/**
 * Query authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.query.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};