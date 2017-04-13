# ATTAK Router

Sets up an [express](https://github.com/expressjs/express)-based router for api request handling.

## Installation

npm install --save attak-router

## Usage

attak-router is an [ATTAK processor](https://github.com/attak/attak#processors) that sets up an association between urls and other processor handler functions. When a request that matches a given url pattern, the specified handler function will be invoked. You can configure the specifics of how that invocation happens

A RESTful cat photo API might look something like:

```js
var Router = require('attak-router')

module.exports = {
  api: 'endpoint',
  processors: {
    endpoint: new Router({
      routes: {
        "GET /api/cats": 'getCats'
        "GET /api/cats/:id": 'getCat'
        "POST /api/cats": 'createCat'
        "PUT /api/cats/:id": 'updateCat'
      }
    }),
    getCat: function(event, context, callback) {
      ...get a single photo...
    },
    getCats: function(event, context, callback) {
      ...get multiple photos...
    },
    createCat: function(event, context, callback) {
      ...create a record...
    },
    updateCat: function(event, context, callback) {
      ...update a record...
    },
  }
}
```

The `event` parameter passed into a handler contains information about the incoming request.

```js
  updateCat: function(event, context, callack) {
    console.log(event.method)     // PUT
    console.log(event.url)        // /api/cats/123
    console.log(event.params)     // {id: 123}
    console.log(event.body)       // {url: 'https://static.pexels.com/photos/33537/cat-animal-cat-portrait-mackerel.jpg'}
  }
```

By default, handler functions are called from within the request handler process (`invocation: 'local'`), but the router can be configured using the `invocation` constructor parameter:

```js
  new Router({
    invocation: 'remote'
    routes: {
      ...routes...
    }
  }),
```

Options include:

- `local` - (default) request response by running handler funtions in the main API processor process (lowest latency, cheapest)
- `remote` - request response by invoking other processors, running their handler functions asyncronously and returning the results as normal (useful when a response function has different memory requirements, etc.)