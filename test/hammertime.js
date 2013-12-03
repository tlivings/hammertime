'use strict';

var assert = require('chai').assert,
    hammer = require('../index');

describe('hammer', function () {

    it('should configure with options', function (next) {

        var count = 0;

        hammer({
            before : function (start) {
                assert.isFunction(start);
                count++;
                start();
            },
            after : function (results) {
                assert.isObject(results);
                assert.strictEqual(results.iterations, 10);
                assert.strictEqual(count, 1);
                next();
            },
            iterations : 10
        }).time(function () {
            });

    });

    it('should use before() and after() composition.', function (next) {

        var count = 0;

        hammer()
            .before(function (done) {
                count++;
                done();
            })
            .time(function () {
            })
            .after(function () {
                assert.strictEqual(count, 1);
                next();
            });

    });

    it('should run sync', function (next) {

        hammer({
            iterations : 10000,
            after : function (results) {
                assert.strictEqual(results.iterations, 10000);
                assert.isNumber(results.time);
                assert.isNumber(results.ops);
                next();
            }
        })
            .time(function () {

            });

    });

    it('should run async', function (next) {

        function fn (cb) {
            setImmediate(cb);
        }

        hammer({
            iterations : 10000,
            after : function (results) {
                assert.strictEqual(results.iterations, 10000);
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

});