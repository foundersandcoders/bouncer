"use strict";

var es = require("esta");
var jwt = require("jsonwebtoken");

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

module.exports = logout;
