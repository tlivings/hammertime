[![Build Status](https://travis-ci.org/tlivings/hammertime.png)](https://travis-ci.org/tlivings/hammertime) [![NPM version](https://badge.fury.io/js/hammertime.png)](http://badge.fury.io/js/hammertime)

# Hammertime

Stop! Hammer time.

```javascript
hammer(config).time(fn);
```

# Installation

`npm install hammertime`

# Usage

### Configuration

A configuration object can be passed to the `hammer` function to configure the context for the timer.

- `before` - function to run as setup, passed a callback to invoke when complete.
- `after` - function to run after timer runs, results from `time` are passed to this function.
- `iterations` - number of iterations, default is `100`.

Configuration can also be performed by composition as seen in some examples below.

### API

- `hammer(config)` - create and configure a timer context.

Example:

```javascript
var hammer = require('hammertime');

hammer({
    before(next) {
        next();
    },
    after(results) {
        console.dir(results);
    },
    iterations: 500
});
```

Once `hammer()` is called, an object will be returned with the following function.

- `time(fn)` - begins the iterations of `fn`. `fn` can be asynchronous if a callback argument is supplied.

Example:

```javascript
hammer({
    before(next) {
        next();
    },
    after(results) {
        console.dir(results);
    },
    iterations: 500
})
.time(function (next) {
    someAsyncFunction((result) => {
        next();
    });
});
```

### Results

- `iterations` - number of completed iterations.
- `time` - time, in microseconds, that it took to complete.
- `ops` - operations per second.
