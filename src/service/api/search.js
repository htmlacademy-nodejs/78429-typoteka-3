"use strict";

const {Router} = require(`express`);
const {HttpCode} = require(`../../constants`);

const route = new Router();

module.exports = (app, service) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    const searchText = req.query.query;

    if (!searchText) {
      res.status(HttpCode.BAD_REQUEST).json([]);
      return;
    }

    const searchArticles = await service.findAll(searchText);
    const statusCode = searchArticles.length > 0 ? HttpCode.OK : HttpCode.NOT_FOUND;
    res.status(statusCode)
            .json(searchArticles);
  });
};
