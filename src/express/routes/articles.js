'use strict';

const {Router} = require(`express`);
const api = require(`../api`).getAPI();
const articlesRouter = new Router();


articlesRouter.get(`/`, (req, res) => res.render(`post-detail`));
articlesRouter.get(`/category/:id`, (req, res) => res.render(`articles-by-category`));
articlesRouter.get(`/add`, (req, res) => res.render(`post-add`));
articlesRouter.get(`/edit/:id`, async (req, res) => {
  const {id} = req.params;
  const article = await api.getArticle(id);
  res.render(`post-edit`, {article});
});
articlesRouter.get(`/:id`, (req, res) => res.render(`post-detail`));


articlesRouter.post(`/add`, async (req, res) => {
  const {body} = req;
  const newArticle = {
    title: body.title,
    photo: ``,
    categories: body.categories,
    announce: body.announce,
    fullText: body.fulltext,
    createdDate: body.date,
  };
  try {
    await api.createArticle(newArticle);
    res.redirect(`/my`);
  } catch (_err) {
    res.redirect(`back`);
  }
});

module.exports = articlesRouter;
