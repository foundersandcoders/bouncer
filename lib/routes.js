"use strict";

module.exports = [

  { method: "GET", path: "/login", config: { handler: require("../handlers/login.js"), auth: "simple" }},

  { method: "POST", path: "/register", config: { handler: require("../handlers/register.js"), auth: false }},

  { method: "GET", path: "/validate", config: { handler: require("../handlers/validate.js"), auth: false }},

  { method: "GET", path: "/logout", config: { handler: require("../handlers/logout.js"), auth: false }}

];
