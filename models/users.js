"use strict";

var config = require("../config.js");

var opts = {
	index: "clerk",
	type: "users",
	port: config.database.port,
	host: config.database.host
};

module.exports = require("russian-doll")(opts);