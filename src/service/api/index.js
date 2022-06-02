"use strict";

const {Router} = require(`express`);

const category = require(`./categories`);
const search = require(`./search`);
const article = require(`./articles`);
const user = require(`./user`);
const comments = require(`./comments`);
const sequelize = require(`../lib/sequelize`);
const defineModels = require(`../models`);

const {
  CategoryService,
  SearchService,
  ArticleService,
  CommentService,
  UserService,
} = require(`../data-service`);

defineModels(sequelize);

const app = new Router();

(async () => {
  category(app, new CategoryService(sequelize));
  search(app, new SearchService(sequelize));
  article(app, new ArticleService(sequelize), new CommentService(sequelize));
  user(app, new UserService(sequelize));
  comments(app, new CommentService(sequelize));
})();

module.exports = app;
