"use strict";

var es = require("esta");
var bcrypt = require("bcrypt");
var aguid = require("aguid");
var jwt = require("jsonwebtoken");


function validate (email, password, cb) {

  var user = {
    index: process.env.ES_INDEX,
    type: "users",
    id: aguid(email),
    email: email
  };

  es.read(user, function (res) {

    if (res.found) {
      bcrypt.compare(password, res._source.password, function (err, isValid) {

        cb(err, isValid, { id: res._id, email: res._source.email });
      });
    } else {
      cb(null, false);
    }
  });
}


function signToken (email, cb) {

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


function validateSession (token, cb) {

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {

    if (!decoded) {
      return cb(false);
    }

    var session = {
      index: process.env.ES_INDEX,
      type: "sessions",
      id: decoded.jti
    };

    es.read(session, function (res) {

      if (res.found) {
        return cb(true, {
          id: res._id,
          userId: res._source.userId,
          ct: res._source.ct
        });
      } else {
        return cb(false);
      }
    });
  });
}


module.exports = {
  validate: validate,
  signToken: signToken,
  validateSession: validateSession
};
