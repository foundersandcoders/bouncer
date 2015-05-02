"use strict";

var test    = require("tape");
var server  = require("../lib/server.js");
var es      = require("esta");
var aguid   = require("aguid");
var request = require("request");
var url     = process.env.BONSAI_URL || "http://" + process.env.ES_HOST + ":" + process.env.ES_PORT;


test("POST /signup should return 400 if no password or email sent", function (t) {

	var payload = {};

	var request = {
		method: "POST",
		url: "/signup",
		payload: payload
	};

	server.inject(request, function (res) {

		t.equals(res.statusCode, 400, "400 code returned");
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
		t.ok(res.headers.authorization, "auth header set");
		t.end();
	});
});


test("POST /signup should return 400 if user already exists", function (t) {

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

		t.equals(res.statusCode, 400, "400 code returned");
		t.end();
	});
});


test("NOT A TEST: clearup after test", function (t) {

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
