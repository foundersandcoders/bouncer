"use strict";

var handlers = require("./handlers.js");

module.exports = [

  { method: "GET", path: "/login", config: { handler: handlers.login, auth: "simple" }},

  { method: "POST", path: "/register", config: { handler: handlers.register, auth: false }},

  { method: "POST", path: "/validate", config: { handler: handlers.validate, auth: false }},

  { method: "GET", path: "/logout", config: { handler: handlers.logout, auth: false }}

];
