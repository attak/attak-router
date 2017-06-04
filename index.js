'use strict'

var express = require('express')

class Router {
  
  constructor(options) {
    this.options = options
    this.setupRouter()
  }

  setupRouter() {
    var _this = this
    this.router = new express.Router()

    var routes = {}
    for (var route in this.options.routes) {
      var handleProc = this.options.routes[route]
      var splitRoute = route.split(' ')
      var methods = splitRoute[0].split(',')
      var fullPath = splitRoute[1]

      routes[fullPath] = {}
      
      for (var index in methods) {
        var method = methods[index].toLowerCase()
        
        var closure = function(method, fullPath, handleProc) {
          _this.router[method](fullPath, function(req, res, done) {
            res.invoke(handleProc, req)
          })
        }

        closure(method, fullPath, handleProc)
      }
    }
  }

  handler(event, context, callback) {
    var _this = this
    var routes = this.options.routes
    var results = undefined
    var response = {
      invoke: function(handleProc, req) {
        if (handleProc) {
          event.params = req.params
          context.invokeLocal(handleProc, event, callback)
        } else {
          callback(null, {
            httpStatus: 404
          })
        }
      }
    };
    
    var request = {
      method: event.httpMethod.toLowerCase(),
      url: event.path
    }

    this.router.handle(request, response, function(err) {
      if (err) {
        throw err
      }
    })
  }

}

module.exports = Router