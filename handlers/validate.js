"use strict";

var validateSession = require("../lib/auth.js").validateSession;

function validate (req, res) {

  validateSession(req.headers.authorization, function (isValid, session) {

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
