"use strict";

var sign = require("../lib/sign.js");

function login (req, res) {

  sign(req.auth.credentials.email, function (token, esresponse) {

    return res(esresponse).header("Authorization", token);
  });
}

module.exports = login;
