'use strict';

const CategoryService = require(`./categories`);
const SearchService = require(`./search`);
const ArticlesService = require(`./articles`);
const CommentService = require(`./comments`);

module.exports = {
  CategoryService,
  CommentService,
  SearchService,
  ArticlesService,
};
