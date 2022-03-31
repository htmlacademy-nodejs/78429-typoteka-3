'use strict';

const {Router} = require(`express`);
const commonRouter = new Router();

commonRouter.get(`/`, (req, res) => res.send(`/`));
commonRouter.get(`/register`, (req, res) => res.send(`/register`));
commonRouter.get(`/login`, (req, res) => res.send(`/login`));
commonRouter.get(`/search`, (req, res) => res.send(`/search`));

module.exports = commonRouter;
