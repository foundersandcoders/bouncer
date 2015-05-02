"use strict";


var bcrypt = require("bcrypt");
var aguid  = require("aguid");
var is     = require("torf");
var jwt    = require("jsonwebtoken");


module.exports = function (modelsObj) {

	var models   = modelsObj       || {};
	var Sessions = models.sessions || require("./models/sessions.js");
	var Users    = models.users    || require("./models/users.js");

	return {

		authenticate: function (email, password, cb) {

			var user = {
				id: aguid(email),
				email: email
			};

			Users.findOne(user, function (e, r) {

				if (is.ok(r)) {
					bcrypt.compare(password, r.password, function (err, isValid) {

						return cb(err, isValid, { id: r.id, email: r.email });
					});
				} else {
					return cb(null, false);
				}
			});
		},
		sign: function (email, cb) {

			var unsignedToken = {
				jti: aguid(),
				iss: aguid(email)
			};

			var token = jwt.sign(unsignedToken, process.env.JWT_SECRET);

			var session = {
				id: unsignedToken.jti,
				userId: unsignedToken.iss,
				ct: new Date().toISOString()
			};

			Sessions.create(session, function (e, r) {

				return cb(token, r);
			});
		},
		verify: function (token, cb) {

			jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {

				if (!decoded) {
					return cb(false);
				}

				var session = {id: decoded.jti};

				Sessions.findOne(session, function (e, r) {

					if (is.ok(r)) {
						return cb(true, {
							id: r.id,
							userId: r.userId,
							ct: r.ct
						});
					} else {
						return cb(false);
					}
				});
			});
		}
	};
};