# ATTAK Router

Sets up an [express](https://github.com/expressjs/express)-based router for api request handling.

## Installation

npm install --save attak-router

## Usage

ATTAK router is a processor that sets up an association between urls and other processor handler functions. When a request that matches a given url pattern, the specified handler function will be invoked. You can configure the specifics of how that invocation happens

A RESTful cat photo API might look something like:

```js
var Router = require('attak-router')

module.exports = {
  api: 'endpoint',
  processors: {
    endpoint: new Router({
      routes: {
        "GET /api/cats": 'catGetter'
        "GET /api/cats/:id": 'catGetter'
        "POST /api/cats": 'catSetter'
        "PUT /api/cats/:id": 'catSetter'
      }
    }),
    catGetter: function(event, context, callback) {
      if (event.params.id) {
        ...send back a single cat picture...
      } else {
        ...send back a multiple cat pictures...
      }
    },
    catSetter: function(event, context, callback) {
      if(event.method === "POST") {
        ...create a new record...
      } else {
        ...update a record...
      }
    },
  }
}
```

By default, handler functions are called via [local invocation](), but the router can be configured using the `invocation` constructor parameter:

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