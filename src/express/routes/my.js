'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles({comments: false});
  res.render(`my`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  const comments = articles.flatMap((item)=>item.comments);
  res.render(`comments`, {comments});
});

myRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = myRouter;
