# express-cache-controller
An updated version of [Mousius/express-cache-controller](https://github.com/Mousius/express-cache-controller).

# Differences
- Supports TypeScript types.
- Supports [`immutable`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Cache-Control#immutable) option.

# Examples
```js
app.use(cacheControl({ public: true }));

// If you want to modify the cache control header on-the-fly
app.use((req, res, next) => {
  res.cacheControl.immutable = true;
})
```

For more information about the API, please visit the [origin of the module](https://github.com/Mousius/express-cache-controller).

# License
[MIT](LICENSE)