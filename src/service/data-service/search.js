"use strict";

class SearchService {
  constructor(articles) {
    this._articles = articles;
  }

  findAll(serchText) {
    return this._articles.filter((article) => article.title.indexOf(serchText) > -1);
  }
}

module.exports = SearchService;
