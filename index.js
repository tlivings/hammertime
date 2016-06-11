'use strict';

const Microtime = require('microtime');

/**
 * Configures a new benchmark.
 * @param configuration
 * @returns {{before: Function, time: Function}}
 */
const hammer = function ({ before, after, iterations = 1000 } = {}) {
    /**
     * Call before, if it exists, passing it the given callbacl.
     * @param callback
     */
    const resolveBefore = function (callback) {
        if (before) {
            before(callback);
        }
        else {
            callback();
        }
    }

    return {
        /**
         * Runs a benchmark of the given function.
         * @param fn
         * @returns {{after: Function}}
         */
        time(fn) {
            let counter = 0;
            let start = undefined;
            let end = undefined;
            let ops = undefined;

            const iterate = function () {
                if (++counter === iterations) {
                    end = Microtime.now() - start;
                    ops = Math.round(counter / (end / 1000000));
                    process.nextTick(after, {
                        iterations: counter,
                        ops: ops,
                        time: end
                    });
                    counter = timer = start = end = ops = null;
                    return false;
                }
                return true;
            }

            let timer = undefined;

            //Async functions (assume if passing a callback / argument)
            if (fn.length) {
                timer = function () {
                    iterate() && fn(timer);
                };
            }
            else {
                timer = function () {
                    while (iterate()) {
                        fn();
                    }
                };
            }

            //Begin on next tick so that we can still invoke after() if we want.
            process.nextTick(resolveBefore, () => {
                start = Microtime.now();
                timer();
            });
        }
    };
}

module.exports = hammer;
