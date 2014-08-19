'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Graphtype = mongoose.model('Graphtype'),
	_ = require('lodash');

/**
 * Create a Graphtype
 */
exports.create = function(req, res) {
	var graphtype = new Graphtype(req.body);
	graphtype.user = req.user;

	graphtype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(graphtype);
		}
	});
};

/**
 * Show the current Graphtype
 */
exports.read = function(req, res) {
	res.jsonp(req.graphtype);
};

/**
 * Update a Graphtype
 */
exports.update = function(req, res) {
	var graphtype = req.graphtype ;

	graphtype = _.extend(graphtype , req.body);

	graphtype.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(graphtype);
		}
	});
};

/**
 * Delete an Graphtype
 */
exports.delete = function(req, res) {
	var graphtype = req.graphtype ;

	graphtype.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(graphtype);
		}
	});
};

/**
 * List of Graphtypes
 */
exports.list = function(req, res) { Graphtype.find().sort('-created').populate('user', 'displayName').exec(function(err, graphtypes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(graphtypes);
		}
	});
};

/**
 * Graphtype middleware
 */
exports.graphtypeByID = function(req, res, next, id) { Graphtype.findById(id).populate('user', 'displayName').exec(function(err, graphtype) {
		if (err) return next(err);
		if (! graphtype) return next(new Error('Failed to load Graphtype ' + id));
		req.graphtype = graphtype ;
		next();
	});
};

/**
 * Graphtype authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.graphtype.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};