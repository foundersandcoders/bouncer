"use strict";

var jwt = require("jsonwebtoken");
var aguid = require("aguid");
var bcrypt = require("bcrypt");
var is = require("torf");


module.exports = function (modelsObj, servicesObj) {

	var models   = modelsObj       || {};
	var Sessions = models.sessions || require("./models/sessions.js");
	var Users    = models.users    || require("./models/users.js");
	var services = servicesObj     || require("./services.js")();

	return {

		login: function (req, res) {

			services.sign(req.auth.credentials.email, function (token, response) {

				return res(response).header("Authorization", token);
			});
		},
		logout: function (req, res) {

			jwt.verify(req.headers.authorization, process.env.JWT_SECRET, function (err, decoded) {

				if (err || !decoded) {
					return res({
						statusCode: 401,
						status: "Unauthorized",
						message: "Invalid token"
					}).code(401);
				}

				Sessions.del({id: decoded.jti}, function (e, r) {

					if (e) {
						return res(e).code(500);
					} else {
						return res(r);
					}
				});
			});
		},
		signup: function (req, res) {

			if (!req.payload || !req.payload.email || !req.payload.password) {
				return res("no email or password provided").code(400);
			}

			var user = {
				id: aguid(req.payload.email),
				email: req.payload.email
			};

			Users.findOne({ id: user.id }, function (e, r) {

				if (e) {
					return res(e).code(500);
				} else if (is.ok(r)) {
					return res("already exists").code(400);
				} else {
					bcrypt.genSalt(12, function (err, salt) {

						bcrypt.hash(req.payload.password, salt, function (err, hash) {

							user.password = hash;
							Users.create(user, function (ie, ir) {

								if (ie) {
									return res(ie).code(500);
								} else {
									services.sign(ir.email, function (token, jr) {

										return res(jr).header("Authorization", token);
									});
								}
							});
						});
					});
				}
			});
		},
		validate: function (req, res) {

			services.verify(req.headers.authorization, function (isValid, session) {

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
	};
};