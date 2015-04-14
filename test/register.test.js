"use strict";

var test = require("tape");
var server = require("../lib/server.js");
var es = require("esta");
var aguid = require("aguid");

test("POST /register should return 400 if no password or email sent", function (t) {

  var payload = {};

  var request = {
    method: "POST",
    url: "/register",
    payload: payload
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 400, "400 code returned");
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

test("POST /register should return 400 if user already exists", function (t) {

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

    t.equals(res.statusCode, 400, "400 code returned");
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
