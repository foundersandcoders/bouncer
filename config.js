"use strict";

var config;

var test = {
	authUrl:  "http://0.0.0.0:8000",
	database: {	
		port:  9200,
		host:  "http://127.0.0.1",
		index: "clerk"
	}
};

var staging = {
	authUrl:  "http://0.0.0.0:8000",
	database: {	
		port:  9200,
		host:  "http://127.0.0.1",
		index: "clerk"
	}
};

var production = {
	authUrl:  "http://0.0.0.0:8000",
	database: {	
		port:  9200,
		host:  "http://127.0.0.1",
		index: "clerk"
	}
};

/* istanbul ignore next */
switch(process.env.NODE_ENV) {
    case "test":
        config = test;
        break;
    case "staging":
        config = staging;
        break;
    case "prod":
        config = production;
        break;
    default:
		config = test;
}

module.exports = config;