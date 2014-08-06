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
}

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
        trim: true,
        unique: true
    },
    fields: {
        type: [{
            type: Schema.ObjectId,
            ref: 'Fieldtype'
        }],
        validate: [validateArrayLength, 'Please add at least one field']
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