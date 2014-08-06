'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
    mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Fieldtype = mongoose.model('Fieldtype'),
    Jobtype = mongoose.model('Jobtype');

/**
 * Globals
 */

var user, fieldType1, fieldType2, jobType1, jobType2, jobType3;

/**
 * Unit test
 */
describe('Jobtype Model Unit Tests:', function() {
    beforeEach(function(done) {
        user = new User({
            firstName: 'Full',
            lastName: 'Name',
            displayName: 'Full Name',
            email: 'test@test.com',
            username: 'username',
            password: 'password'
        });

        fieldType1 = new Fieldtype({
            name: 'Field1',
            description: 'This is for field1',
            user: user,
            type: 'String'
        });

        fieldType2 = new Fieldtype({
            name: 'Field2',
            description: 'This is for field2',
            user: user,
            type: 'Integer'
        });

        user.save(function() {

            fieldType1.save(function() {
                fieldType2.save(function() {
                    jobType1 = new Jobtype({
                        name: 'Job Type Name 1',
                        address: 'http://rest.ip',
                        fields: [fieldType1]
                    });

                    jobType2 = new Jobtype({
                        name: 'Job Type Name 1',
                        address: 'http://rest.ip1',
                        fields: [fieldType1, fieldType2]
                    });
                    
                    done();
                });
            });
        });
    });

    describe('Method Save', function() {

        it('should begin with no Jobtype', function(done) {
            Jobtype.find({}, function(err, jobtypes) {
                jobtypes.should.have.length(0);
                done();
            });
        });

        it('should be able to save without problems', function(done) {
            return jobType1.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

        it('should fail to save two jobtypes with  same name', function(done) {
            jobType1.save();
            return jobType2.save(function(err) {
                should.exist(err);
                done();
            });
        });

        it('should fail to save a jobtype without name', function(done) {
            jobType1.name = '';
            return jobType1.save(function(err) {
                should.exist(err);
                done();
            });
        });
        
        it('should fail to save a jobtype without any fields', function(done) {
            jobType1.fields = '';
            return jobType1.save(function(err) {
                should.exist(err);
                done();
            });
        });
        
        it('should be able to save a jobtype with 2 fields', function(done) {
            return jobType2.save(function(err) {
                should.not.exist(err);
                done();
            });
        });

    });

    afterEach(function(done) {
        Jobtype.remove().exec();
        Fieldtype.remove().exec();
        User.remove().exec();
        done();
    });
})