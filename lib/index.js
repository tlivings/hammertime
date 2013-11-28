'use strict';

var microtime = require('microtime');

exports = module.exports = function hammer(configuration) {
    var onBefore, onAfter, iterations;

    configuration = configuration || {};

    onBefore = configuration.before;
    onAfter = configuration.after;
    iterations = configuration.iterations || 100;

    function resolve(callback) {
        if (onBefore) {
            onBefore(callback);
        }
        else {
            callback();
        }
    }

    return {
        time: function (fn) {
            var counter = 0, timer, start, end, ops;

            function iterate() {
                if (++counter === iterations) {
                    end = microtime.now() - start;
                    ops = Math.round(counter / (end / 1000000));
                    onAfter({
                        iterations: counter,
                        ops: ops,
                        time: end
                    });
                }
                else {
                    timer();
                }
            }

            if (fn.length) {
                timer = function timer() {
                    fn(iterate);
                };
            }
            else {
                timer = function timer() {
                    fn();
                    iterate();
                }
            }

            setImmediate(resolve.bind(null, function () {
                start = microtime.now();
                timer();
            }));

            return {
                done: function (callback) {
                    onAfter = callback;
                }
            };
        }
    };
};