"use strict";

var test = require("tape");
var server = require("../lib/server.js");
var aguid = require("aguid");
var es = require("esta");
var request = require("request");
var url = process.env.BONSAI_URL || "http://" + process.env.ES_HOST + ":" + process.env.ES_PORT;

var jwtoken;

test("clearup before test", function (t) {

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

    jwtoken = res.headers.authorization;
    t.equals(res.statusCode, 200, "200 code returned");
    t.ok(res.headers.authorization, "auth header set");
    t.ok(JSON.parse(res.payload).created, "session created");
    t.end();
  });

});


test("GET /validate should return 200 with correct token", function (t) {

  var request = {
    method: "GET",
    url: "/validate",
    headers: {
      authorization: jwtoken
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 200, "200 code returned");
    t.equals(JSON.parse(res.payload).userId, aguid("admin"), "correct session returned");
    t.end();
  });
});

test("GET /validate should return 401 if invalid token", function (t) {

  var request = {
    method: "GET",
    url: "/validate",
    headers: {
      authorization: "aoeuaoeu"
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 401, "401 code returned");
    t.equals(JSON.parse(res.payload).status, "Unauthorized", "correct error message returned");
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


test("GET /validate should return 401 if session not found", function (t) {

  var request = {
    method: "GET",
    url: "/validate",
    headers: {
      authorization: jwtoken
    }
  };

  server.inject(request, function (res) {

    t.equals(res.statusCode, 401, "401 code returned");
    t.equals(JSON.parse(res.payload).status, "Unauthorized", "correct error message returned");
    t.end();
  });
});
