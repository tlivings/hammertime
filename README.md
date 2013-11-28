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

### API

Once `hammer()` is called, an object will be returned with a single function on it:

`time(fn)` - begins the iterations of `fn`. `fn` can be asynchronous if a callback argument is supplied.

Example:

```javascript
hammer().time(function (next) {
    asyncFunction(function (result) {
        next();
    });
});
```

`time` will also return an object that provides a function `done` that takes a callback to be invoked when the timer is complete.

