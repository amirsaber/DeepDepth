'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Fieldtype = mongoose.model('Fieldtype');

/**
 * Globals
 */

var user, fieldType1, fieldType2;

/**
 * Unit test
 */
describe('FieldType Model Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        user.save(function() {
            fieldType1 = new Fieldtype({
                name: 'Field1',
                description: 'This is for field1',
                user: user,
                type: 'String'
            });
            fieldType2 = new Fieldtype({
                name: 'Field1',
                description: 'This is for field2',
                user: user,
                type: 'String'
            });

            done();
        });
    });

    describe('Method Save', function() {
        it('should begin with no field types', function(done) {
            Fieldtype.find({}, function(err, fieldtypes) {
                fieldtypes.should.have.length(0);
                done();
            })
        });

        it('should be able to save without problems', function(done) {
            return fieldType1.save(function(err) {
				should.not.exist(err);
				done();
			});
        });

        it('should fail to save a duplicate fieldtype name', function(done) {
            fieldType1.save();
            return fieldType2.save(function(err) {
                should.exist(err);
                done();
            });
        });
        
        it('should fail to save a fieldtype with an invalid type', function(done) {
            fieldType1.type = 'foo';
            return fieldType1.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should fail to save a fieldtype without type', function(done) {
            fieldType1.type = '';
            return fieldType1.save(function(err) {
                should.exist(err);
                done();
            });
        });
        
        it('should be able to save a fieldtype with valid type', function(done) {
            fieldType1.type = 'Integer';
            return fieldType1.save(function(err) {
                should.not.exist(err);
                done();
            });
        });
        
        it('should fail to save a fieldtype without name', function(done) {
            fieldType1.name = '';
            return fieldType1.save(function(err) {
                should.exist(err);
                done();
            });
        });
    });
    
    afterEach(function(done) { 
		Fieldtype.remove().exec();
		User.remove().exec();

		done();
	});
})