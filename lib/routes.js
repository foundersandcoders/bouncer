"use strict";

var handlers = require("./handlers.js");

module.exports = [
  { method: "GET", path: "/", handler: handlers.getRoot }
];
