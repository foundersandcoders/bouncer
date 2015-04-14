"use strict";

var handlers = require("./handlers.js");

module.exports = [
//  { method: "GET", path: "/", handler: handlers.getRoot },
  { method: "GET", path: "/login", config: { handler: handlers.login, auth: "simple" } },
  { method: "POST", path: "/register", config: { handler: handlers.register, auth: false } }
//  { method: "GET", path: "/logout", handler: handlers.logout }
];
