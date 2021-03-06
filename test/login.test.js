"use strict";

var test    = require("tape");
var server  = require("../lib/server.js");
var es      = require("esta");
var aguid   = require("aguid");
var request = require("request");
var url     = process.env.BONSAI_URL || "http://" + process.env.ES_HOST + ":" + process.env.ES_PORT;

test("GET /login should return 401 if no username and password", function (t) {

	var request = {
		method: "GET",
		url: "/login",
	};

	server.inject(request, function (res) {

		t.equals(res.statusCode, 401, "401 code returned");
		t.end();
	});
});

test("GET /login should return 401 if username and password invalid", function (t) {

	var username =  "whatever";
	var password =  "yourmum";
	var authorization = "Basic " + (new Buffer(username + ":" + password, "utf8")).toString("base64");

	var request = {
		method: "GET",
		url: "/login",
		headers: {
			authorization: authorization
		}
	};

	server.inject(request, function (res) {

		t.equals(res.statusCode, 401, "401 code returned");
		t.end();
	});
});


test("POST /signup should add user to user database", function (t) {

	var payload = {
		email: "admin",
		password: "god"
	};

	var request = {
		method: "POST",
		url: "/signup",
		payload: payload
	};

	server.inject(request, function (res) {

		t.equals(res.statusCode, 200, "200 code returned");
		t.end();
	});
});


test("GET /login should return 200 if username and password are valid", function (t) {

	var email = "admin";
	var password = "god";

	var authorization = "Basic " + (new Buffer(email + ":" + password, "utf8")).toString("base64");

	var request = {
		method: "GET",
		url: "/login",
		headers: {
			authorization: authorization
		}
	};

	server.inject(request, function (res) {

		t.equals(res.statusCode, 200, "200 code returned");
		t.ok(res.headers.authorization, "auth header set");
		t.end();
	});
});


test("clearup after test", function (t) {

	var user = {
		index: "clerk",
		type: "users",
		id: aguid("admin"),
		email: "admin"
	};
	es.delete(user, function () {

		request.del(url + "/clerk/sessions/_query?q=userId:" + aguid("admin"), function () {

			t.end();
		});
	});
});