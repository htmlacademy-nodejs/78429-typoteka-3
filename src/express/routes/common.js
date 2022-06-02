"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {View} = require(`../../constants`);
const commonRouter = new Router();

const {ARTICLES_PER_PAGE, LATEST_COMMENTS_COUNT} = View;

commonRouter.get(`/`, async (req, res) => {
  let {page = 1} = req.query;
  page = +page;

  const limit = ARTICLES_PER_PAGE;

  const offset = (page - 1) * ARTICLES_PER_PAGE;

  const [{count, articles}, allArticles, latestComments, categories] =
    await Promise.all([
      api.getArticles({offset, limit, comments: true}),
      api.getArticles({comments: true}),
      api.getComments({
        order: `DESC`,
        limit: LATEST_COMMENTS_COUNT,
        includeUser: true,
      }),
      api.getCategories(true),
    ]);

  const hotArticles = allArticles
    .map(({id, announce, comments}) => {
      return {
        id,
        announce,
        commentsLength: comments.length,
      };
    })
    .filter(({commentsLength}) => commentsLength > 0)
    .sort((art1, art2) => {
      return art2.commentsLength - art1.commentsLength;
    })
    .slice(0, 4);

  const totalPages = Math.ceil(count / ARTICLES_PER_PAGE);

  const notEmptyCategories = categories.filter(
      (category) => Number(category.count) > 0
  );
  res.render(`main`, {
    latestComments,
    hotArticles,
    articles,
    page,
    totalPages,
    categories: notEmptyCategories,
  });
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
