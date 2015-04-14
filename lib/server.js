"use strict";

var hapi = require("hapi");
var port = process.env.PORT || 8000;
var basic = require("hapi-auth-basic");

var internals = {};

internals.server = new hapi.Server();

internals.server.connection({
  port: port
});

internals.server.register([ { register: basic } ], function () {

  internals.server.auth.strategy("simple", "basic", {
    validateFunc: require("./auth.js").validate
  });

  internals.server.route(require("./routes.js"));
});


module.exports = internals.server;
