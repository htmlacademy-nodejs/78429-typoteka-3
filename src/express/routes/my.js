'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`my`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles();
  const comments = articles.map((item)=>item.comments).flat();
  res.render(`comments`, {comments});
});

myRouter.get(`/categories`, (req, res) => res.render(`all-categories`));

module.exports = myRouter;
