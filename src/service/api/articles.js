"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);
const articleValidator = require(`../middlewares/articleValidator`);
const articleExists = require(`../middlewares/articleExists`);

module.exports = (app, articleService, commentService) => {
  const route = new Router();

  app.use(`/articles`, route);

  route.get(`/`, (req, res) => {
    const allArticles = articleService.findAll();
    return res.status(HttpCode.OK).json(allArticles);
  });

  route.post(`/`, articleValidator, (req, res) => {
    const article = articleService.create(req.body);

    return res.status(HttpCode.CREATED).json(article);
  });

  route.get(`/:articleId`, (req, res) => {
    const {articleId} = req.params;
    const article = articleService.findOne(articleId);

    if (!article) {
      return res.status(HttpCode.NOT_FOUND).send(`Not found with ${articleId}`);
    }

    return res.status(HttpCode.OK).json(article);
  });

  route.put(`/:articleId`, [articleValidator, articleExists(articleService)], (req, res) => {
    const {articleId} = req.params;
    const article = req.body;
    const updatedArticle = articleService.update(articleId, article);
    return res.status(HttpCode.OK).json(updatedArticle);
  });

  route.delete(`/:articleId`, articleExists(articleService), (req, res) => {
    const {articleId} = req.params;
    const deletedArticle = articleService.drop(articleId);
    return res.status(HttpCode.OK).json(deletedArticle);
  });

  route.get(`/:articleId/comments`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    return res.status(HttpCode.OK).json(article.comments);
  });

  route.post(`/:articleId/comments`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const {comment} = req.body;

    commentService.create(article.id, comment);
  });

  route.delete(`/:articleId/comments/:commentId`, articleExists(articleService), (req, res) => {
    const {article} = res.locals;
    const {articleId, commentId} = req.params;

    const comment = commentService.findOne(commentId, articleId);

    if (!comment) {
      return res.status(HttpCode.NOT_FOUND)
        .send(`Not found`);
    }

    const deletedComment = commentService.drop(article, commentId);
    return res.status(HttpCode.OK).json(deletedComment);
  });
};
