'use strict';

const {Router} = require(`express`);
const myRouter = new Router();

myRouter.get(`/`, (req, res) => res.send(`/my`));
myRouter.get(`/comments`, (req, res) => res.send(`/my/comments`));
myRouter.get(`/categories`, (req, res) => res.send(`/my/categories`));

module.exports = myRouter;
