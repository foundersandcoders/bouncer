"use strict";

var handlers = require("../handlers.js")();

module.exports = [

  { method: "GET", path: "/login", config: { handler: handlers.login, auth: "simple" }},

  { method: "POST", path: "/signup", config: { handler: handlers.signup, auth: false }},

  { method: "GET", path: "/validate", config: { handler: handlers.validate, auth: false }},

  { method: "GET", path: "/logout", config: { handler: handlers.logout, auth: false }}
];