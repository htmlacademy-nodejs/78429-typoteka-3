'use strict';

const {Router} = require(`express`);
const fs = require(`fs`).promises;
const apiRouter = new Router();

apiRouter.get(`/posts`, async (req, res) => {
  try {
    const fileContent = await fs.readFile(`mock.json`);
    const mocks = JSON.parse(fileContent);
    res.json(mocks);
  } catch (err) {
    res.json([]);
  }
});
module.exports = apiRouter;
