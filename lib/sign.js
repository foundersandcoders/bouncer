"use strict";

var es = require("esta");
var jwt = require("jsonwebtoken");
var aguid = require("aguid");

function sign (email, cb) {

  var unsignedToken = {
    jti: aguid(),
    iss: aguid(email)
  };

  var token = jwt.sign(unsignedToken, process.env.JWT_SECRET);

  var session = {
    index: process.env.ES_INDEX,
    type: "sessions",
    id: unsignedToken.jti,
    userId: unsignedToken.iss,
    ct: new Date().toISOString()
  };


  es.create(session, function (res) {
    return cb(token, res);
  });
}

module.exports = sign;
