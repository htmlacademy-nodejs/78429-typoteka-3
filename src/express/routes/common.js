"use strict";

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const {View} = require(`../../constants`);
const isGuest = require(`../middlewares/is-guest`);
const upload = require(`../middlewares/upload`);
const {prepareErrors} = require(`../../utils`);
const csrf = require(`csurf`);
const csrfProtection = csrf();
const commonRouter = new Router();

const {ARTICLES_PER_PAGE, LATEST_COMMENTS_COUNT, HOT_COMMENTS_COUNT} = View;

commonRouter.get(`/`, async (req, res) => {
  const {user} = req.session;
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
    .slice(0, HOT_COMMENTS_COUNT);

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
    user,
  });
});

commonRouter.get(`/register`, isGuest, (req, res) => res.render(`sign-up`));
commonRouter.post(`/register`, upload.single(`avatar`), async (req, res) => {
  const {body, file} = req;
  const userData = {
    avatar: file ? file.filename : ``,
    firstName: body[`user-first-name`],
    lastName: body[`user-last-name`],
    email: body[`user-email`],
    password: body[`user-password`],
    passwordRepeated: body[`user-password-again`],
  };

  try {
    await api.createUser(userData);
    res.redirect(`/login`);
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`sign-up`, {
      validationMessages,
      firstName: body[`user-first-name`],
      lastName: body[`user-last-name`],
      email: body[`user-email`],
    });
  }
});
commonRouter.get(`/login`, isGuest, csrfProtection, (req, res) => {
  res.render(`login`, {csrfToken: req.csrfToken()});
});
commonRouter.post(`/login`, csrfProtection, async (req, res) => {
  try {
    const user = await api.auth(req.body[`email`], req.body[`password`]);
    req.session.user = user;
    req.session.save(() => {
      res.redirect(`/`);
    });
  } catch (errors) {
    const validationMessages = prepareErrors(errors);
    res.render(`login`, {
      email: req.body[`email`],
      validationMessages,
      csrfToken: req.csrfToken(),
    });
  }
});

commonRouter.get(`/logout`, (req, res) => {
  req.session.destroy(() => {
    res.redirect(`/login`);
  });
});

commonRouter.get(`/search`, async (req, res) => {
  const {user} = req.session;
  const {query} = req.query;
  if (!query) {
    return res.render(`search`, {user});
  }
  try {
    const results = await api.search(query);
    return res.render(`search-result`, {
      user,
      results,
      query,
    });
  } catch (error) {
    return res.render(`search-result`, {
      user,
      results: [],
      query,
    });
  }
});
module.exports = commonRouter;
