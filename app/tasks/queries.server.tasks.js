'use strict';
/*
 *Module Dependencies
 */
var mongoose = require('mongoose'),
    CronJob = require('cron').CronJob,
    queries = require('../../app/controllers/queries'),
    request = require('request'),
    config = require('../../config/config');

//Create and run a task every 10 seconds
new CronJob('*/10 * * * * *', function() {
    var req = {},
        res = {};
    queries.findIncompletes(req, res, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            req.queries.forEach(function(query) {
                //TODO fix it into database and jobtype
                var statusAddress = query.job.address.replace('issue/hive/twitter_db', 'status/');
                request({
                    uri: statusAddress + query.dbJobId,
                    method: 'GET',
                    headers: {
                        'AUTHORIZATION': 'TD1 ' + config.td
                    }
                }, function(err, response, body) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        body = JSON.parse(body);
                        query.status = body.status;
                        queries.updateStatus(query, function(err, result, raw) {
                            if (err) {
                                console.log(err);
                            }
                        });
                    }
                });
            });
        }
    });
}, null, true);