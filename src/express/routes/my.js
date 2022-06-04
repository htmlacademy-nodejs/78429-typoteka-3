"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const myRouter = new Router();

myRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles({comments: false});
  res.render(`my`, {articles});
});

myRouter.get(`/comments`, async (req, res) => {
  const articles = await api.getArticles({comments: true});
  const comments = articles.flatMap((item) => item.comments);
  res.render(`comments`, {comments});
});

myRouter.get(`/categories`, async (req, res) => {
  const categories = await api.getCategories();
  res.render(`all-categories`, {categories});
});

module.exports = myRouter;
