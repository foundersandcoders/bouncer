"use strict";

var signToken = require("../lib/auth.js").signToken;

function login (req, res) {

  signToken(req.auth.credentials.email, function (token, esresponse) {

    return res(esresponse).header("Authorization", token);
  });
}

module.exports = login;
