"use strict";

var es = require("esta");
var jwt = require("jsonwebtoken");

function verify (token, cb) {

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

module.exports = verify;
