# Hammertime

Stop! Hammer time.

```javascript
hammer(config).time(fn);
```

Wait... Should this be `hammer(fn).time(config)` or `hammer(config).time(fn)`?!

# Getting Started

### Configuration

- `before` - function to run as setup. `function (next)`.
- `after` - function to run after timer runs.
- `iterations` - number of iterations, default is `100`.

Configuration can also be performed by composition as seen below.

### API

Once `hammer()` is called, an object will be returned with the following functions.

- `before(fn)` - function to run before `time`. `fn` is passed a callback to invoke when complete.
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

- `after(fn)` - function to run after `time`'s iterations. `fn` is passed the results of `time`.

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