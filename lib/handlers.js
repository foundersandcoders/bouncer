"use strict";

function getRoot (req, res) {

  res("Hello Root");
}

module.exports = {

  getRoot: getRoot
};
