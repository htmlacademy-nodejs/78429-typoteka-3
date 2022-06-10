"use strict";

module.exports = (req, res, next) => {
  const {user} = req.session;

  return !user ? res.redirect(`/login`) : next();
};
