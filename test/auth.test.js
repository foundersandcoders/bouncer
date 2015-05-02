"use strict";

var test    = require("tape");
var sign    = require("../services.js")().sign;
var verify  = require("../services.js")().verify;
var jwt     = require("jsonwebtoken");
var aguid   = require("aguid");
var request = require("request");
var url     = process.env.BONSAI_URL || "http://" + process.env.ES_HOST + ":" + process.env.ES_PORT;

var jwtoken;

test("sign should pass signed token and es response to cb", function (t) {

	var email = "wil";

	function callback (token) {

		jwtoken = token;
		jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {

			t.equals(decoded.iss, aguid(email), "correct token received");
			t.end();
		});
	}

	sign(email, callback);
});

test("verify should pass true and session to cb if session is valid", function (t) {

	verify(jwtoken, function (isValid, session) {

		t.ok(isValid, "session is valid");
		t.equals(session.userId, aguid("wil"), "correct session returned");
		t.end();
	});
});

test("verify should pass false to cb if session is invalid", function (t) {

	verify("aoeuhaoeurcrhd", function (isValid, session) {

		t.notOk(isValid, "session is not valid");
		t.notOk(session, "session not returned");
		t.end();
	});
});

test("clear database", function (t) {

	request.del(url + "/clerk/sessions/_query?q=userId:" + aguid("wil"), function () {

		t.end();
	});
});