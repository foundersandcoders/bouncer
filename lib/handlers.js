"use strict";

var aguid = require("aguid");
var es = require("esta");
var bcrypt = require("bcrypt");
var signToken = require("./auth.js").signToken;

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

module.exports = {

  login: login,
  register: register
};
