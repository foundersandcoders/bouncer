module.exports =  function (server, options, next) {

  "use strict";

  server.route(require("./routes.js"));
  next();

};
