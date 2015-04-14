"use strict";

var verify = require("../lib/verify.js");

function validate (req, res) {

  verify(req.headers.authorization, function (isValid, session) {

    if (!isValid) {
      return res({
        statusCode: 401,
        status: "Unauthorized",
        message: "Invalid token"
      }).code(401);
    }
    return res(session).header("Authorization", req.headers.authorization);
  });
}

module.exports = validate;
