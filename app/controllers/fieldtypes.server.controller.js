'use strict';

/**
 * Module dependencies
 */

var mongoose = require('mongoose'),
    Fieldtype = mongoose.model('FieldType'),
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
 * Create a Fieldtype
 */
exports.create = function(req, res) {
    var fieldtype = new Fieldtype(req.body);
    fieldtype.user = req.user;

    fieldtype.save(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        }
        else {
            res.jsonp(fieldtype);
        }
    });
};

/**
 * Show the current Fieldtype
 */
exports.read = function(req, res) {
    res.jsonp(req.fieldtype);
};

/**
 * Update a Fieldtype
 */

exports.update = function(req, res) {
    var fieldtype = req.fieldtype;

    fieldtype = _.extend(fieldtype, req.body);

    fieldtype.save(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        }
        else {
            res.jsonp(fieldtype);
        }
    });
};

/**
 * Delete a Fieldtype
 */
exports.delete = function(req, res) {
    var fieldtype = req.fieldtype;

    fieldtype.remove(function(err) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        }
        else {
            res.jsonp(fieldtype);
        }
    });
};

/**
 * List of Fieldtypes
 */
exports.list = function(req, res) {
    Fieldtype.find().sort('-created').populate('user', 'displayName').exec(function(err, fieldtypes) {
        if (err) {
            return res.send(400, {
                message: getErrorMessage(err)
            });
        }
        else {
            res.jsonp(fieldtypes);
        }
    });
};

/**
 * Fieldtype middleware
 */
exports.fieldtypeByID = function(req, res, next, id) {
    Fieldtype.findById(id).populate('user', 'displayName').exec(function(err, fieldtype) {
        if (err) return next(err);
        if (!fieldtype) return next(new Error('Failed to load Fieldtype ' + id));
        req.fieldtype = fieldtype;
        next();
    });
};

/**
 * Fieldtype authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.fieldtype.user.id !== req.user.id) {
		return res.send(403, 'User is not authorized');
	}
	next();
};