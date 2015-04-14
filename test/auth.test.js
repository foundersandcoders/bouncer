"use strict";

var test = require("tape");
var signToken = require("../lib/auth.js").signToken;
var jwt = require("jsonwebtoken");
var aguid = require("aguid");
var request = require("request");

test("signToken should pass signed token and es response to cb", function (t) {

  var request = {
    payload: {
      email: "wil"
    }
  };

  function callback (token, esresponse) {

    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {

      t.equals(decoded.iss, aguid(request.payload.email), "correct token received");
      t.equals(esresponse.created, true, "correct esresponse received");
      t.end();
    });
  }
  signToken(request, callback);
});


test("clear database", function (t) {

  request.del("http://127.0.0.1:9200/clerk/sessions/_query?q=userId:" + aguid("wil"), function () {
    t.end();
  });
});
