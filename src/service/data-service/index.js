'use strict';

const CategoryService = require(`./categories`);
const SearchService = require(`./search`);
const ArticleService = require(`./articles`);
const CommentService = require(`./comments`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  ArticleService,
};
