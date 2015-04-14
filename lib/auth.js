"use strict";

var es = require("esta");
var bcrypt = require("bcrypt");
var aguid = require("aguid");

function validate (email, password, cb) {

  var user = {
    index: process.env.ES_INDEX,
    type: "users",
    id: aguid(email),
    email: email
  };

  es.read(user, function (res) {
     //console.log(res);
    if (res.found) {
      bcrypt.compare(password, res._source.password, function (err, isValid) {
        cb(err, isValid, { id: res._id, email: res._source.email });
      });
    } else {
      cb(null, false);
    }
  });
}

module.exports = {
  validate: validate
};
