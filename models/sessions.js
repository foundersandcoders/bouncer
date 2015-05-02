"use strict";

var config = require("../config.js");

var opts = {
	index: "clerk",
	type: "sessions",
	port: config.database.port,
	host: config.database.host
};

module.exports = require("russian-doll")(opts);