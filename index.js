'use strict';

const Microtime = require('microtime');

const hammer = function ({ before = (n) => n(), after = (r) => console.log(r), iterations = 1000 } = {}) {

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

            before(() => {
                start = Microtime.now();
                timer();
            });
        }
    };
}

module.exports = hammer;
