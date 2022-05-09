"use strict";

const {Router} = require(`express`);
const getMockData = require(`../../../lib/get-mock-data`);

const category = require(`./categories`);
const search = require(`./search`);
const article = require(`./articles`);

const {
  CategoryService,
  SearchService,
  ArticlesService,
  CommentService,
} = require(`../data-service`);

const app = new Router();

(async () => {
  const mockData = await getMockData();
  category(app, new CategoryService(mockData));
  search(app, new SearchService(mockData));
  article(app, new ArticlesService(mockData), new CommentService(mockData));
})();

module.exports = app;
