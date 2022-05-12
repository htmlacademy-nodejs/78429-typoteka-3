'use strict';

const { Router } = require(`express`);
const api = require(`../api`).getAPI();
const commonRouter = new Router();

commonRouter.get(`/`, async (req, res) => {
  const articles = await api.getArticles();
  res.render(`main`, { articles });
});

commonRouter.get(`/register`, (req, res) => res.render(`sign-up`));
commonRouter.get(`/login`, (req, res) => res.render(`login`));


commonRouter.get(`/search`, async (req, res) => {
  const {query} = req.query;
  try {
    const results = await api.search(query);
    return res.render(`search-result`, {
      results,
      query,
    });
  } catch (error) {
    return res.render(`search`, {
      results: [],
      query,
    });
  }
});
module.exports = commonRouter;
