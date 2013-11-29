'use strict';

var microtime = require('microtime');

exports = module.exports = function hammer(configuration) {
    var onBefore, onAfter, iterations;

    configuration = configuration || {};

    onBefore = configuration.before || onBefore;
    onAfter = configuration.after || onAfter;
    iterations = configuration.iterations || 100;

    function resolveBefore (callback) {
        if (onBefore) {
            onBefore(callback);
        }
        else {
            callback();
        }
    }

    return {
        before : function (fn) {
            onBefore = fn;
            return this;
        },
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

            setImmediate(resolveBefore.bind(null, function () {
                start = microtime.now();
                timer();
            }));

            return {
                after : function (callback) {
                    onAfter = callback;
                }
            };
        }
    };
};