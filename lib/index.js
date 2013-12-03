'use strict';

var microtime = require('microtime');

/**
 * Configures a new benchmark.
 * @param configuration
 * @returns {{before: Function, time: Function}}
 */
function hammer (configuration) {
    var onBefore, onAfter, iterations;

    configuration = configuration || {};

    onBefore = configuration.before || onBefore; //onBefore might have been set by before()
    onAfter = configuration.after;
    iterations = configuration.iterations || 100; //Default to 100

    /**
     * Call onBefore, if it exists, passing it the given callbacl.
     * @param callback
     */
    function resolveBefore (callback) {
        if (onBefore) {
            onBefore(callback);
        }
        else {
            callback();
        }
    }

    return {
        /**
         * Sets the onBefore handler by composition.
         * @param fn
         * @returns {exports}
         */
        before : function (fn) {
            onBefore = fn;
            return this;
        },
        /**
         * Runs a benchmark of the given function.
         * @param fn
         * @returns {{after: Function}}
         */
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
                    counter = timer = start = end = ops = null;
                    return false;
                }
                return true;
            }

            if (fn.length) {
                timer = function timer() {
                    fn(function step () {
                        iterate() && timer();
                    });
                };
            }
            else {
                timer = function timer() {
                    while (iterate()) {
                        fn();
                    }
                };
            }

            //Begin on next tick so that we can still invoke after() if we want.
            setImmediate(resolveBefore.bind(null, function () {
                start = microtime.now();
                timer();
            }));

            return {
                /**
                 * Sets the onAfter handler by composition..
                 * @param callback
                 */
                after : function (callback) {
                    onAfter = callback;
                }
            };
        }
    };
}

exports = module.exports = hammer;