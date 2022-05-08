"use strict";

const {nanoid} = require(`nanoid`);
const {MAX_ID_LENGTH} = require(`../../constants`);

class CommentService {
  constructor(articles) {
    this._articles = articles;
  }

  _findArticle(articleId) {
    return this._articles.find((article) => article.id === articleId);
  }

  create(articleId, comment) {
    const requiredArticle = this._findArticle(articleId);
    const newComment = {id: nanoid(MAX_ID_LENGTH), text: comment};
    requiredArticle.comments.push(newComment);
    return newComment;
  }

  drop(article, commentId) {
    const comments = article.comments;
    const comment = comments.find((cmnt) => cmnt.id === commentId);

    if (!comment) {
      return null;
    }

    article.comments = article.comments.filter((item) => item.id !== commentId);
    return comment;
  }

  findAll(articleId) {
    const requiredArticle = this._findArticle(articleId);
    return requiredArticle.comments;
  }

  findOne(articleId, commentId) {
    const requiredArticle = this._findArticle(articleId);
    if (!requiredArticle) {
      return requiredArticle;
    }
    return requiredArticle.comments.find((comment) => comment.id === commentId);
  }
}

module.exports = CommentService;
