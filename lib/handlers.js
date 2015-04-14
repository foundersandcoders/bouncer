"use strict";

var aguid = require("aguid");
var es = require("esta");
var bcrypt = require("bcrypt");
var signToken = require("./auth.js").signToken;
var validateSession = require("./auth.js").validateSession;
var jwt = require("jsonwebtoken");


function login (req, res) {

  signToken(req.auth.credentials.email, function (token, esresponse) {

    return res(esresponse).header("Authorization", token);
  });
}


function register (req, res) {


  if (!req.payload || !req.payload.email || !req.payload.password) {
    return res("no email or password provided").code(400);
  }

  var user = {
    index: "clerk",
    type: "users",
    id: aguid(req.payload.email),
    email: req.payload.email
  };

  es.read(user, function (ires) {

    if (ires.found) {
      return res("already exists").code(400);
    } else {
      bcrypt.genSalt(12, function (err, salt) {

        bcrypt.hash(req.payload.password, salt, function (err, hash) {

          user.password = hash;
          es.create(user, function () {

            signToken(user.email, function (token, esresponse) {

              return res(esresponse).header("Authorization", token);
            });
          });
        });
      });
    }
  });
}


function validate (req, res) {

  validateSession(req.payload.token, function (isValid, session) {

    if (!isValid) {
      return res({
        statusCode: 401,
        status: "Unauthorized",
        message: "Invalid token"
      }).code(401);
    }

    return res(session).header("Authorization", req.payload.token);
  });
}


function logout (req, res) {

  jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function (err, decoded) {

    var unauthorized = {
      statusCode: 401,
      status: "Unauthorized",
      message: "Invalid token"
    };

    if (err || !decoded) {
      return res(unauthorized).code(401);
    }

    var session = {
      index: "clerk",
      type: "sessions",
      id: decoded.jti
    };

    es.delete(session, function (ires) {

      return res(ires);
    });
  });
}


module.exports = {

  login: login,
  register: register,
  validate: validate,
  logout: logout
};
