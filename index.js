'use strict';

const Microtime = require('microtime');

const hammer = function ({ before, after, iterations = 1000 } = {}) {

    const resolveBefore = function (callback) {
        if (before) {
            before(callback);
            return;
        }
        callback();
    };

    return {
        time(fn) {
            let counter = 0;
            let start = undefined;

            const iterate = function () {
                if (++counter === iterations) {
                    const end = Microtime.now() - start;
                    const ops = Math.round(counter / (end / 1000000));
                    process.nextTick(after, {
                        iterations: counter,
                        ops: ops,
                        time: end
                    });
                    return false;
                }
                return true;
            };

            let timer = undefined;

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

            resolveBefore(() => {
                start = Microtime.now();
                timer();
            });
        }
    };
}

module.exports = hammer;
