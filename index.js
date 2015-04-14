"use strict";

var server = require("./lib/server.js");

server.start(function () {

  console.log("bouncer service started on " + server.info.port);
});
