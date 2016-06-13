'use strict';

const Tape = require('tape');
const Hammer = require('../index');

Tape('hammer', (t) => {

    t.test('configure with options', (t) => {
        t.plan(4);

        Hammer({
            before(start) {
                t.pass('before called.');
                start();
            },
            after(results) {
                t.pass('after called.');
                t.equal(typeof results, 'object', 'results is an object.');
                t.equal(results.iterations, 10, 'ran 10 iterations.');
            },
            iterations : 10
        })
        .time(() => {
            const noop = true;
        });

    });

    t.test('run sync', (t) => {
        t.plan(3);

        Hammer({
            iterations : 10000,
            after(results) {
                t.equal(results.iterations, 10000, 'ran configured iterations.');
                t.equal(typeof results.time, 'number', 'results.time is a number.');
                t.equal(typeof results.ops, 'number', 'results.ops is a number.');
            }
        })
        .time(() => {
            const noop = true;
        });
    });

    t.test('run async', (t) => {
        t.plan(3);

        const afn = function (cb) {
            setImmediate(cb);
        }

        Hammer({
            iterations : 100,
            after(results) {
                t.equal(results.iterations, 100, 'ran configured iterations.');
                t.equal(typeof results.time, 'number', 'results.time is a number.');
                t.equal(typeof results.ops, 'number', 'results.ops is a number.');
            }
        })
        .time((next) => {
            afn(function () {
                next();
            });
        });

    });

    t.test('defaults', (t) => {

        Hammer()
        .time(() => {
            const noop = true;
        });

        setTimeout(t.end, 100);
    });

});
