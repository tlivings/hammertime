'use strict';

var assert = require('chai').assert,
    hammer = require('../index');

describe('hammer', function() {

    it('should time sync', function(next) {

        var fn;

        hammer({
            before: function (done) {
                var crypto = require('crypto');
                fn = function () {
                    return crypto.createHash('md5').update('Hello World').digest('hex');
                }
                done();
            },
            after: function (results) {
                assert.strictEqual(results.iterations, 100);
                assert.isNumber(results.time);
                assert.isNumber(results.ops);
                next();
            }
        })
        .time(function () {
            fn();
        });

    });

	it('should time async', function(next) {

        var fn;

        hammer({
            before: function (done) {
                var crypto = require('crypto');
                fn = function (callback) {
                    callback(crypto.createHash('md5').update('Hello World').digest('hex'));
                }
                done();
            },
            after: function (results) {
                assert.strictEqual(results.iterations, 100);
                assert.isNumber(results.time);
                assert.isNumber(results.ops);
                next();
            }
        })
        .time(function (step) {
            fn(function () {
                step();
            });
        });

	});

    it('should use before() and after().', function (next) {

        var fn;

        hammer()
            .before(function (done) {
                var crypto = require('crypto');
                fn = function () {
                    return crypto.createHash('md5').update('Hello World').digest('hex');
                }
                done();
            })
        .time(function () {
            fn();
        })
            .after(function (results) {
                assert.strictEqual(results.iterations, 100);
            assert.isNumber(results.time);
            assert.isNumber(results.ops);
            next();
        });

    });

});