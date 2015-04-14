"use strict";

var test = require("tape");
var signToken = require("../lib/auth.js").signToken;
var validateSession = require("../lib/auth.js").validateSession;
var jwt = require("jsonwebtoken");
var aguid = require("aguid");
var request = require("request");

var jwtoken;

test("signToken should pass signed token and es response to cb", function (t) {

  var email = "wil";

  function callback (token, esresponse) {
    jwtoken = token;
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {

      t.equals(decoded.iss, aguid(email), "correct token received");
      t.equals(esresponse.created, true, "correct esresponse received");
      t.end();
    });
  }

  signToken(email, callback);
});


test("validateSession should pass true and session to cb if session is valid", function (t) {

  validateSession(jwtoken, function (isValid, session) {

    t.ok(isValid, "session is valid");
    t.equals(session.userId, aguid("wil"), "correct session returned");
    t.end();
  });

});


test("validateSession should pass false to cb if session is invalid", function (t) {

  validateSession("aoeuhaoeurcrhd", function (isValid, session) {

    t.notOk(isValid, "session is not valid");
    t.notOk(session, "session not returned");
    t.end();
  });
});


test("clear database", function (t) {

  request.del("http://127.0.0.1:9200/clerk/sessions/_query?q=userId:" + aguid("wil"), function () {

    t.end();
  });
});
