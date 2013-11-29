# Hammertime

Stop! Hammer time.

```javascript
hammer(config).time(fn);
```

Wait... Should this be `hammer(fn).time(config)` or `hammer(config).time(fn)`?!

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
    before: function (next) {
        next();
    },
    after: function (results) {
        console.dir(results);
    },
    iterations: 500
});
```

Once `hammer()` is called, an object will be returned with the following functions.

- `before(fn)` - function to run before `time`, in lieu of configuration option. `fn` is passed a callback to invoke when complete.
- `time(fn)` - begins the iterations of `fn`. `fn` can be asynchronous if a callback argument is supplied.

Example:

```javascript
hammer()
.before(function (next) {
    next();
})
.time(function (next) {
    asyncFunction(function (result) {
        next();
    });
});
```

`time` will also return an object that provides a single function:

- `after(fn)` - function to run after `time`'s iterations, in lieu of configuration option. `fn` is passed the results of `time`.

Example:

```javascript
hammer()
.time(fn)
.after(function (results) {
    console.dir(results);
});
```

### Results

- `iterations` - number of completed iterations.
- `time` - time, in microseconds, that it took to complete.
- `ops` - operations per second.