"use strict";

var test = require("tape");
var server = require("../lib/server.js");
var es = require("esta");
var aguid = require("aguid");

test("POST /login should return 401 if no username and password", function (t) {

  var payload = {};

  var request = {
    method: "POST",
    url: "/login",
    payload: payload
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 401, "401 code returned");
    t.end();
  });
});

test("POST /login should return 401 if username and password invalid", function (t) {

  var payload = {};

  var username =  "whatever";
  var password =  "yourmum";
  var authorization = "Basic " + (new Buffer(username + ":" + password, "utf8")).toString("base64");

  var request = {
    method: "POST",
    url: "/login",
    payload: payload,
    headers: {
      authorization: authorization
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 401, "401 code returned");
    t.end();
  });
});

test("POST /register should add user to user database", function (t) {

  var payload = {
    email: "admin",
    password: "god"
  };

  var request = {
    method: "POST",
    url: "/register",
    payload: payload
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 200, "200 code returned");
    t.end();
  });

});


test("POST /login should return 200 if username and password are valid", function (t) {

  var email = "admin";
  var password = "god";

  var authorization = "Basic " + (new Buffer(email + ":" + password, "utf8")).toString("base64");

  var request = {
    method: "POST",
    url: "/login",
    payload: {},
    headers: {
      authorization: authorization
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 200, "200 code returned");
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
    t.end();
  });
});
